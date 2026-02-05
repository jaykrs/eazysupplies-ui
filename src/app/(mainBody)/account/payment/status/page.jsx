"use client";

import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { crypto } from 'crypto';
export default function TransactionConfirmationPage() {
  const searchParams = useSearchParams();
  const paymentResponse = searchParams.get('response'); 
  const SECRET_KEY = "E0A9DC01CBA5A67F2A620931E1945D07A6B76788BC2508CA954CB5A93DD4071A";
  const paymentjson = decrypt(paymentResponse, SECRET_KEY);
  console.log(paymentjson);
  const transactionStatus = "SUCCESS"; // SUCCESS | FAILED | PENDING
  const transactionId = paymentjson.transactionId;
  const paymentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const GCM_TAG_LENGTH = 16; // 128 bits
const IV_LENGTH = 12;

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

  const isSuccess = transactionStatus === "SUCCESS";

  return (
    <div className="page-wrapper">
      <div className="card">
        <div className={`status-icon ${isSuccess ? "success" : "failed"}`}>
          {isSuccess ? "✓" : "✕"}
        </div>

        <h1 className="title">
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </h1>

        <p className="subtitle">
          {isSuccess
            ? "Thank you for your purchase. Your transaction was completed successfully."
            : "Unfortunately, your payment could not be processed."}
        </p>

        <div className="details">
          <div className="detail-row">
            <span>Transaction ID</span>
            <strong>{transactionId}</strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <strong className={isSuccess ? "text-success" : "text-failed"}>
              {transactionStatus}
            </strong>
          </div>

          <div className="detail-row">
            <span>Payment Date</span>
            <strong>{paymentDate}</strong>
          </div>
        </div>

        <Link href="/account/dashboard" className="home-btn">
          Return to Home
        </Link>
      </div>

      {/* ✅ Styles go here */}
      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: #f5f7fb;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .status-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #fff;
        }

        .status-icon.success {
          background: #16a34a;
        }

        .status-icon.failed {
          background: #dc2626;
        }

        .title {
          font-size: 22px;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .details {
          margin-bottom: 24px;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 16px;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          align-items: center;
        }

        .detail-row span {
          color: #6b7280;
        }

        .detail-row strong {
          text-align: right;
          word-break: break-all;
        }

        .text-success {
          color: #16a34a;
        }

        .text-failed {
          color: #dc2626;
        }

        .home-btn {
          display: inline-block;
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
        }

        .home-btn:hover {
          background: #1e40af;
        }

        /* 📱 Mobile layout */
        @media (max-width: 640px) {
          .detail-row {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .detail-row strong {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
