import SettingContext from "@/context/settingContext";
import request from "@/utils/axiosUtils";
import { CountryAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery"; import Link from "next/link";
import { PaymentMethod } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Input, Label, Row } from "reactstrap";
import axios  from "axios";

const ConsumerDetails = ({ data, taxData }) => {
  const { convertCurrency } = useContext(SettingContext);
  const { t } = useTranslation("common");
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState("offline");
  const [paymentMethod, setPaymentMethod] = useState("");
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

  function getItemsTotalPrice() {
    let totalTax = 0, total = 0;

    data.items.forEach(el => {
      let jsonData = el.product.jsonData;
      let _dd = [];
      if (!jsonData) {
        _dd = [{ discountPercentage: 0, discountAmount: 0, taxId: 0, taxAmount: 0, taxpercent: 0, totalPrice: 0 }];
        let _taxId = Number(el.product?.tax);
        let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
        _taxpercent = _taxpercent[0]?.value;
        let _taxAmt = Number(el.product?.price) * Number(_taxpercent) / 100;

        totalTax = Number(el.quantity) > 0 ? totalTax + _taxAmt * Number(el.quantity) : totalTax;
        total = Numbder(el.quantity) > 0 ? total + (Number(el.product?.price - _dd[0].discountAmount) + _taxAmt) * Number(el.quantity) : total;
      }
      else {
        _dd = jsonData.filter(el => el.orderId == data.id);
        if (_dd.length > 0) {
          let _taxId = Number(el.product?.tax);
          let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
          _taxpercent = _taxpercent[0]?.value;
          let _taxAmt = Number(_dd[0].sellingPrice) * Number(_taxpercent) / 100;

          totalTax = Number(el.quantity) > 0 ? totalTax + _taxAmt * Number(el.quantity) : totalTax;
          total = Number(el.quantity) > 0 ? total + (Number(el.product?.price - _dd[0].discountAmount) + _taxAmt) * Number(el.quantity) : total;
        }
      }
    });
    return { totalTax, total }
  }

  function getProductName() {
    let _prdName = "";
    data.items.forEach(el => {
      _prdName += el.product.name + ", "
    })
    return _prdName;
  }

  function proceedPayment() {
    const orderid = "";
    const amount = getItemsTotalPrice()?.total;
    const reasonForCollection = "Order Id #" + data.id + " ( " + getProductName() + " ) ";
    if (paymentMethod == "")
      alert("Please Select Payment Method");
    else {
      var data = JSON.stringify({
        "orderId": data.id,
        "amount": amount,
        "method": [
          paymentMethod
        ],
        "reasonForCollection": reasonForCollection
      });
      console.log("benepay", data);
      var config = {
        method: 'post',
        url: process.env.API_PRD_URL +'/payments/benePay/getUrl',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          const payurl = response.data?.realTimePaymentData?.message;
          if(payurl !== "" && payurl.startsWith("https")) 
            router.push(payurl);
          else
            alert("There is some Imtermittent payment issue , please contact Support");
        })
        .catch(function (error) {
          console.log(error);
        });

    }
  }

  return (
    <>
      <div className="summary-details my-3">
        <Row>
          <Col xxl={6} lg={12} md={6}>
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
          <Col xxl={6} lg={12} md={6} className="cart-section">
            <Card className="h-m30">
              <CardBody>
                <h3 className="order-title">{"summary"}</h3>
                <div className="tracking-total tracking-wrapper">
                  <ul>
                    {/* <li>
                      {t("GST")} <span>{"27ABCDE1234F2Z5"}</span>
                    </li>
                    <li>
                      {t("Subtotal")} <span>{data?.items ? convertCurrency(calculatePrice(data?.items)) : convertCurrency(0)}</span>
                    </li>
                    <li>
                      {t("Shipping")} <span>{data?.shipping_total ? convertCurrency(data?.shipping_total) : convertCurrency(0)}</span>
                    </li> */}
                    <li>
                      {t("Tax")} <span>{getItemsTotalPrice()?.totalTax?.toFixed(2)}</span>
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
                      {t("Total")} <span>{getItemsTotalPrice()?.total?.toFixed(2)}</span>
                    </li>
                    {data.status === "APPROVED" &&
                      <li>
                        <span className="me-2">Pay :</span>
                        <select
                          value={paymentMethod}
                          label="pay method"
                          onChange={(value) => { setPaymentMethod(value.target.value) }}
                          className="form-select form-select-sm w-auto"
                        >
                          {PaymentMethod.map((method, index) => (
                            <option value={method.id}>{method.name}</option>
                          ))}
                        </select> </li>}
                    {data.status === "APPROVED" &&
                      <li>
                        <button
                          className="btn-solid btn btn-transparent"
                          onClick={proceedPayment}
                        >Payment</button>
                      </li>}
                  </ul>
                </div>
              </CardBody>
            </Card>
            {data?.status?.toLowerCase() == "accepted" &&
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
            }
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ConsumerDetails;
