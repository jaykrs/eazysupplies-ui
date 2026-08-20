import SimpleInputField from "@/components/widgets/inputFields/SimpleInputField";
import Btn from "@/elements/buttons/Btn";
import { YupObject, emailSchema, nameSchema, phoneSchema } from "@/utils/validation/ValidationSchema";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import { useState } from "react";
import { BASE_URL } from "@/utils/axiosUtils/API";
import { ToastNotification } from "@/utils/customFunctions/ToastNotification";

const ContactUsForm = () => {
  const { t } = useTranslation("common");
  const [submitting, setSubmitting] = useState(false);
  return (
    <Formik
      initialValues={{ name: "", email: "", phone: "", subject: "", message: "" }}
      validationSchema={YupObject({
        name: nameSchema,
        email: emailSchema,
        phone: phoneSchema,
        subject: nameSchema,
        message: nameSchema,
      })}
      onSubmit={async (values, { resetForm }) => {
        if (submitting) return;
        setSubmitting(true);
        try {
          const response = await fetch(`${BASE_URL}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result?.error || "Unable to send your message");
          resetForm();
          ToastNotification("success", "Your message has been submitted. Our team will contact you shortly.");
        } catch (error) {
          ToastNotification("error", error.message || "Unable to send your message. Please try again.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="theme-form contact-form">
          <Row className="g-4">
            <SimpleInputField
              nameList={[
                { name: "name", placeholder: t("EnterFullName"), toplabel: "FullName", colprops: { xs: 12 } },
                { name: "email", placeholder: t("EnterEmail"), toplabel: "EmailAddress", colprops: { md: 6 } },
                { name: "phone", placeholder: t("EnterPhoneNumber"), toplabel: "Phone Number", type: "number", colprops: { md: 6 } },
                { name: "subject", placeholder: t("EnterSubject"), toplabel: "Subject", colprops: { xs: 12 } },
                { name: "message", placeholder: t("EnterYourMessage"), toplabel: "Message", colprops: { xs: 12 }, type: "textarea", rows: 5 },
              ]}
            />
            <Col xs="12">
              <Btn className=" btn-solid" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : t("SendYourMessage")}
              </Btn>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default ContactUsForm;
