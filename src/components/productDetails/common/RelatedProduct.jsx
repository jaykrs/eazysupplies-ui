import OptimizedImage from "@/components/widgets/OptimizedImage";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import ProductIdsContext from "@/context/productIdsContext";
import request from "@/utils/axiosUtils";
import { ProductAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";

const getProductImage = (product) => {
  if (product?.product_thumbnail?.original_url) return product.product_thumbnail.original_url;

  const [firstImage] = product?.productImage?.split(",") || [];
  if (!firstImage?.trim()) return "/assets/images/placeholder/product.png";

  const fileUrl = new URL(process.env.NEXT_PUBLIC_FILE_API_URL || "https://api.eazysupplies.com/api/file");
  fileUrl.searchParams.set("file", firstImage.trim());
  return fileUrl.toString();
};

const RelatedProduct = ({ productState, customContainerClass }) => {
  const { t } = useTranslation("common");
  const { filteredProduct } = useContext(ProductIdsContext);
  const product = productState?.product;
  const relatedIds = useMemo(() => product?.related_products || [], [product?.related_products]);

  const { data: categoryProducts } = useFetchQuery(
    ["pdp-related-products", product?.id, product?.categoryId],
    () => request({
      url: ProductAPI,
      params: { status: 1, category_ids: product?.categoryId, paginate: 8 },
    }),
    {
      enabled: Boolean(product?.id && product?.categoryId && relatedIds.length === 0),
      refetchOnWindowFocus: false,
      select: (response) => response?.data?.data || [],
    },
  );

  const { data: brandProducts } = useFetchQuery(
    ["pdp-related-brand-products", product?.id, product?.brandId],
    () => request({
      url: ProductAPI,
      params: { status: 1, brand_ids: product?.brandId, paginate: 8 },
    }),
    {
      enabled: Boolean(product?.id && product?.brandId && relatedIds.length === 0),
      refetchOnWindowFocus: false,
      select: (response) => response?.data?.data || [],
    },
  );

  const { data: generalProducts } = useFetchQuery(
    ["pdp-related-general-products", product?.id],
    () => request({ url: ProductAPI, params: { status: 1, paginate: 8 } }),
    {
      enabled: Boolean(product?.id && relatedIds.length === 0),
      refetchOnWindowFocus: false,
      select: (response) => response?.data?.data || [],
    },
  );

  const relatedProducts = useMemo(() => {
    const products = relatedIds.length
      ? filteredProduct?.filter((item) => relatedIds.includes(item?.id)) || []
      : [...(categoryProducts || []), ...(brandProducts || []), ...(generalProducts || [])];

    const seen = new Set();
    return products
      .filter((item) => item?.id !== product?.id && !seen.has(item?.id) && seen.add(item?.id))
      .slice(0, 4);
  }, [brandProducts, categoryProducts, filteredProduct, generalProducts, product?.id, relatedIds]);

  if (!relatedProducts.length) return null;

  return (
    <WrapperComponent
      classes={{
        sectionClass: "related-products-section pt-0 section-b-space m-0",
        fluidClass: customContainerClass ? customContainerClass : "",
      }}
      noRowCol={true}
    >
      <style>{`
        .related-products-section {
          padding-top: 2.5rem !important;
        }
        .related-products-section .product-related h2 {
          margin: 0 0 2rem;
          text-align: center;
          font-family: inherit;
          font-size: clamp(1.75rem, 2.5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          text-transform: none;
        }
        .related-product-card {
          height: 100%;
        }
        .related-product-card__image {
          display: flex;
          aspect-ratio: 1 / 1;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #e7e7e7;
          border-radius: 1rem;
          background: #fff;
        }
        .related-product-card__image img {
          width: 100%;
          height: 100%;
          padding: 1.25rem;
          object-fit: contain;
        }
        .related-product-card__title {
          display: block;
          margin-top: 1rem;
          color: inherit;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.45;
          text-align: center;
        }
        @media (max-width: 767.98px) {
          .related-products-section .product-related h2 {
            margin-bottom: 1.25rem;
          }
          .related-product-card__image img {
            padding: 0.75rem;
          }
        }
      `}</style>
      <div className="product-related">
        <h2>{t("RelatedProducts")}</h2>
      </div>
      <Row className="row-cols-lg-4 row-cols-sm-2 row-cols-1 g-4">
        {relatedProducts.map((relatedProduct) => {
          const productPath = relatedProduct?.slug || relatedProduct?.id;
          return (
            <Col key={relatedProduct.id}>
              <article className="related-product-card">
                <Link className="related-product-card__image" href={`/product/${productPath}`}>
                  <OptimizedImage
                    src={getProductImage(relatedProduct)}
                    alt={relatedProduct?.name || "Related product"}
                    width={640}
                    height={640}
                    sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
                  />
                </Link>
                <Link className="related-product-card__title" href={`/product/${productPath}`}>
                  {relatedProduct?.name}
                </Link>
              </article>
            </Col>
          );
        })}
      </Row>
    </WrapperComponent>
  );
};

export default RelatedProduct;
