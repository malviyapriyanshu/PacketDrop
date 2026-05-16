package com.packetdrop.controller;

import com.packetdrop.config.AppProperties;
import com.packetdrop.dto.ServerInfoResponse;
import com.packetdrop.service.QrCodeService;
import com.packetdrop.util.FormatUtil;
import com.packetdrop.util.NetworkUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Server info endpoint — provides connection details and QR code.
 */
@RestController
@RequestMapping("/api/server-info")
@RequiredArgsConstructor
public class ServerInfoController {

    private final AppProperties appProperties;
    private final QrCodeService qrCodeService;

    @Value("${server.port:8080}")
    private int port;

    @Value("${spring.servlet.multipart.max-file-size:10GB}")
    private String maxFileSizeConfig;

    @GetMapping
    public ServerInfoResponse getServerInfo() {
        String url = NetworkUtil.getServerURL(port);
        String qrDataUrl = qrCodeService.generateQrDataUrl(url);
        long maxSize = parseSize(maxFileSizeConfig);

        return new ServerInfoResponse(
                appProperties.getAppName(),
                NetworkUtil.getLocalIP(),
                port,
                url,
                qrDataUrl,
                maxSize,
                FormatUtil.formatBytes(maxSize)
        );
    }

    private long parseSize(String size) {
        size = size.toUpperCase().trim();
        if (size.endsWith("GB")) return Long.parseLong(size.replace("GB", "").trim()) * 1024L * 1024L * 1024L;
        if (size.endsWith("MB")) return Long.parseLong(size.replace("MB", "").trim()) * 1024L * 1024L;
        if (size.endsWith("KB")) return Long.parseLong(size.replace("KB", "").trim()) * 1024L;
        return Long.parseLong(size);
    }
}
