import { placeHolderImage } from "@/components/widgets/Placeholder";
import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import Image from "next/image";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

const SidebarProduct = ({ values }) => {
  const { t } = useTranslation("common");
  const { cartProducts } = useContext(CartContext);
  const { convertCurrency } = useContext(SettingContext);
  return (
    <div className="checkout-details">
      <div className="order-box">
        <div className="title-box">
          <h4>{t("SummaryOrder")}</h4>
          <p>{t("SummaryOrderDescription")}</p>
        </div>
        <ul className="qty">
          {cartProducts?.map((item, i) => (
            <li key={i}>
              {item && (
                <div className="cart-image">
                  <Image src={ placeHolderImage} className="img-fluid" alt={item?.product?.name || "product"} width={70} height={70} />
                </div>
              )}
              <div className="cart-content">
                <div>
                  <h4>{ item?.product?.name}</h4>
                  <h5 className="text-theme">
                    {convertCurrency(item?.product?.price)} x {item.quantity}
                  </h5>
                </div>
                <span className="text-theme">{convertCurrency(( item?.product?.price) * item.quantity)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarProduct;
