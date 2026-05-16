package com.packetdrop.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileUtilTest {

    @Test
    void sanitizesPathTraversal() {
        assertEquals("evil.txt", FileUtil.sanitizeFilename("../../evil.txt"));
        assertEquals("file.txt", FileUtil.sanitizeFilename("../../../file.txt"));
    }

    @Test
    void sanitizesHiddenFiles() {
        String result = FileUtil.sanitizeFilename(".hidden_file.txt");
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void sanitizesSpecialChars() {
        String result = FileUtil.sanitizeFilename("f<i>l|e:n?a*m\"e.txt");
        assertFalse(result.contains("<"));
        assertFalse(result.contains(">"));
        assertTrue(result.endsWith(".txt"));
    }

    @Test
    void handlesBlanksAndDots() {
        assertEquals("unnamed_file", FileUtil.sanitizeFilename(""));
        assertEquals("unnamed_file", FileUtil.sanitizeFilename("   "));
        assertEquals("unnamed_file", FileUtil.sanitizeFilename("..."));
    }

    @Test
    void generatesUniqueFilenames(@TempDir Path tempDir) throws IOException {
        Files.writeString(tempDir.resolve("photo.jpg"), "test");
        String unique = FileUtil.getUniqueFilename(tempDir, "photo.jpg");
        assertEquals("photo (1).jpg", unique);

        Files.writeString(tempDir.resolve("photo (1).jpg"), "test");
        String unique2 = FileUtil.getUniqueFilename(tempDir, "photo.jpg");
        assertEquals("photo (2).jpg", unique2);
    }

    @Test
    void returnsOriginalIfUnique(@TempDir Path tempDir) {
        String result = FileUtil.getUniqueFilename(tempDir, "brand_new.zip");
        assertEquals("brand_new.zip", result);
    }

    @Test
    void ensureDirCreatesDirectory(@TempDir Path tempDir) throws IOException {
        Path sub = tempDir.resolve("a/b/c");
        FileUtil.ensureDir(sub);
        assertTrue(Files.exists(sub));
        assertTrue(Files.isDirectory(sub));
    }
}
