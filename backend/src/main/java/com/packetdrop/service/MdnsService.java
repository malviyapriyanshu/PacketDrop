package com.packetdrop.service;

import com.packetdrop.config.AppProperties;
import com.packetdrop.util.NetworkUtil;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceInfo;
import java.net.InetAddress;

/**
 * mDNS service advertisement using JmDNS.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MdnsService {

    private final AppProperties appProperties;

    @Value("${server.port:8080}")
    private int port;

    private JmDNS jmdns;

    @PostConstruct
    public void advertise() {
        try {
            String ip = NetworkUtil.getLocalIP();
            jmdns = JmDNS.create(InetAddress.getByName(ip));

            ServiceInfo serviceInfo = ServiceInfo.create(
                    "_packetdrop._tcp.local.",
                    appProperties.getAppName(),
                    port,
                    "PacketDrop File Sharing v1.0.0"
            );
            jmdns.registerService(serviceInfo);
            log.info("📡 mDNS: Advertising _packetdrop._tcp on port {}", port);
        } catch (Exception e) {
            log.warn("⚠️  mDNS advertisement failed: {}", e.getMessage());
        }
    }

    @PreDestroy
    public void unpublish() {
        try {
            if (jmdns != null) {
                jmdns.unregisterAllServices();
                jmdns.close();
            }
        } catch (Exception e) {
            // Ignore cleanup errors
        }
    }
}
