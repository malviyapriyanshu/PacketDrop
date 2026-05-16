package com.packetdrop.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

/**
 * QR code generation using Google ZXing.
 */
@Service
public class QrCodeService {

    private static final int QR_SIZE = 256;

    /**
     * Generate a QR code as a Base64 data URL.
     */
    public String generateQrDataUrl(String text) {
        try {
            byte[] pngBytes = generateQrBytes(text);
            String base64 = Base64.getEncoder().encodeToString(pngBytes);
            return "data:image/png;base64," + base64;
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Generate a QR code as raw PNG bytes.
     */
    public byte[] generateQrBytes(String text) throws WriterException, IOException {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(text, BarcodeFormat.QR_CODE, QR_SIZE, QR_SIZE);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);
        return out.toByteArray();
    }
}
