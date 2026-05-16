package com.packetdrop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.packetdrop.config.AppProperties;
import com.packetdrop.dto.TransferHistoryDto;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * JSON-file-backed transfer history persistence.
 */
@Slf4j
@Service
public class HistoryService {

    private final Path historyFile;
    private final ObjectMapper mapper;

    public HistoryService(AppProperties props) {
        this.historyFile = Path.of(props.getHistoryFile());
        this.mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    }

    @PostConstruct
    public void init() {
        try {
            Path parent = historyFile.getParent();
            if (parent != null && !Files.exists(parent)) {
                Files.createDirectories(parent);
            }
            if (!Files.exists(historyFile)) {
                Files.writeString(historyFile, "[]");
            }
        } catch (IOException e) {
            log.warn("Could not initialize history file: {}", e.getMessage());
        }
    }

    /**
     * Get all transfer history, newest first.
     */
    public List<TransferHistoryDto> getHistory() {
        try {
            String json = Files.readString(historyFile);
            List<TransferHistoryDto> records = mapper.readValue(json, new TypeReference<>() {});
            List<TransferHistoryDto> reversed = new ArrayList<>(records);
            Collections.reverse(reversed);
            return reversed;
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Add a new transfer record.
     */
    public synchronized TransferHistoryDto addRecord(TransferHistoryDto record) {
        try {
            List<TransferHistoryDto> records;
            try {
                String json = Files.readString(historyFile);
                records = new ArrayList<>(mapper.readValue(json, new TypeReference<>() {}));
            } catch (Exception e) {
                records = new ArrayList<>();
            }
            records.add(record);
            Files.writeString(historyFile, mapper.writeValueAsString(records));
        } catch (IOException e) {
            log.error("Failed to write history: {}", e.getMessage());
        }
        return record;
    }

    /**
     * Clear all transfer history.
     */
    public void clearHistory() {
        try {
            Files.writeString(historyFile, "[]");
        } catch (IOException e) {
            log.error("Failed to clear history: {}", e.getMessage());
        }
    }
}
