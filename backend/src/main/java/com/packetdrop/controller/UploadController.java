package com.packetdrop.controller;

import com.packetdrop.dto.UploadResult;
import com.packetdrop.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 * File upload endpoint with streaming and progress.
 */
@Slf4j
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadFiles(
            @RequestParam("file") MultipartFile[] files,
            HttpServletRequest request) {

        String senderIp = request.getRemoteAddr();
        List<UploadResult> results = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                UploadResult result = fileStorageService.storeFile(file, senderIp);
                results.add(result);
                log.info("✅ Uploaded: {} ({}) from {}", result.filename(), result.sizeFormatted(), senderIp);
            } catch (Exception e) {
                log.error("❌ Upload failed for {}: {}", file.getOriginalFilename(), e.getMessage());
            }
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "files", results,
                "count", results.size()
        ));
    }
}
