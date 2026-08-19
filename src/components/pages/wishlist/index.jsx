"use client";
import OptimizedImage from "@/components/widgets/OptimizedImage";
import NoDataFound from "@/components/widgets/NoDataFound";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import WishlistContext from "@/context/wishlistContext";
import Loader from "@/layout/loader";
import Breadcrumbs from "@/utils/commonComponents/breadcrumb";
import { Href } from "@/utils/constants";
import Link from "next/link";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine, RiShoppingCartLine } from "react-icons/ri";
import { Table } from "reactstrap";
import emptyImage from "/public/assets/svg/empty-items.svg";

const WishlistContent = () => {
  const { wishlistProducts, WishlistAPILoading, removeWishlist } = useContext(WishlistContext);
  const { t } = useTranslation("common");
  const { setCartCanvas } = useContext(ThemeOptionContext);
  const { handleIncDec, openCartSidebar } = useContext(CartContext);
  const removeFromWishlist = (product) => {
    removeWishlist(product?.id, product?.id);
  };
  const { convertCurrency } = useContext(SettingContext);
  const getProductImage = (product) => {
    const [firstImage] = product?.productImage?.split(",") || [];
    if (!firstImage?.trim()) return "/assets/images/placeholder/product.png";
    const fileUrl = new URL(process.env.NEXT_PUBLIC_FILE_API_URL || "https://api.eazysupplies.com/api/file");
    fileUrl.searchParams.set("file", firstImage.trim());
    return fileUrl.toString();
  };

  const addToCart = (product) => {
    setCartCanvas(true);
    handleIncDec(1, product);
  };

  if (WishlistAPILoading) return <Loader />;

  return (
    <>
      <Breadcrumbs title={"Wishlist"} subNavigation={[{ name: "Wishlist" }]} />
      <WrapperComponent classes={{ sectionClass: "wishlist-section section-b-space", row: "g-sm-3 g-2", col: "table-responsive-xs", fluidClass: "container" }} colProps={{ sm: "12" }}>
        {wishlistProducts?.length > 0 ? (
          <div className="table-responsive">
            <Table className="cart-table">
              <thead>
                <tr className="table-head">
                  <th scope="col">{t("Image")}</th>
                  <th scope="col">{t("ProductName")}</th>
                  <th scope="col">{t("Price")}</th>
                  <th scope="col">{t("Availability")}</th>
                  <th scope="col">{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {wishlistProducts?.map((product, i) => (
                  <tr key={i}>
                    <td>
                      <Link href={`/product/${product?.id}`}>
                        <OptimizedImage height={90} width={90} src={getProductImage(product)} alt={product?.name} />
                      </Link>
                    </td>
                    <td>
                      <Link href={`/product/${product?.id}`}>{product?.name}</Link>
                      <div className="mobile-cart-content row">
                        <div className="col">
                          <p>{product?.stock > 0 ? t("InStock") : t("OutOfStock")}</p>
                        </div>
                        <div className="col">
                          <h2>
                            {convertCurrency(product?.price)}
                          </h2>
                        </div>
                        <div className="col">
                          <div className="icon-box d-flex gap-2 justify-content-center">
                            <a href={Href} className="icon " onClick={() => removeFromWishlist(product)}>
                              <RiCloseLine />
                            </a>
                            <a href={Href} className="cart" onClick={() => addToCart(product)}>
                              <RiShoppingCartLine />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <h2>
                        {convertCurrency(product?.price)}
                      </h2>
                    </td>
                    <td>
                      <p>{product?.stock > 0 ? t("InStock") : t("OutOfStock")}</p>
                    </td>

                    <td>
                      <div className="icon-box d-flex gap-2 justify-content-center">
                        <a href={Href} className="icon " onClick={() => removeFromWishlist(product)}>
                          <RiCloseLine />
                        </a>
                        <a href={Href} className="cart" onClick={() => addToCart(product)}>
                          <RiShoppingCartLine />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <NoDataFound customClass="no-data-added" imageUrl={emptyImage} title="NoItemsAdded" description="NoWishListDescription" height="300" width="300" />
        )}
      </WrapperComponent>
    </>
  );
};

export default WishlistContent;
