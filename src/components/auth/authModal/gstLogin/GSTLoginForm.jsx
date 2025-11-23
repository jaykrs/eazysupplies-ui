import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandleGSTLogin from "@/utils/hooks/useGSTLogin";
import { YupObject, gstnSchema, passwordSchema } from "@/utils/validation/ValidationSchema"; // Make sure gstnSchema is imported
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "reactstrap";

const GSTLoginForm = ({ setState }) => {
  const { t } = useTranslation("common");
  const [showBoxMessage, setShowBoxMessage] = useState();
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
      {({ errors, touched }) => (
        <div className="auth-form-box">
          {showBoxMessage && (
            <div role="alert" className="alert alert-danger login-alert">
              <i className="ri-error-warning-line"></i> {showBoxMessage}
            </div>
          )}
          <Form>
            <div className="auth-box mb-3">
              <Label htmlFor="gstn">{t("GSTNumber")}</Label>
              <Field 
                name="gstn"
                className="form-control" 
                id="gstn" 
                placeholder={t("EnterGSTNumber")} 
                required 
              />
              {errors.gstn && touched.gstn && (
                <ErrorMessage name="gstn" render={() => <div className="invalid-feedback d-block">{errors.gstn}</div>} />
              )}
            </div>
            
            <div className="auth-box mb-3">
              <Label htmlFor="password">{t("Password")}</Label>
              <Field 
                name="password" 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder={t("EnterYourPassword")} 
                required 
              />
              <a href={Href} className="forgot" onClick={() => setState?.("forgot")}>
                {t("ForgotYourPassword")}?
              </a>
            </div>
            
            <Btn type="submit" loading={isLoading}>
              {t("LoginWithGST")}
            </Btn>
            
            {setState && (
              <a onClick={() => setState("login")} href={Href} className="modal-back">
                <i className="ri-arrow-left-line"></i>
              </a>
            )}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default GSTLoginForm;