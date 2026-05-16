package com.packetdrop.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FormatUtilTest {

    @Test
    void formatsBytes() {
        assertEquals("0 B", FormatUtil.formatBytes(0));
        assertEquals("500.0 B", FormatUtil.formatBytes(500));
        assertEquals("1.0 KB", FormatUtil.formatBytes(1024));
        assertEquals("1.0 MB", FormatUtil.formatBytes(1024 * 1024));
        assertEquals("1.0 GB", FormatUtil.formatBytes(1024L * 1024 * 1024));
    }

    @Test
    void formatsSpeed() {
        assertEquals("0 B/s", FormatUtil.formatSpeed(0));
        assertEquals("1.0 MB/s", FormatUtil.formatSpeed(1024 * 1024));
    }

    @Test
    void formatsETA() {
        assertEquals("—", FormatUtil.formatETA(0));
        assertEquals("—", FormatUtil.formatETA(-5));
        assertEquals("5.0s", FormatUtil.formatETA(5));
        assertEquals("2m 30s", FormatUtil.formatETA(150));
        assertEquals("1h 30m", FormatUtil.formatETA(5400));
    }
}
