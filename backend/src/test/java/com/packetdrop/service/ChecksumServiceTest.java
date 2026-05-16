package com.packetdrop.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class ChecksumServiceTest {

    private final ChecksumService service = new ChecksumService();

    @Test
    void computesConsistentHash(@TempDir Path tempDir) throws IOException {
        Path file = tempDir.resolve("test.txt");
        Files.writeString(file, "Hello PacketDrop!");

        String hash1 = service.computeChecksum(file);
        String hash2 = service.computeChecksum(file);

        assertNotNull(hash1);
        assertEquals(64, hash1.length()); // SHA-256 = 64 hex chars
        assertEquals(hash1, hash2);
    }

    @Test
    void differentContentProducesDifferentHash(@TempDir Path tempDir) throws IOException {
        Path file1 = tempDir.resolve("a.txt");
        Path file2 = tempDir.resolve("b.txt");
        Files.writeString(file1, "Hello");
        Files.writeString(file2, "World");

        assertNotEquals(service.computeChecksum(file1), service.computeChecksum(file2));
    }

    @Test
    void computesChecksumOfBytes() {
        String hash = service.computeChecksum("test".getBytes());
        assertNotNull(hash);
        assertEquals(64, hash.length());
    }
}
