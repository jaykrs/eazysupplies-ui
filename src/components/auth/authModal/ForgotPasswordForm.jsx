/**
 * ForgotPasswordForm Component
 * 
 * Password recovery form for requesting reset links via email.
 * Features Formik validation, real-time feedback, and integration with password reset API.
 * 
 * Key Features:
 * - Email validation with Yup schema
 * - Visual feedback for input states and validation
 * - Success/error message display for API responses
 * - Loading states during submission
 * - Option to return to login screen
 * - Clear instruction text for user guidance
 * 
 * @param {Function} setState - Parent state updater (forgot → login)
 * @param {Function} setPrevState - Previous state tracker
 * @returns {JSX.Element} Password recovery form with validation
 * 
 * @developer Simran Samir
 * @version 1.0
 */
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandleForgotPassword, { ForgotPasswordSchema } from "@/utils/hooks/useForgotPassword";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../index.css";

const ForgotPasswordForm = ({ setState, setPrevState }) => {
  const [showBoxMessage, setShowBoxMessage] = useState();
  const [focusedField, setFocusedField] = useState(null);
  const { t } = useTranslation("common");
  const { mutate, isLoading } = useHandleForgotPassword(setShowBoxMessage, setState);
  
  return (
    <div className="forgot-password-container">
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => mutate(values)}
      >
        {({ errors, touched, values }) => (
          <Form>
            {/* Success/Error Message */}
            {showBoxMessage && (
              <div role="alert" className="login-error-message mb-4">
                {showBoxMessage.type === 'success' ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" 
                            fill="#10b981"/>
                    </svg>
                    <span style={{ color: '#10b981' }}>{showBoxMessage.message}</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                            fill="#ef4444"/>
                    </svg>
                    <span>{showBoxMessage.message || showBoxMessage}</span>
                  </>
                )}
              </div>
            )}

            {/* Instruction Text */}
            {/*<div className="instruction-text mb-4">
              <p className="text-muted small text-center">
                {t("ForgotPasswordInstructions") || "Enter your email address and we'll send you a link to reset your password."}
              </p>
            </div>*/}

            {/* Email Input */}
            <div className="form-group mb-4">
              <label className="form-label fw-semibold mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" 
                        fill="currentColor"/>
                </svg>
                {t("Email")}
              </label>
              <div className={`input-wrapper ${focusedField === 'email' || values.email ? 'filled' : ''} ${errors.email && touched.email ? 'error' : ''}`}>
                <Field 
                  name="email" 
                  className="modern-input" 
                  placeholder={t("EnterYourEmail") || "Enter your email address"} 
                  required 
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
                {values.email && !errors.email && (
                  <div className="input-icon-right">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" 
                            fill="#4ade80"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <div className="error-message">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                          fill="#ef4444"/>
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Btn 
              type="submit" 
              loading={isLoading} 
              className="w-100 verify-btn"
              disabled={isLoading || !values.email}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" 
                      fill="currentColor"/>
              </svg>
              {t("SendOTP") || "Send OTP"}
            </Btn>

            {/* Back to Login */}
            <div className="text-center mt-4 pt-4 border-top">
              <button
                type="button"
                className="back-to-login-btn"
                onClick={() => setState("login")}
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" 
                        fill="#6c757d"/>
                </svg>
                {t("BackToLogin") || "Back to login"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;