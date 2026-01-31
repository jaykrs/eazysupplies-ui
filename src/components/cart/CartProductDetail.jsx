import SettingContext from "@/context/settingContext";
import Link from "next/link";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../widgets/Avatar";
import { placeHolderImage } from "../widgets/Placeholder";

const CartProductDetail = ({ elem }) => {
  const { t } = useTranslation("common");
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
const originalUrl = getFirstOriginalUrl(elem?.product?.productIcon);
  return (
    <td>
      <Link href={`/product/${elem?.product?.id}`} className="product-image">
        <Avatar customClass="product-image" customImageClass={"img-fluid"} data={originalUrl} placeHolder={originalUrl} name={elem?.product?.name} />
      </Link>
    </td>
  );
};

export default CartProductDetail;
