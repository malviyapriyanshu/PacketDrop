package com.packetdrop.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.IOException;
import java.util.Objects;

@Service
public class ClipboardService {

    private String lastClipboardText = "";

    /**
     * Runs every 500 milliseconds and checks whether the system clipboard changed.
     */
    @Scheduled(fixedDelay = 500)
    public void monitorClipboard() {
        String currentText = readClipboardText();

        if (currentText == null || currentText.isBlank()) {
            return;
        }

        if (!Objects.equals(currentText, lastClipboardText)) {
            lastClipboardText = currentText;

            System.out.println("📋 Clipboard changed:");
            System.out.println(currentText);
            System.out.println("--------------------------------");
        }
    }

    /**
     * Reads plain text from the system clipboard.
     */
    private String readClipboardText() {
        try {
            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

            if (clipboard.isDataFlavorAvailable(DataFlavor.stringFlavor)) {
                return (String) clipboard.getData(DataFlavor.stringFlavor);
            }
        } catch (UnsupportedFlavorException | IOException e) {
            System.err.println("Failed to read clipboard: " + e.getMessage());
        } catch (IllegalStateException e) {
            System.err.println("Failed to read clipboard: " + e.getMessage());
        }

        return null;
    }
}