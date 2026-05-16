package com.packetdrop.util;

/**
 * Formatting utilities for bytes, speed, and time.
 */
public final class FormatUtil {

    private static final String[] UNITS = {"B", "KB", "MB", "GB", "TB"};

    private FormatUtil() {}

    /**
     * Format bytes into human-readable string.
     */
    public static String formatBytes(long bytes) {
        if (bytes <= 0) return "0 B";
        int i = (int) (Math.log(bytes) / Math.log(1024));
        i = Math.min(i, UNITS.length - 1);
        double value = bytes / Math.pow(1024, i);
        return String.format("%.1f %s", value, UNITS[i]);
    }

    /**
     * Format transfer speed.
     */
    public static String formatSpeed(double bytesPerSecond) {
        if (bytesPerSecond <= 0) return "0 B/s";
        return formatBytes((long) bytesPerSecond) + "/s";
    }

    /**
     * Format estimated time remaining.
     */
    public static String formatETA(double seconds) {
        if (seconds <= 0 || !Double.isFinite(seconds)) return "—";
        if (seconds < 60) return String.format("%.1fs", seconds);
        long mins = (long) (seconds / 60);
        long secs = (long) (seconds % 60);
        if (mins < 60) return secs > 0 ? String.format("%dm %ds", mins, secs) : String.format("%dm", mins);
        long hrs = mins / 60;
        long remMins = mins % 60;
        return remMins > 0 ? String.format("%dh %dm", hrs, remMins) : String.format("%dh", hrs);
    }
}
