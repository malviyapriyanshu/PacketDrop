package com.packetdrop.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Custom application properties bound from application.yml.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "packetdrop")
public class AppProperties {

    /** Directory to store uploaded files */
    private String uploadDir = "uploads";

    /** Path to the transfer history JSON file */
    private String historyFile = "data/history.json";

    /** Application display name */
    private String appName = "PacketDrop";
}
