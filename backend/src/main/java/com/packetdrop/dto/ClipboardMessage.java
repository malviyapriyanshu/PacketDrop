package com.packetdrop.dto;

import java.time.LocalDateTime;

public class ClipboardMessage {
    private String text;
    private String deviceId;
    private LocalDateTime timestamp;

    public ClipboardMessage() {
    }

    public ClipboardMessage(String text, String deviceId) {
        this.text = text;
        this.deviceId = deviceId;
        this.timestamp = LocalDateTime.now();
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
