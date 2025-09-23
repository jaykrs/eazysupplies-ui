import { ModifyString } from "@/utils/customFunctions/ModifyString";
import { useTranslation } from "react-i18next";

const ProductInformation = ({ productState }) => {
  const { t } = useTranslation("common");
  return (
    <div className="bordered-box">
      <h4 className="sub-title">{t("ProductInformation")}</h4>

      <ul className="shipping-info">
        <li>
          {t("SKU")} : {productState?.product?.sku}
        </li>

        {productState?.product?.unit ? (
          <li>
            {t("Unit")} : {productState?.product?.unit}
          </li>
        ) : null}
        {productState?.product?.weight ? (
          <li>
            {t("Weight")} : {productState?.product?.weight} {ModifyString("gms")}
          </li>
        ) : null}
        <li>
          {t("StockStatus")} :{productState?.product?.stock > 0 ? "In stock" : "Out of stock"}
        </li>
        <li>
          {t("Quantity")} : {productState?.product?.stock ?? productState?.product?.stock} Items Left
        </li>
      </ul>
    </div>
  );
};

export default ProductInformation;
