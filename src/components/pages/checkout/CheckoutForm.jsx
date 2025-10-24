import AccountContext from "@/context/accountContext";
import request from "@/utils/axiosUtils";
import { CountryAPI, GetUserAddress } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AccountSection from "./checkoutFormData/AccountSection";
import BillingAddressForm from "./checkoutFormData/BillingAddressForm";
import DeliverySection from "./checkoutFormData/DeliverySection";
import PaymentSection from "./checkoutFormData/PaymentSection";
import ShippingAddressForm from "./checkoutFormData/ShippingAddressForm";
import Link from "next/link";
import { Col, Row } from "reactstrap";
import Btn from "@/elements/buttons/Btn";
import AddressContext from "@/context/addressContext";

const CheckoutForm = ({ values, setFieldValue, errors }) => {
  const { accountData, refetch } = useContext(AccountContext);
  const { addressData } = useContext(AddressContext);
  const { t } = useTranslation("common");
  const [address, setAddress] = useState([]);
  const router = useRouter();
  useEffect(() => {
    addressData?.data?.length > 0 && setAddress((prev) => [...addressData?.data]);
  }, [addressData]);

  const { data } = useFetchQuery([GetUserAddress+accountData?.data?.id], () => request({ url: GetUserAddress+accountData?.data?.id }, router), {
    refetchOnWindowFocus: false,
    select: (res) => {
      // console.log(res?.data?.data, "Address")
      return res?.data?.data?.map((address) => ({ id: {country_code: "91",
                phone: accountData?.data?.phone ?? "", name: address?.name, city: address?.city, zipcode: address?.zipcode, address: address?.address }, name: address?.name, city: address?.city, zipcode: address?.zipcode, address: address?.address }))
    },
  });

  return (
    <>
      <AccountSection setFieldValue={setFieldValue} values={values} />
      <ShippingAddressForm setFieldValue={setFieldValue} errors={errors} data={data} values={values} />
      {/* <BillingAddressForm setFieldValue={setFieldValue} errors={errors} data={data} values={values} /> */}
      {/* <DeliverySection values={values} setFieldValue={setFieldValue} /> */}
      {/* <PaymentSection values={values} setFieldValue={setFieldValue} /> */}
    </>
  );
};

export default CheckoutForm;
