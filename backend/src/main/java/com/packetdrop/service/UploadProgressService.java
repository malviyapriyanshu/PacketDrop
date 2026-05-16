package com.packetdrop.service;

import com.packetdrop.dto.UploadProgressEvent;
import com.packetdrop.dto.UploadResult;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * WebSocket progress broadcasting via STOMP.
 */
@Service
@RequiredArgsConstructor
public class UploadProgressService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send upload progress to all subscribers.
     */
    public void sendProgress(UploadProgressEvent event) {
        messagingTemplate.convertAndSend("/topic/upload/progress", event);
    }

    /**
     * Send upload completion event.
     */
    public void sendComplete(UploadResult result) {
        messagingTemplate.convertAndSend("/topic/upload/complete", result);
    }

    /**
     * Send upload error event.
     */
    public void sendError(String filename, String message) {
        messagingTemplate.convertAndSend("/topic/upload/error",
                java.util.Map.of("filename", filename, "message", message));
    }
}
