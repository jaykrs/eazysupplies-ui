import SettingContext from "@/context/settingContext";
import Link from "next/link";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../widgets/Avatar";
import { placeHolderImage } from "../widgets/Placeholder";

const CartProductDetail = ({ elem }) => {
  const { t } = useTranslation("common");
  const { convertCurrency } = useContext(SettingContext);
  return (
    <td>
      <Link href={`/product/${elem?.product?.id}`} className="product-image">
        <Avatar customClass="product-image" customImageClass={"img-fluid"} data={elem?.product?.productIcon ?? elem?.product?.productIcon} placeHolder={elem?.product?.productIcon ?? elem?.product?.productIcon} name={elem?.product?.name} />
      </Link>
    </td>
  );
};

export default CartProductDetail;
