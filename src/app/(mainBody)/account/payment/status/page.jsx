"use client";

import Link from "next/link";

export default function TransactionConfirmationPage() {
  const transactionStatus = "SUCCESS"; // SUCCESS | FAILED | PENDING
  const transactionId = "TXN-9823749823";
  const paymentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
