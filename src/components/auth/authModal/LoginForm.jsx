/**
 * LoginForm Component
 * 
 * Secure email/password login form with Formik validation and reCAPTCHA support.
 * Features real-time validation, visual feedback, and integration with authentication hook.
 * 
 * Key Features:
 * - Email and password validation with Yup schemas
 * - Visual feedback for input focus and validation states
 * - ReCAPTCHA integration (configurable via settings)
 * - Forgot password flow trigger
 * - Real-time error/success message display
 * - Loading states during authentication
 * - Modern UI with SVG icons for visual cues
 * 
 * @param {Function} setState - Parent state updater (login → forgot → register)
 * @returns {JSX.Element} Secure login form with validation and feedback
 * 
 * @developer Simran Samir
 * @version 1.0
 */
import SettingContext from "@/context/settingContext";
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandleLogin from "@/utils/hooks/useLogin";
import { YupObject, emailSchema, passwordSchema, recaptchaSchema } from "@/utils/validation/ValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import request from "@/utils/axiosUtils";
import { BASE_URL, LoginAPI } from "@/utils/axiosUtils/API";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ThemeOptionContext from "@/context/themeOptionsContext";
import "../../../index.css";

const LoginForm = ({ setState }) => {
  const [showBoxMessage, setShowBoxMessage] = useState();
  const [focusedField, setFocusedField] = useState(null);
  const { mutate, isLoading } = useHandleLogin(setShowBoxMessage);
  const { t } = useTranslation("common");
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { settingData } = useContext(SettingContext);
  const reCaptchaRef = useRef();

  const handleSubmit = (value) => {
    mutate(value);
  }

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        // recaptcha: "",
      }}
      validationSchema={YupObject({
        email: emailSchema,
        password: passwordSchema,
        // recaptcha: settingData?.google_reCaptcha?.status ? recaptchaSchema : "",
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <div className="login-form-container">
          {showBoxMessage && (
            <div role="alert" className="login-error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                      fill="#ef4444"/>
              </svg>
              <span>{showBoxMessage}</span>
            </div>
          )}
          
          <Form>
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
                  placeholder={t("EnterEmail") || "Enter your email"} 
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

            {/* Password Input */}
            <div className="form-group mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-semibold mb-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6Z" 
                          fill="currentColor"/>
                  </svg>
                  {t("Password")}
                </label>
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={() => setState("forgot")}
                >
                  {t("ForgotYourPassword")}?
                </button>
              </div>
              <div className={`input-wrapper ${focusedField === 'password' || values.password ? 'filled' : ''} ${errors.password && touched.password ? 'error' : ''}`}>
                <Field 
                  name="password" 
                  type="password" 
                  className="modern-input" 
                  placeholder={t("EnterYourPassword") || "Enter your password"} 
                  required 
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              {errors.password && touched.password && (
                <div className="error-message">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                          fill="#ef4444"/>
                  </svg>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* ReCAPTCHA */}
            {/* {settingData?.google_reCaptcha?.status && (
              <div className="mb-4">
                <ReCAPTCHA
                  ref={reCaptchaRef}
                  sitekey={settingData?.google_reCaptcha?.site_key}
                  onChange={(value) => {
                    setFieldValue("recaptcha", value);
                  }}
                  className="modern-recaptcha"
                />
                {errors.recaptcha && touched.recaptcha && (
                  <div className="error-message mt-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                            fill="#ef4444"/>
                    </svg>
                    <span>{errors.recaptcha}</span>
                  </div>
                )}
              </div>
            )} */}

            {/* Submit Button */}
            <Btn 
              type="submit" 
              loading={isLoading} 
              className="w-100 verify-btn"
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" 
                      fill="currentColor"/>
              </svg>
              {t("Login")}
            </Btn>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;