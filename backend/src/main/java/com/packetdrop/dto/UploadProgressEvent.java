package com.packetdrop.dto;

/**
 * Real-time upload progress event sent via WebSocket.
 */
public record UploadProgressEvent(
        String filename,
        long bytesReceived,
        long totalBytes,
        int percent,
        String speed,
        String eta,
        String bytesFormatted,
        String totalFormatted
) {}
