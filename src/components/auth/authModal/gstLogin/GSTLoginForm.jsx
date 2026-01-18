/**
 * GSTLoginForm Component
 * 
 * Business authentication form for GST-registered users with password validation.
 * Features GST number validation, password protection, and integration with business login API.
 * 
 * Key Features:
 * - GST number validation with specific format requirements
 * - Password validation and strength matching
 * - Forgot password flow integration
 * - Visual feedback for input states and validation errors
 * - Option to return to standard email login
 * - Loading states during authentication
 * 
 * @param {Function} setState - Parent state updater (gst → login/forgot)
 * @returns {JSX.Element} Business GST authentication form
 * 
 * @developer Simran Samir
 * @version 1.0
 */
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandleGSTLogin from "@/utils/hooks/useGSTLogin";
import { YupObject, gstnSchema, passwordSchema } from "@/utils/validation/ValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../../index.css";

const GSTLoginForm = ({ setState }) => {
  const { t } = useTranslation("common");
  const [showBoxMessage, setShowBoxMessage] = useState();
  const [focusedField, setFocusedField] = useState(null);
  const { mutate, isLoading } = useHandleGSTLogin(setShowBoxMessage, setState);

  return (
    <Formik
      initialValues={{
        gstn: "", 
        password: "",
      }}
      validationSchema={YupObject({
        gstn: gstnSchema, 
        password: passwordSchema,
      })}
      onSubmit={(values) => mutate(values)}
    >
      {({ errors, touched, values }) => (
        <div className="gst-login-container">
          {/* Error Message */}
          {showBoxMessage && (
            <div role="alert" className="login-error-message mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                      fill="#ef4444"/>
              </svg>
              <span>{showBoxMessage}</span>
            </div>
          )}
          
          <Form>
            {/* GST Number Input */}
            <div className="form-group mb-4">
              <label className="form-label fw-semibold mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L9.41 16.42L11 14.84V19H13V14.84L14.59 16.43L16 15.01L12.01 11L8 15.01Z" 
                        fill="currentColor"/>
                </svg>
                {t("GSTNumber") || "GST Number"}
              </label>
              <div className={`input-wrapper ${focusedField === 'gstn' || values.gstn ? 'filled' : ''} ${errors.gstn && touched.gstn ? 'error' : ''}`}>
                <Field 
                  name="gstn"
                  className="modern-input" 
                  placeholder={t("EnterGSTNumber") || "Enter GST number"} 
                  required 
                  onFocus={() => setFocusedField('gstn')}
                  onBlur={() => setFocusedField(null)}
                />
                {values.gstn && !errors.gstn && (
                  <div className="input-icon-right">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" 
                            fill="#4ade80"/>
                    </svg>
                  </div>
                )}
              </div>
              {errors.gstn && touched.gstn && (
                <div className="error-message">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                          fill="#ef4444"/>
                  </svg>
                  <span>{errors.gstn}</span>
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
                {setState && (
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => setState("forgot")}
                  >
                    {t("ForgotYourPassword")}?
                  </button>
                )}
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
              {t("LoginWithGST") || "Sign in with GST"}
            </Btn>

            {/* Back Button */}
            {setState && (
              <div className="text-center mt-4 pt-4 border-top">
                <button
                  type="button"
                  className="change-number-btn"
                  onClick={() => setState("login")}
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="me-2">
                    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" 
                          fill="#6c757d"/>
                  </svg>
                  {t("BackToEmailLogin") || "Back to email login"}
                </button>
              </div>
            )}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default GSTLoginForm;