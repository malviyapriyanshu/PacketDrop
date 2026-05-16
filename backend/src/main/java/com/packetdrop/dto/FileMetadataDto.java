package com.packetdrop.dto;

/**
 * File metadata for listing uploaded files.
 */
public record FileMetadataDto(
        String filename,
        long size,
        String sizeFormatted,
        String mimeType,
        String modified
) {}
