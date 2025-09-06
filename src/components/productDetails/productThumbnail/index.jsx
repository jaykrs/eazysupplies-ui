import WrapperComponent from "@/components/widgets/WrapperComponent";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import CustomerOrderCount from "../common/CustomerOrderCount";
import OfferTimer from "../common/OfferTimer";
import PaymentOptions from "../common/PaymentOptions";
import ProductBundle from "../common/ProductBundle";
import ProductContent from "../common/ProductContent";
import ProductDeliveryInformation from "../common/ProductDeliveryInformation";
import ProductDetailsTab from "../common/ProductDetailsTab";
import ProductInformation from "../common/ProductInformation";
import ProductStatus from "../common/ProductStatus";
import RelatedProduct from "../common/RelatedProduct";
import WishlistCompareShare from "../common/WishlistCompareShare";
import ThumbnailImage from "./ThumbnailImage";

const ProductThumbnail = ({ productState, setProductState, customTab }) => {
  return (
    <WrapperComponent classes={{ sectionClass: "collection-wrapper", fluidClass: "container" }} customCol={true}>
      <Col sm={12}>
        <Container fluid className="p-0">
          <Row className="g-sm-4 g-3">
            <Col lg={6}>
              <ThumbnailImage productState={productState} setProductState={setProductState} slideToShow={4} />
            </Col>
            <Col lg={6} className="rtl-text">
              <div className="product-page-details">
                <CustomerOrderCount productState={productState} />
                <ProductContent productState={productState} setProductState={setProductState} />
                <WishlistCompareShare productState={productState} />
                <ProductStatus productState={productState} />
                {productState?.product.status && productState?.product?.sale_starts_at && productState?.product?.sale_expired_at && <OfferTimer productState={productState} />}
                <ProductInformation productState={productState} />
                <ProductDeliveryInformation productState={productState} />
                <PaymentOptions productState={productState} />
                {productState?.product?.cross_sell_products?.length > 0 && <ProductBundle productState={productState} setProductState={setProductState} />}
              </div>
            </Col>
          </Row>
        </Container>
        <WrapperComponent classes={{ sectionClass: "tab-product product-details-contain section-b-space", fluidClass: "container" }} customCol={true}>
          <ProductDetailsTab productState={productState} setProductState={setProductState} />
        </WrapperComponent>
      </Col>
      {productState?.product?.related_products?.length > 0 && <RelatedProduct productState={productState} setProductState={setProductState} />}
    </WrapperComponent>
  );
};

export default ProductThumbnail;
