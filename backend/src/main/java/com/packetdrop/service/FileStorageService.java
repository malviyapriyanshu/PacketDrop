package com.packetdrop.service;

import com.packetdrop.config.AppProperties;
import com.packetdrop.dto.*;
import com.packetdrop.util.FileUtil;
import com.packetdrop.util.FormatUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.net.URLConnection;

/**
 * Core file storage service — handles uploads, listing, downloads, and deletion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final AppProperties appProperties;
    private final ChecksumService checksumService;
    private final HistoryService historyService;
    private final UploadProgressService progressService;

    private Path uploadDir;

    @PostConstruct
    public void init() throws IOException {
        uploadDir = Path.of(appProperties.getUploadDir()).toAbsolutePath();
        FileUtil.ensureDir(uploadDir);
    }

    /**
     * Store a file from a multipart upload, computing checksum and emitting progress.
     */
    public UploadResult storeFile(MultipartFile file, String senderIp) throws IOException {
        String safeName = FileUtil.sanitizeFilename(file.getOriginalFilename());
        String uniqueName = FileUtil.getUniqueFilename(uploadDir, safeName);
        Path targetPath = uploadDir.resolve(uniqueName);

        long totalBytes = file.getSize();
        long startTime = System.currentTimeMillis();
        long bytesWritten = 0;
        long lastEmit = 0;

        // Stream to disk with progress
        try (InputStream in = file.getInputStream();
             OutputStream out = new BufferedOutputStream(Files.newOutputStream(targetPath))) {

            byte[] buffer = new byte[65536]; // 64KB buffer
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                bytesWritten += bytesRead;

                // Throttle progress events to ~10/sec
                long now = System.currentTimeMillis();
                if (now - lastEmit >= 100) {
                    lastEmit = now;
                    emitProgress(uniqueName, bytesWritten, totalBytes, startTime);
                }
            }
        }

        // Compute checksum
        String checksum = checksumService.computeChecksum(targetPath);
        String timestamp = Instant.now().toString();

        // Record in history
        historyService.addRecord(new TransferHistoryDto(
                uniqueName, bytesWritten, timestamp, senderIp, checksum
        ));

        UploadResult result = new UploadResult(
                uniqueName, bytesWritten, FormatUtil.formatBytes(bytesWritten),
                getMimeType(uniqueName), checksum, timestamp
        );

        // Emit completion
        progressService.sendComplete(result);

        return result;
    }

    /**
     * List all uploaded files with metadata.
     */
    public List<FileMetadataDto> listFiles() throws IOException {
        if (!Files.exists(uploadDir)) return List.of();

        try (var stream = Files.list(uploadDir)) {
            return stream
                    .filter(Files::isRegularFile)
                    .filter(p -> !p.getFileName().toString().equals(".gitkeep"))
                    .map(this::toMetadata)
                    .sorted(Comparator.comparing(FileMetadataDto::modified).reversed())
                    .collect(Collectors.toList());
        }
    }

    /**
     * Get a file as a downloadable resource.
     */
    public Resource getFileAsResource(String filename) throws IOException {
        String safeName = Path.of(filename).getFileName().toString();
        Path filePath = uploadDir.resolve(safeName);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + safeName);
        }
        return new InputStreamResource(Files.newInputStream(filePath));
    }

    /**
     * Get file path for setting response headers.
     */
    public Path getFilePath(String filename) {
        String safeName = Path.of(filename).getFileName().toString();
        return uploadDir.resolve(safeName);
    }

    /**
     * Delete a file.
     */
    public void deleteFile(String filename) throws IOException {
        String safeName = Path.of(filename).getFileName().toString();
        Path filePath = uploadDir.resolve(safeName);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + safeName);
        }
        Files.delete(filePath);
    }

    private void emitProgress(String filename, long bytesReceived, long totalBytes, long startTime) {
        long elapsed = System.currentTimeMillis() - startTime;
        double elapsedSec = elapsed / 1000.0;
        double speed = elapsedSec > 0 ? bytesReceived / elapsedSec : 0;
        double remaining = speed > 0 ? (totalBytes - bytesReceived) / speed : 0;
        int percent = totalBytes > 0 ? (int) Math.min(100, bytesReceived * 100 / totalBytes) : 0;

        progressService.sendProgress(new UploadProgressEvent(
                filename, bytesReceived, totalBytes, percent,
                FormatUtil.formatSpeed(speed), FormatUtil.formatETA(remaining),
                FormatUtil.formatBytes(bytesReceived), FormatUtil.formatBytes(totalBytes)
        ));
    }

    private FileMetadataDto toMetadata(Path path) {
        try {
            var attrs = Files.readAttributes(path, java.nio.file.attribute.BasicFileAttributes.class);
            long size = attrs.size();
            String name = path.getFileName().toString();
            return new FileMetadataDto(
                    name, size, FormatUtil.formatBytes(size),
                    getMimeType(name), attrs.lastModifiedTime().toInstant().toString()
            );
        } catch (IOException e) {
            return new FileMetadataDto(path.getFileName().toString(), 0, "0 B", "unknown", "");
        }
    }

    private String getMimeType(String filename) {
        String mime = URLConnection.guessContentTypeFromName(filename);
        return mime != null ? mime : "application/octet-stream";
    }
}
