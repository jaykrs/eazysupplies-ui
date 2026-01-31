import { placeHolderImage } from "@/components/widgets/Placeholder";
import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import Image from "next/image";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../../../widgets/Avatar";

const SidebarProduct = ({ values }) => {
  const { t } = useTranslation("common");
  const { cartProducts } = useContext(CartContext);
  const { convertCurrency } = useContext(SettingContext);
  const getFirstOriginalUrl = (filesString) => {
  if (!filesString) return null;
  const [firstFile] = filesString.split(",");
  if (!firstFile) return null;
  const trimmedFile = firstFile.trim();
  const url = new URL(process.env.NEXT_PUBLIC_FILE_API_URL);
  url.searchParams.set("file", trimmedFile);
  return url.toString();
};
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
                  <Avatar customClass="product-image" customImageClass={"img-fluid"} data={getFirstOriginalUrl(item?.product?.productIcon)} placeHolder={getFirstOriginalUrl(item?.product?.productIcon)} name={item?.product?.name} />
                  {/* <Image src={item?.product?.productIcon} className="img-fluid" alt={item?.product?.name || "product"} width={70} height={70} /> */}
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
