import CartContext from "@/context/cartContext";
import Btn from "@/elements/buttons/Btn";
import { CreateOrderAPI } from "@/utils/axiosUtils/API";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PlaceOrder = ({ values, addToCartData, errors }) => {
  const { t } = useTranslation("common");
  const access_token = Cookies.get("uat");
  const [disable, setDisable] = useState(true);
  const { cartProducts } = useContext(CartContext);

  useEffect(() => {
    if (!access_token) {
      setDisable(Object.keys(errors).length > 0);
    } else {
      setDisable(!(values["billing_address_id"] && values["payment_method"]));
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
        userId: 1,
        status: "PENDING",
        "items": tempProduct,
        "shipping": {
          "address": "123 Main St",
          "city": "New York",
          "state": "CA",
          "postalCode": "10001",
          "country": "USA"
        },
        "payment": {
          "method": "CREDIT_CARD",
          "status": "PENDING",
          "userId": 1,
          "amount": 249.98
        },
        "jsonData": {
          "note": "First test order"
        }
      }
    }).then((res) => {
      console.log(res.data)
    }, (err) => {
      console.log(err)
    })
  };
  return (
    <div className="text-end">
      <Btn className="order-btn" onClick={handleClick} disabled={disable}>
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
