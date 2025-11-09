import AccountContext from "@/context/accountContext";
import CartContext from "@/context/cartContext";
import Btn from "@/elements/buttons/Btn";
import { CreateOrderAPI } from "@/utils/axiosUtils/API";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PlaceOrder = ({ values, addToCartData, errors }) => {
  const { t } = useTranslation("common");
  const access_token = Cookies.get("uat");
  const [disable, setDisable] = useState(true);
  const { cartProducts, clearCart } = useContext(CartContext);
  const { accountData } = useContext(AccountContext);
  const router = useRouter();

  useEffect(() => {
    if (!accountData?.data?.id) {
      setDisable(Object.keys(errors).length > 0);
    } else {
      // console.log(values, "addresssssss")
      setDisable(!(values["shipping_address"]));
    }
  }, [access_token, values, errors]);

  const handleClick = () => {
    // alert("llll")
    const tempProduct = []
    cartProducts?.map((data, index) => {
      tempProduct?.push({
        "productId": data?.product_id,
        "quantity": data?.quantity,
        "price": data?.sub_total
      })
    })
    // console.log(cartProducts,tempProduct, "uuuuu")

    axios({
      method: "POST",
      url: CreateOrderAPI,
      data: {
        userId: accountData?.data?.id,
        status: "PENDING",
        "items": tempProduct,
        "shipping": {
          "address": values?.shipping_address?.address,
          "city": values?.shipping_address?.city,
          "state": values?.shipping_address?.city,
          "postalCode": values?.shipping_address?.zipcode,
          "country": "India"
        },
        "payment": {
          "method": "CREDIT_CARD",
          "status": "PENDING",
          "userId": accountData?.data?.id,
          "amount": tempProduct?.reduce((sum, item) => sum + item?.price, 0)
        },
        "jsonData": {
          "note": "First test order"
        }
      }
    }).then((res) => {
      // console.log(res.data)
      clearCart()
      router.push('/account/order');
    }, (err) => {
      console.log(err)
    })
  };
  return (
    <div className="text-end">
      <Btn className="order-btn" onClick={handleClick} disable={false}>
        {t("PlaceRequest")}
      </Btn>
      {/* {addToCartData?.is_digital_only ? (
        <Btn className="order-btn" onClick={handleClick} disabled={values["billing_address_id"] && values["payment_method"] ? false : true}>
          {t("PlaceRequest")}
        </Btn>
      ) : (
        <Btn className="order-btn" onClick={handleClick} disabled={disable}>
          {t("PlaceOrder")}
        </Btn>
      )} */}
    </div>
  );
};

export default PlaceOrder;
