# ⚡ PacketDrop

**Lightning-fast local Wi-Fi file sharing across all devices.**

PacketDrop is a high-speed file sharing application that works entirely over your local network. No internet, no cloud, no accounts — just fast, direct transfers between any devices on the same Wi-Fi.

## 🏗️ Architecture

```
                 ┌─────────────────────────┐
                 │     React Frontend      │
                 │  (TypeScript + Tailwind) │
                 │       :5173 (dev)        │
                 └─────────┬───────────────┘
                           │ /api/* proxy
                 ┌─────────▼───────────────┐
                 │   Spring Boot Backend   │
                 │    (Java 21 + Maven)     │
                 │        :8080             │
                 ├─────────────────────────┤
                 │ REST API  │  WebSocket   │
                 │ /api/*    │  /ws (STOMP) │
                 ├─────────────────────────┤
                 │ Services:               │
                 │ · FileStorage (Stream)   │
                 │ · Checksum (SHA-256)     │
                 │ · QR Code (ZXing)        │
                 │ · mDNS (JmDNS)           │
                 │ · History (JSON)         │
                 └─────────────────────────┘
```

## ✨ Features

- 🚀 **LAN-Speed Transfers** — Files stream directly between devices
- 📱 **Cross-Platform** — Works on any device with a browser
- 🔒 **Private & Secure** — All data stays on your local network
- 📊 **Real-Time Progress** — Live upload speed, percentage, and ETA via WebSockets
- 🔐 **SHA-256 Checksums** — Every transfer is verified for integrity
- 📡 **mDNS Discovery** — Automatically discoverable on the local network
- 📷 **QR Code** — Scan to connect instantly from a mobile device
- 📁 **Any File Type** — Images, videos, PDFs, ZIPs — up to 10 GB
- 💾 **Streaming Architecture** — Constant memory usage regardless of file size
- 📋 **Transfer History** — Full log of all transfers with metadata

## 🚀 Quick Start

### Prerequisites

```bash
# Install Java 21 and Maven
brew install --cask temurin@21
brew install maven

# Verify
java --version   # 21.x
mvn --version    # 3.9+
node --version   # 20+
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/server-info` | Server info + QR code |
| POST | `/api/upload` | Upload files (multipart) |
| GET | `/api/files` | List uploaded files |
| GET | `/api/files/{name}/download` | Download file |
| DELETE | `/api/files/{name}` | Delete file |
| GET | `/api/history` | Transfer history |
| DELETE | `/api/history` | Clear history |

## 🔌 WebSocket Events

| Topic | Direction | Data |
|-------|-----------|------|
| `/topic/upload/progress` | Server → Client | Progress updates |
| `/topic/upload/complete` | Server → Client | Upload completion |
| `/topic/upload/error` | Server → Client | Upload errors |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.4 · Java 21 · Maven |
| Frontend | React 19 · TypeScript · Vite · Tailwind CSS 4 |
| Real-time | STOMP WebSocket |
| QR Code | ZXing |
| mDNS | JmDNS |
| Checksum | SHA-256 via DigestInputStream |
