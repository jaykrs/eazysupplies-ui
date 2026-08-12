import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row, Table } from "reactstrap";
import NoDataFound from "../widgets/NoDataFound";
import CartData from "./CartData";
import Link from 'next/link';

const ShowCartData = () => {
  const { getTotal, cartProducts } = useContext(CartContext);
  const { convertCurrency } = useContext(SettingContext);
  // const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem("cartData")))
  const { t } = useTranslation("common");

  const calculateTotal = (data) => {
    var temp = 0
    data?.map((data, index) => {
      temp = temp + data?.productQty * data?.product?.price
    })

    return temp;
  }

  // useEffect(() => {
  //   const cartData = JSON.parse(localStorage.getItem("cartData"))
  //   console.log(cartData, "ppppp")
  // }, [])
  return (
    <Row>
      {!!cartProducts && cartProducts?.length > 0 ? (
        <>
          <Col xs={12}>
            <div className="table-responsive">
              <Table className="cart-table">
                <thead>
                  <tr className="table-head">
                    <th scope="col">{t("Image")}</th>
                    <th scope="col">{t("ProductName")}</th>
                    <th scope="col">{t("Price")}</th>
                    <th scope="col">{t("Quantity")}</th>
                    <th scope="col">{t("Total")}</th>
                    <th scope="col">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((elem, i) => (
                    <CartData elem={elem} key={i} />
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="d-md-table-cell d-none">
                      {t("TotalPrice")} :
                    </td>
                    <td className="d-md-none">{t("TotalPrice")} :</td>
                    <td>
                      <h2>{convertCurrency(getTotal(cartProducts)?.toFixed(2))}</h2>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Col>
        </>
      ) : (
       <div className="empty-cart-message text-center">
  <h4>Your cart is empty.</h4>
  <Link href="/" className="btn btn-solid mt-3">
    Return to Shop
  </Link>
</div>
      )}
    </Row>
  );
};

export default ShowCartData;
