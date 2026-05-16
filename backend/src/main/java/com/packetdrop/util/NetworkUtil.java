package com.packetdrop.util;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Network utility for detecting local LAN IP address.
 */
public final class NetworkUtil {

    private static final Set<Pattern> SKIP_PATTERNS = Set.of(
            Pattern.compile("^lo.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^docker.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^veth.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^br-.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^vmnet.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^utun.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^awdl.*", Pattern.CASE_INSENSITIVE),
            Pattern.compile("^llw.*", Pattern.CASE_INSENSITIVE)
    );

    private NetworkUtil() {}

    /**
     * Get the primary local LAN IPv4 address.
     *
     * @return LAN IP or "127.0.0.1" as fallback
     */
    public static String getLocalIP() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                NetworkInterface iface = interfaces.nextElement();
                if (iface.isLoopback() || !iface.isUp()) continue;

                String name = iface.getName();
                if (SKIP_PATTERNS.stream().anyMatch(p -> p.matcher(name).matches())) continue;

                Enumeration<InetAddress> addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress addr = addresses.nextElement();
                    if (addr instanceof java.net.Inet4Address && !addr.isLoopbackAddress()) {
                        return addr.getHostAddress();
                    }
                }
            }
        } catch (Exception e) {
            // Fall through to default
        }
        return "127.0.0.1";
    }

    /**
     * Build the full server URL.
     */
    public static String getServerURL(int port) {
        return "http://" + getLocalIP() + ":" + port;
    }
}
