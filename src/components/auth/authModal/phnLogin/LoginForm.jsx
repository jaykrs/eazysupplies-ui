{/*import SearchableSelectInput from "@/components/widgets/inputFields/SearchableSelectInput";
import { AllCountryCode } from "@/data/CountryCode";
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandlePhnLogin from "@/utils/hooks/usePhnLogin";
import { YupObject, nameSchema } from "@/utils/validation/ValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col } from "reactstrap";

const NumberLoginForm = ({ setState }) => {
  const { t } = useTranslation("common");
  const [showBoxMessage, setShowBoxMessage] = useState();
  const { mutate, isLoading } = useHandlePhnLogin(setShowBoxMessage,setState);

  return (
    <Formik
      initialValues={{
        country_code: "91",
        phone: "",
      }}
      validationSchema={YupObject({
        phone: nameSchema,
      })}
      onSubmit={mutate}
    >
      {({ errors, touched, setFieldValue }) => (
        <div className="auth-form-box ">
          {showBoxMessage && (
            <div role="alert" className="alert alert-danger login-alert">
              <i className="ri-error-warning-line"></i> {showBoxMessage}
            </div>
          )}
          <Form>
            <Col xs="12" className="phone-field mb-3">
              <div className="form-box">
                <SearchableSelectInput
                  nameList={[
                    {
                      name: "country_code",
                      notitle: "true",
                      inputprops: {
                        name: "country_code",
                        id: "country_code",
                        options: AllCountryCode,
                      },
                    },
                  ]}
                />
                <Field className="form-control" name="phone" placeholder={t("EnterPhoneNumber")} type="number" />
                {errors.phone && touched?.phone && <ErrorMessage render={() => <div className="invalid-feedback">{errors.phone}</div>} />}
              </div>
            </Col>
            <Btn  type="submit" loading={isLoading}>
              {t("SendOtp")}
            </Btn>
            <a onClick={() => setState("login")} href={Href} className="modal-back">
              <i className="ri-arrow-left-line"></i>
            </a>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default NumberLoginForm;*/}

/**
 * NumberLoginForm Component
 * 
 * Mobile number login form with combined country code selector and phone input.
 * Features integrated country code display, OTP generation, and Formik validation.
 * 
 * Key Features:
 * - Combined country code + phone input in single UI element
 * - Country code selection via hidden SearchableSelectInput
 * - Phone number validation (10-digit format)
 * - OTP generation via custom hook
 * - Visual feedback for focus states and errors
 * - Back navigation to main login
 * - Loading states during submission
 * 
 * @param {Function} setState - Parent state updater (number → otp)
 * @param {Function} setShowBoxMessage - UI message callback
 * @returns {JSX.Element} Mobile number login form for OTP authentication
 * 
 * @developer Simran Samir
 * @version 1.0
 */

import SearchableSelectInput from "@/components/widgets/inputFields/SearchableSelectInput";
import { AllCountryCode } from "@/data/CountryCode";
import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandlePhnLogin from "@/utils/hooks/usePhnLogin";
import { YupObject, nameSchema } from "@/utils/validation/ValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";
import "../../../../index.css";

const LoginForm = ({ setState, setShowBoxMessage }) => {
  const { t } = useTranslation("common");
  const { mutate, isLoading } = useHandlePhnLogin(setShowBoxMessage, setState);
  const [focusedField, setFocusedField] = useState(null);

  return (
    <Formik
      initialValues={{
        country_code: "91",
        phone: "",
      }}
      validationSchema={YupObject({
        phone: nameSchema,
      })}
      onSubmit={mutate}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <div className="auth-form-box">
          {/* Compact Header */}
          {/*<div className="text-center mb-4">
            <div className="phone-login-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18ZM12 19C12.55 19 13 18.55 13 18C13 17.45 12.55 17 12 17C11.45 17 11 17.45 11 18C11 18.55 11.45 19 12 19Z" 
                      fill="#4361ee" />
              </svg>
            </div>
            <h4 className="fw-bold mb-1">{t("EnterYourNumber") || "Enter Your Number"}</h4>
            <p className="text-muted mb-3 small">
              {t("LoginDescription") || "We'll send you a verification code"}
            </p>
          </div>*/}

          <Form>
            {/* Phone Input Section */}
            <div className="phone-input-container mb-4">
              <label className="form-label fw-semibold mb-2 d-block">
                Mobile Number
              </label>
              
              <div className="phone-input-combined">
                {/* Combined Country Code and Phone Number */}
                <div className={`phone-input-wrapper ${focusedField ? 'focused' : ''} ${errors.phone && touched?.phone ? 'error' : ''}`}>
                  {/* Country Code Badge - Not the select input */}
                  <div className="country-code-badge">
                    +{values.country_code}
                  </div>
                  
                  {/* Hidden SearchableSelectInput for country code */}
                  <div className="country-select-hidden">
                    <SearchableSelectInput
                      nameList={[
                        {
                          name: "country_code",
                          notitle: "true",
                          inputprops: {
                            name: "country_code",
                            id: "country_code",
                            options: AllCountryCode,
                            className: "country-code-select",
                            onChange: (e) => {
                              setFieldValue("country_code", e.target.value);
                            }
                          },
                        },
                      ]}
                    />
                  </div>
                  
                  {/* Vertical Divider */}
                  <div className="input-divider"></div>
                  
                  {/* Phone Number Input */}
                  <Field 
                    className="phone-number-input" 
                    name="phone" 
                    placeholder={t("EnterPhoneNumber") || "Phone number"} 
                    type="tel" 
                    maxLength="10"
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
              
              {errors.phone && touched?.phone && (
                <div className="error-message">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="me-1">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" 
                          fill="#ef4444"/>
                  </svg>
                  <span>{errors.phone}</span>
                </div>
              )}
              
              <div className="mt-2">
                <small className="text-muted small">
                  We'll send a 6-digit verification code
                </small>
              </div>
            </div>

            {/* Submit Button */}
            <Btn 
              type="submit" 
              loading={isLoading} 
              className="w-100 mb-3 verify-btn"
              disabled={!values.phone || isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" 
                      fill="currentColor"/>
              </svg>
              {t("SendOtp") || "Send Code"}
            </Btn>

            {/* Back Button */}
            <div className="text-center mt-3 pt-3 border-top">
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
                {t("BackToLogin") || "Back"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;