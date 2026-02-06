import { NextResponse } from "next/server";

const MESSAGES = { SERVER_ERROR: "Internal server error" }


var crypto = require("crypto");

const GCM_TAG_LENGTH = 16; // 128 bits
const IV_LENGTH = 12;
const SECRET_KEY = process.env.SECRET_KEY || '';
/**
 * Convert hex string to Buffer (same as Java hexToAESKey)
 */
function hexToAESKey(hexKey) {
    return Buffer.from(hexKey, "hex");
}

/**
 * Base64 URL-safe encode
 */
function base64UrlEncode(buffer) {
    return buffer
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Base64 URL-safe decode
 */
function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return Buffer.from(str, "base64");
}

function decrypt(encryptedData, secretKey) {
    const combined = base64UrlDecode(encryptedData);
    const key = hexToAESKey(secretKey);

    const iv = combined.slice(0, IV_LENGTH);
    const authTag = combined.slice(combined.length - GCM_TAG_LENGTH);
    const encrypted = combined.slice(
        IV_LENGTH,
        combined.length - GCM_TAG_LENGTH
    );

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentResponse = searchParams.get("response");
        const resp = decrypt(paymentResponse, SECRET_KEY);
        const jsonObject = JSON.parse(resp);
        if (paymentResponse) {
            return NextResponse.json({ transactionId: jsonObject.transactionId, payerName: jsonObject.payerName, transactionStatus: jsonObject.transactionStatus, transactionAmt: jsonObject.amountPaid }, { status: 200 });
        }
    } catch (e) { console.log(e); }
    return NextResponse.json({ error: MESSAGES.SERVER_ERROR }, { status: 500 });
}