import SettingContext from "@/context/settingContext";
import Link from "next/link";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import CartButton from "./widgets/CartButton";
import ImageVariant from "./widgets/ImageVariant";
import ProductBoxVariantAttribute from "./widgets/ProductBoxVariantAttributes";
import ProductHoverButton from "./widgets/ProductHoverButton";

const getProductThumbnail = (product) => {
  if (product?.product_thumbnail?.original_url) return product.product_thumbnail;

  const [firstImage] = product?.productImage?.split(",") || [];
  if (!firstImage?.trim()) return { original_url: "/assets/images/placeholder/product.png" };

  const fileUrl = new URL(process.env.NEXT_PUBLIC_FILE_API_URL || "https://api.eazysupplies.com/api/file");
  fileUrl.searchParams.set("file", firstImage.trim());
  return { original_url: fileUrl.toString() };
};

const ProductBox11 = ({ productState, setProductState }) => {
  const { convertCurrency } = useContext(SettingContext);
  const { t } = useTranslation("common");
  const product = productState?.product;
  const selectedVariation = productState?.selectedVariation;
  const productPath = product?.slug || product?.id;
  const normalizedProduct = product ? { ...product, slug: productPath } : product;
  const thumbnail = selectedVariation?.variation_image || getProductThumbnail(product);
  const displayPrice = selectedVariation?.sale_price ?? selectedVariation?.price ?? product?.sale_price ?? product?.price;

  return (
    <>
      <div className={`basic-product theme-product-10 ${productState?.selectedVariation ? (productState?.selectedVariation.stock_status === "out_of_stock" || !productState?.selectedVariation.status ? "sold-out" : "") : productState?.product?.stock_status === "out_of_stock" ? "sold-out" : ""}`}>
        <div className="img-wrapper">
          <ImageVariant thumbnail={thumbnail} gallery_images={product?.product_galleries} product={normalizedProduct} width={750} height={750} />
          <CartButton productState={productState} selectedVariation={productState.selectedVariation} text="Add to cart" classes="addto-cart-bottom" />
          <div className="cart-info">
            <ProductHoverButton productstate={productState?.product} />
          </div>
        </div>
        <div className="product-detail">
          {productState?.product?.brand && (
            <Link href={`/brand/${productState.product.brand.slug || productState.product.brand.name}`} className="product-title">{productState.product.brand.name}</Link>
          )}

          <Link href={`/product/${productPath}`} className="product-title">
            <h6>{productState?.selectedVariation ? productState?.selectedVariation.name : productState?.product?.name}</h6>
          </Link>

          <h4 className="price">
            {displayPrice != null ? convertCurrency(displayPrice) : null}
            {productState?.selectedVariation ? (
              productState?.selectedVariation.discount ? (
                <>
                  {productState?.selectedVariation?.price != productState?.selectedVariation?.sale_price || (productState?.product?.price != productState?.product?.sale_price && <del>{convertCurrency(productState?.product?.price)}</del>)}
                  <span className="discounted-price">
                    {productState?.selectedVariation.discount}% {t("Off")}
                  </span>
                </> 
              ) : null
            ) : productState?.product?.discount ? (
              <>
                {productState?.selectedVariation?.price != productState?.selectedVariation?.sale_price || (productState?.product?.price != productState?.product?.sale_price && <del>{convertCurrency(productState?.product?.price)}</del>)}
                <span className="discounted-price">
                  {productState?.product?.discount}% {t("Off")}
                </span>
              </>
            ) : null}
          </h4>

          <ProductBoxVariantAttribute productBox11={true} productState={productState} setProductState={setProductState} showVariableType={["dropdown"]} />
        </div>
      </div>
    </>
  );
};

export default ProductBox11;
