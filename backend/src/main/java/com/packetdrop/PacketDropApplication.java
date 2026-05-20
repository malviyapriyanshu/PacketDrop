package com.packetdrop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * PacketDrop — Lightning-fast local Wi-Fi file sharing.
 */
@SpringBootApplication
@EnableScheduling
public class PacketDropApplication {

    public static void main(String[] args) {
        System.setProperty("java.awt.headless", "false");
        SpringApplication.run(PacketDropApplication.class, args);
    }
}
