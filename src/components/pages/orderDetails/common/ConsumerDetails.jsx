import SettingContext from "@/context/settingContext";
import request from "@/utils/axiosUtils";
import { CountryAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery"; import Link from "next/link";
;
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Input, Label, Row } from "reactstrap";

const ConsumerDetails = ({ data }) => {
  const { convertCurrency } = useContext(SettingContext);
  const { t } = useTranslation("common");
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState("offline")
  const { data: countryData } = useFetchQuery([CountryAPI], () => request({ url: CountryAPI }, router), {
    refetchOnWindowFocus: false,
    select: (res) => res.data.map((country) => ({ id: country.id, name: country.name, state: country.state })),
  });

  const getCountryName = (countryId) => {
    const country = countryData?.find((country) => country.id === countryId);
    if (country) {
      return country.name;
    }
    return "";
  };

  const getStateName = (stateId, countryId) => {
    const state = countryData?.find((country) => country.id === countryId)?.state.find((state) => state.id === stateId);
    if (state) {
      return state.name;
    }
    return "";
  };

  const calculatePrice = (items) => {
    const total = items?.reduce((sum, item) => sum + item?.price, 0);
    return total.toFixed(2)
  }

  return (
    <>
      <div className="summary-details my-3">
        <Row>
          <Col xxl={8} lg={12} md={7}>
            <Card>
              <CardBody>
                <h3 className="order-title">{t("ConsumerDetails")}</h3>
                <div className="customer-detail tracking-wrapper">
                  <ul className="row g-3">
                    {data?.billing_address ? (
                      <li className="col-sm-6">
                        <label>{t("BillingAddress")}:</label>
                        <h4>
                          {data.billing_address.street}
                          {data.billing_address.city} {getStateName(data.billing_address.state_id, data.billing_address.country_id)} {getCountryName(data.billing_address.country_id)} {data.billing_address.pincode} <br />
                          {t("Phone")} : +{data.billing_address.country_code} {data.billing_address.phone}
                        </h4>
                      </li>
                    ) : null}
                    {data?.shipping ? (
                      <li className="col-sm-6">
                        <label>{t("ShippingAddress")}:</label>
                        <h4>
                          {data?.shipping?.address}
                          {data?.shipping?.city} {data?.shipping?.country} {data?.shipping?.postalCode} <br />
                          {t("Phone")} : {data?.user?.countryCode} {data?.user?.phone}
                        </h4>
                      </li>
                    ) : null}
                    {!data?.is_digital_only && data?.delivery_description ? (
                      <li className="col-sm-6">
                        <label>{t("DeliverySlot")}:</label>
                        <h4>{data.delivery_description}</h4>
                      </li>
                    ) : null}
                    {data?.payment_method ? (
                      <li className="col-3">
                        <label>{t("PaymentMode")}:</label>
                        <div className="d-flex align-items-center gap-2">
                          <h4>{data.payment_method?.toUpperCase()}</h4>
                        </div>
                      </li>
                    ) : null}
                    {data?.payment_status ? (
                      <li className="col-3">
                        <label>{t("PaymentStatus")}:</label>
                        <div className="d-flex align-items-center gap-2">
                          <h4>{data?.payment_status}</h4>
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xxl={4} lg={12} md={5} className="cart-section">
            <Card className="h-m30">
              <CardBody>
                <h3 className="order-title">{"summary"}</h3>
                <div className="tracking-total tracking-wrapper">
                  <ul>
                    <li>
                      {t("Subtotal")} <span>{data?.items ? convertCurrency(calculatePrice(data?.items)) : convertCurrency(0)}</span>
                    </li>
                    <li>
                      {t("Shipping")} <span>{data?.shipping_total ? convertCurrency(data?.shipping_total) : convertCurrency(0)}</span>
                    </li>
                    <li>
                      {t("Tax")} <span>{data?.tax_total ? convertCurrency(data?.tax_total) : convertCurrency(0)}</span>
                    </li>
                    {/* {data?.points_amount != 0 ? (
                      <li className="txt-primary fw-bold">
                        {t("Points")} <span>{data?.points_amount}</span>
                      </li>
                    ) : null} */}
                    {/* {data?.wallet_balance != 0 ? (
                      <li className="txt-primary fw-bold">
                        {t("WalletBalance")}
                        <span>{convertCurrency(0)}</span>
                      </li>
                    ) : null} */}
                    <li>
                      {t("Total")} <span>{data?.items ? convertCurrency(calculatePrice(data?.items)) : convertCurrency(0)}</span>
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>
            <Row className="cart-buttons">
              <Col xs="6">
                <ul className="quantity-variant radio ">
                  <div key={1} className="d-flex digital-price">
                    <div className={`form-check`}>
                      <Input type="radio" className="form-check-input" id={"1"} value={"offline"} checked={paymentMode == "offline" ? true : false} onChange={(value) => { setPaymentMode(value.target.value) }} disabled={false} />
                      <Label htmlFor={"1"} className="form-check-label">
                        Offline
                      </Label>
                    </div>

                    <div className={`form-check`} style={{ marginLeft: 20 }}>
                      <Input type="radio" className="form-check-input" id={"2"} value={"online"} checked={paymentMode == "online" ? true : false} onChange={(value) => { setPaymentMode(value.target.value) }} disabled={false} />
                      <Label htmlFor={"2"} className="form-check-label">
                        Online
                      </Label>
                    </div>
                  </div>
                </ul>
              </Col>
              <Col xs="6">
                <Link href={""} onClick={() => { alert("Payment Done") }} className="btn">
                  {t("Payment")}
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ConsumerDetails;
