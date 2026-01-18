/**
 * OTPVerificationForm Component
 * 
 * Secure OTP verification interface with 6-digit input, auto-submit, and resend functionality.
 * Features paste support, countdown timer, and visual feedback for phone authentication flow.
 * 
 * Key Features:
 * - 6-digit OTP input with individual digit boxes
 * - Auto-focus and navigation between fields
 * - Paste support for OTP from SMS
 * - Auto-submit when all digits are filled
 * - Resend OTP with 30-second countdown timer
 * - Visual progress indicators for filled digits
 * - Phone number display from stored cookie
 * - Option to change mobile number
 * - Loading states during verification
 * 
 * @param {Function} setState - Parent state updater (otp → number/loggedIn)
 * @param {Function} setShowBoxMessage - UI message callback for success/errors
 * @returns {JSX.Element} OTP verification form with interactive features
 * 
 * @developer Simran Samir
 * @version 1.0
 */
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useOtpVerification from "@/utils/hooks/useOtpVerification";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Input, Alert } from "reactstrap";
import "../../../index.css";

const OTPVerificationForm = ({ setState, setShowBoxMessage }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(30);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { t } = useTranslation("common");
  const otpRefs = useRef([]);
  
  // Use your existing OTP verification hook
  const { mutate: verifyOTP, isLoading } = useOtpVerification(setState, setShowBoxMessage);

  // Get phone number from cookies
  useEffect(() => {
    const savedPhone = document.cookie
      .split('; ')
      .find(row => row.startsWith('up='))
      ?.split('=')[1];
    
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first OTP input
  useEffect(() => {
    if (otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, []);

  const handleOTPSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      verifyOTP({ otp: otpString });
    }
  };

  const handleResendOTP = async () => {
    if (countdown === 0 && phoneNumber) {
      try {
        const response = await fetch(
          `/api/auth/login?action=generateotp&phone=${phoneNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.ok) {
          setCountdown(30); // Reset countdown
          // Show success message
          if (setShowBoxMessage) {
            setShowBoxMessage({ 
              type: 'success', 
              message: 'OTP resent successfully!' 
            });
          }
        }
      } catch (error) {
        console.error("Failed to resend OTP:", error);
      }
    }
  };

  const handleOTPChange = (element, index) => {
    const value = element.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    
    if (value.length > 1) {
      // Handle paste
      const digits = value.split("").slice(0, 6);
      digits.forEach((digit, idx) => {
        if (idx + index < 6) newOtp[idx + index] = digit;
      });
      setOtp(newOtp);
      
      const lastIndex = Math.min(index + digits.length - 1, 5);
      if (otpRefs.current[lastIndex]) otpRefs.current[lastIndex].focus();
    } else {
      // Single digit
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1].focus();
    }

    // Auto-submit when all digits are filled
    if (newOtp.every(digit => digit !== "") && newOtp.length === 6) {
      const otpString = newOtp.join("");
      setTimeout(() => handleOTPSubmit(), 300);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;
    
    const pasteArray = pasteData.split("");
    const newOtp = [...otp];
    
    pasteArray.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    
    setOtp(newOtp);
    
    const lastIndex = Math.min(pasteArray.length - 1, 5);
    if (otpRefs.current[lastIndex]) otpRefs.current[lastIndex].focus();
  };

  return (
    <div className="auth-form-box">
      {/* Center aligned header */}
      {/*<div className="text-center mb-5">
        <div className="otp-header-icon mb-3">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" 
                  fill="#4361ee" />
          </svg>
        </div>
        <h3 className="fw-bold mb-2">{t("EnterVerificationCode") || "Enter Verification Code"}</h3>
        <p className="text-muted mb-1">
          {t("CodeSentTo") || "We've sent a verification code to"} 
        </p>
        <p className="fw-semibold text-primary mb-0">+{phoneNumber}</p>
      </div>*/}

      {/* OTP Input Section */}
      <div className="auth-box mb-5">
        <div className="otp-container" onPaste={handlePaste}>
          <div className="otp-input-wrapper">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="otp-digit-container">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  className={`otp-digit ${otp[index] ? 'filled' : ''}`}
                  value={otp[index]}
                  onChange={(e) => handleOTPChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  disabled={isLoading}
                  data-index={index}
                />
                {index < 5 && <div className="otp-digit-separator"></div>}
              </div>
            ))}
          </div>
          
          {/* Progress dots */}
          <div className="otp-progress">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className={`otp-progress-dot ${otp[index] ? 'active' : ''}`}
              />
            ))}
          </div>
          
          <small className="text-muted d-block mt-4 text-center">
            {t("Enter6DigitCode") || "Enter the 6-digit verification code sent to your phone"}
          </small>
        </div>
      </div>

      {/* Verify Button */}
      <Btn
        type="button"
        loading={isLoading}
        className="w-100 mb-4 verify-btn"
        onClick={handleOTPSubmit}
        disabled={otp.some(digit => digit === "") || isLoading}
      >
        {t("VerifyAndLogin") || "Verify & Continue"}
      </Btn>

      {/* Resend OTP Section */}
      <div className="text-center mb-4">
        {countdown > 0 ? (
          <div className="resend-timer">
            <span className="text-muted">
              {t("ResendOTPIn") || "Request new code in"} 
            </span>
            <span className="countdown-text ms-1">{countdown}s</span>
          </div>
        ) : (
          <button
            type="button"
            className="resend-btn"
            onClick={handleResendOTP}
            disabled={isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" 
                    fill="#4361ee"/>
            </svg>
            {t("ResendOTP") || "Resend Code"}
          </button>
        )}
      </div>

      {/* Change Number */}
      <div className="text-center mt-4 pt-4 border-top">
        <button
          type="button"
          className="change-number-btn"
          onClick={() => {
            document.cookie = "up=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setState("number");
          }}
          disabled={isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" 
                  fill="#6c757d"/>
          </svg>
          {t("ChangeMobileNumber") || "Use different number"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationForm;