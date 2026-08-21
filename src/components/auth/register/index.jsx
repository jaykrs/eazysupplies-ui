import RegisterForm from "@/components/auth/authModal/RegisterForm";
import Breadcrumbs from "@/utils/commonComponents/breadcrumb";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "reactstrap";

/**
 * The standalone registration route intentionally reuses the checkout/modal
 * registration form. Keeping one implementation prevents the public
 * /auth/register page from drifting away from the validated checkout flow.
 */
const RegisterContainer = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Breadcrumbs title={"Home"} subTitle={"CreateAccount"} />
      <section className="register-page section-t-space section-b-space">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" xl="7">
              <h3>{t("CreateAccount")}</h3>
              <div className="theme-card">
                <RegisterForm />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default RegisterContainer;
