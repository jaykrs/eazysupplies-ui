"use client";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import AccountContext from "@/context/accountContext";
import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Loader from "@/layout/loader";
import request from "@/utils/axiosUtils";
import { AddToCartAPI, AddressAPI } from "@/utils/axiosUtils/API";
import Breadcrumbs from "@/utils/commonComponents/breadcrumb";
import useCreate from "@/utils/hooks/useCreate";
import { emailSchema, idCreateAccount, nameSchema, phoneSchema } from "@/utils/validation/ValidationSchema";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Fragment, useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import CheckoutForm from "./CheckoutForm";
import CheckoutSidebar from "./checkoutSidebar";
import DeliveryAddress from "./DeliveryAddress";
import DeliveryOptions from "./DeliveryOptions";
import PaymentOptions from "./PaymentOptions";
import Btn from "@/elements/buttons/Btn";
import { useTranslation } from "react-i18next";
import AddressContext from "@/context/addressContext";
import CartContext from "@/context/cartContext";

const CheckoutContent = () => {
  const { accountData, refetch } = useContext(AccountContext);
  const { addressData } = useContext(AddressContext);
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { settingData } = useContext(SettingContext);
  const [address, setAddress] = useState([]);
  const [modal, setModal] = useState("");
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const token = Cookies.get("uat");
    setAccessToken(token);
  }, []);

  useEffect(() => {
    addressData?.data?.length > 0 && setAddress((prev) => [...addressData?.data]);
  }, [accountData]);

  const { mutate, isLoading } = useCreate(AddressAPI, false, false, "Address Added successfully", (resDta) => {
    setAddress((prev) => [...prev, resDta?.data]);
    refetch();
    setModal("");
  });

  // Calling Add to Cart API
  const { cartProducts } = useContext(CartContext)

  // useEffect(() => {
  //   if (accessToken && !addToCartLoader) {
  //     // addToCartRefetch();
  //   }
  // }, [addToCartLoader, accessToken]);
  const { isLoading: themeLoad } = useContext(ThemeOptionContext);

  const addressSchema = Yup.object().shape({
    name: nameSchema,
    address: nameSchema,
    city: nameSchema,
    zipcode: nameSchema,
    country_code: nameSchema,
    phone: nameSchema
  });

  if (themeLoad) return <Loader />;
  return (
    <Fragment>
      <Breadcrumbs title={"Checkout"} subNavigation={[{ name: "Checkout" }]} />
      <WrapperComponent classes={{ sectionClass: "section-b-space checkout-section-2", fluidClass: "container" }} noRowCol={true}>
        <div className="checkout-page checkout-form">
          <Formik
            initialValues={{
              products: [],
              shipping_address_id: 0,
              billing_address_id: "",
              points_amount: "",
              wallet_balance: "",
              coupon: "",
              delivery_description: "",
              delivery_interval: "",
              payment_method: "",
              create_account: false,
              name: accountData?.data?.name ?? "",
              email: accountData?.data?.email ?? "",
              country_code: "91",
              phone: accountData?.data?.phone ?? "",
              password: "",
              shipping_address: {
                name: addressData?.data[0]?.name ?? "",
                address: addressData?.data[0]?.address ?? "",
                city: addressData?.data[0]?.city ?? "",
                country_code: "91",
                phone: accountData?.data?.phone ?? "",
                zipcode: addressData?.data[0]?.zipcode ?? "",
              },
              billing_address: {
                name: addressData?.data[0]?.name ?? "",
                address: addressData?.data[0]?.address ?? "",
                city: addressData?.data[0]?.city ?? "",
                country_code: "91",
                phone: accountData?.data?.phone ?? "",
                zipcode: addressData?.data[0]?.zipcode ?? "",
              },
            }}
            validationSchema={Yup.object().shape({
              name: nameSchema,
              email: emailSchema,
              phone: phoneSchema,
              password: idCreateAccount,
              shipping_address: addressSchema,
              billing_address: addressSchema,
            })}
            onSubmit={(value) => {
              if (!accountData?.userId) {
                setOpenAuthModal(true)
              }
              mutate(value)
            }}
          >
            {({ values, setFieldValue, errors }) => (
              <Form className="checkout-form">
                <Row className="g-sm-4 g-3">
                  <Col lg="7">
                    <div className="left-sidebar-checkout">
                      <div className="checkout-detail-box">
                        {settingData?.activation?.guest_checkout && !accessToken && (
                          <div className="checkout-form-section">
                            <CheckoutForm values={values} setFieldValue={setFieldValue} errors={errors} />
                          </div>
                        )}
                        {accessToken && (
                          <div className="checkout-detail-box">
                            <ul>
                              {!cartProducts?.is_digital_only && <DeliveryAddress key="shipping" type="shipping" title={"Shipping"} values={values} updateId={values["consumer_id"]} setFieldValue={setFieldValue} address={address} modal={modal} mutate={mutate} isLoading={isLoading} setModal={setModal} />}
                              <DeliveryAddress key="billing" type="billing" title={"Billing"} values={values} updateId={values["consumer_id"]} setFieldValue={setFieldValue} address={address} modal={modal} mutate={mutate} isLoading={isLoading} setModal={setModal} />
                              {/* {!cartProducts?.is_digital_only && <DeliveryOptions values={values} setFieldValue={setFieldValue} />} */}
                              {/* <PaymentOptions values={values} setFieldValue={setFieldValue} /> */}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                  <CheckoutSidebar addToCartData={cartProducts} values={values} setFieldValue={setFieldValue} errors={errors} />
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </WrapperComponent>
    </Fragment >
  );
};

export default CheckoutContent;
