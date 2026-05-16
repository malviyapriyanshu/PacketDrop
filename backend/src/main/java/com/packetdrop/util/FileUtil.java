package com.packetdrop.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Pattern;

/**
 * File utility for safe filename handling.
 */
public final class FileUtil {

    private static final Pattern SAFE_CHARS = Pattern.compile("[^a-zA-Z0-9._\\-() ]");
    private static final Pattern MULTI_UNDERSCORE = Pattern.compile("_{2,}");
    private static final Pattern MULTI_SPACE = Pattern.compile(" {2,}");

    private FileUtil() {}

    /**
     * Sanitize a filename to prevent path traversal and injection.
     */
    public static String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) return "unnamed_file";

        // Strip directory components
        String safe = Path.of(filename).getFileName().toString();

        // Remove null bytes
        safe = safe.replace("\0", "");

        // Replace dangerous characters
        safe = SAFE_CHARS.matcher(safe).replaceAll("_");

        // Trim dots and spaces from edges
        safe = safe.replaceAll("^[\\s.]+|[\\s.]+$", "");

        // Collapse multiples
        safe = MULTI_UNDERSCORE.matcher(safe).replaceAll("_");
        safe = MULTI_SPACE.matcher(safe).replaceAll(" ");

        if (safe.isBlank()) return "unnamed_file";

        // Limit length
        if (safe.length() > 200) {
            String ext = getExtension(safe);
            String name = safe.substring(0, 200 - ext.length());
            safe = name + ext;
        }

        return safe;
    }

    /**
     * Generate a unique filename if a file already exists.
     * Pattern: photo.jpg → photo (1).jpg → photo (2).jpg
     */
    public static String getUniqueFilename(Path dir, String filename) {
        String ext = getExtension(filename);
        String name = filename.substring(0, filename.length() - ext.length());
        String candidate = filename;
        int counter = 0;

        while (Files.exists(dir.resolve(candidate))) {
            counter++;
            candidate = name + " (" + counter + ")" + ext;
        }

        return candidate;
    }

    /**
     * Ensure a directory exists.
     */
    public static void ensureDir(Path dir) throws IOException {
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }
    }

    private static String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }
}
