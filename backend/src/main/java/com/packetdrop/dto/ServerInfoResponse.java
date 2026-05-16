package com.packetdrop.dto;

/**
 * Server connection information response.
 */
public record ServerInfoResponse(
        String appName,
        String localIP,
        int port,
        String url,
        String qrDataUrl,
        long maxFileSize,
        String maxFileSizeFormatted
) {}
