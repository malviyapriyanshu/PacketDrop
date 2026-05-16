package com.packetdrop.config;

import com.packetdrop.util.NetworkUtil;
import com.packetdrop.util.FormatUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Prints startup banner with connection info.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupBanner implements CommandLineRunner {

    private final AppProperties appProperties;

    @Value("${server.port:8080}")
    private int port;

    @Override
    public void run(String... args) {
        String url = NetworkUtil.getServerURL(port);
        System.out.println();
        System.out.println("  ╔══════════════════════════════════════════════════╗");
        System.out.println("  ║                                                  ║");
        System.out.println("  ║            ⚡ PacketDrop is running               ║");
        System.out.println("  ║                                                  ║");
        System.out.println("  ╚══════════════════════════════════════════════════╝");
        System.out.println();
        System.out.println("  🌐 Local:    http://localhost:" + port);
        System.out.println("  📡 Network:  " + url);
        System.out.println("  📁 Uploads:  " + appProperties.getUploadDir());
        System.out.println("  📱 Open " + url + " on another device");
        System.out.println();
        System.out.println("  Ready to receive files! 🚀");
        System.out.println();
    }
}
