package com.packetdrop.controller;

import com.packetdrop.dto.FileMetadataDto;
import com.packetdrop.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

/**
 * File management — list, download, delete.
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping
    public Map<String, Object> listFiles() throws IOException {
        List<FileMetadataDto> files = fileStorageService.listFiles();
        return Map.of("files", files, "count", files.size());
    }

    @GetMapping("/{filename}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
        Resource resource = fileStorageService.getFileAsResource(filename);
        Path filePath = fileStorageService.getFilePath(filename);

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{filename}")
    public Map<String, Object> deleteFile(@PathVariable String filename) throws IOException {
        fileStorageService.deleteFile(filename);
        return Map.of("success", true, "message", "Deleted " + filename, "filename", filename);
    }
}
