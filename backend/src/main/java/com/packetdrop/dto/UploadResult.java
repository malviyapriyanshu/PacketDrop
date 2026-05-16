package com.packetdrop.dto;

/**
 * Upload completion result for a single file.
 */
public record UploadResult(
        String filename,
        long size,
        String sizeFormatted,
        String mimeType,
        String checksum,
        String timestamp
) {}
