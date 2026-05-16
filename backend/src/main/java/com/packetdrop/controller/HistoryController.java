package com.packetdrop.controller;

import com.packetdrop.dto.TransferHistoryDto;
import com.packetdrop.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Transfer history endpoint.
 */
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public Map<String, Object> getHistory() {
        List<TransferHistoryDto> history = historyService.getHistory();
        return Map.of("history", history, "count", history.size());
    }

    @DeleteMapping
    public Map<String, Object> clearHistory() {
        historyService.clearHistory();
        return Map.of("success", true, "message", "History cleared");
    }
}
