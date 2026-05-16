package com.packetdrop.dto;

/**
 * Transfer history record.
 */
public record TransferHistoryDto(
        String filename,
        long size,
        String timestamp,
        String senderIp,
        String checksum
) {}
