"use client";
import ImageLink from "@/components/widgets/imageLink";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { brandSlider3, horizontalProductSlider } from "@/data/sliderSetting/SliderSetting";
import Btn from "@/elements/buttons/Btn";
import Loader from "@/layout/loader";
import { Href, ImagePath, storageURL } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Modal, ModalBody, Row } from "reactstrap";
import HomeBrand from "../widgets/HomeBrand";
import HomeProduct from "../widgets/HomeProduct";
import HomeSocialMedia from "../widgets/HomeSocialMedia";
import TitleBox from "../widgets/HomeTitle";

const SingleProduct = ({ slug }) => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "single_product" });
  const [prodId, setProdId] = useState([]);
  const [banners, setBanners] = useState([]);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);
  const [openModal, setOpenModal] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);

  const getText = (value) => {
    const text = value.split(" ");
    const firstWord = text.slice(0, 3).join(" ");
    const remainingWord = text.slice(3).join(" ");
    return { __html: `<h1>${firstWord} <span class="gradient-text">${remainingWord}</span></h1>` };
  };
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
    if (data?.testimonial?.banners.length) {
      let banners = data?.testimonial?.banners?.filter((item) => item?.status);
      setBanners(banners);
    }
    if (data?.testimonial?.banners.length) {
      let services = data?.services?.right_panel?.banners?.filter((item) => item?.status);
      setFilteredServices(services);
    }

    if (data?.single_product?.product_ids) {
      const productId = data?.single_product?.product_ids;
      const singleProductIds = Array.isArray(productId) ? productId : productId !== undefined ? [productId] : [];
      setProdId(singleProductIds);
    }
  }, [data]);

  useEffect(() => {
    document.body.classList.add("home", "single-product");
    return () => {
      document.body.classList.remove("home", "single-product");
    };
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <div style={{ backgroundImage: `url(${ImagePath}/single-product/bg.jpg)` }}>
      {/* Home Banner  */}
      {data?.home_banner?.status && (
        <section className="p-0 height-85 single-home bg-size section-t-space">
          <Container>
            <div className="home-content">
              <div dangerouslySetInnerHTML={getText(data?.home_banner?.title || "")}></div>
              <p>{data?.home_banner?.description}</p>

              {data?.home_banner?.show_button && <Btn className="gradient-btn">{data?.home_banner?.button_text}</Btn>}
            </div>
            <div className="home-img d-md-flex d-none">
              <img src={storageURL + data?.home_banner?.banner_image} className="img-fluid" alt="" />
            </div>
          </Container>
        </section>
      )}

      {/* About Us  */}
      {data?.services?.status && (
        <WrapperComponent classes={{ sectionClass: "single-about-us", fluidClass: "container", row: "g-3" }} customCol={true}>
          {data?.services?.left_panel?.status && (
            <Col lg="6">
              <div className="about-left-box">
                <h2>{data?.services?.left_panel?.title}</h2>
                <h4>{data?.services?.left_panel?.description}</h4>
              </div>
            </Col>
          )}

          {filteredServices && filteredServices.length && (
            <Col lg="6">
              <ul className="about-right-box">
                {filteredServices?.map((service, i) => (
                  <li className="right-box" key={i}>
                    <div className="about-img">
                      <img src={storageURL + service.image_url} className="img-fluid" alt="" />
                    </div>
                    <div className="about-content">
                      <h4>{service.title}</h4>
                      <p>{service.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          )}
        </WrapperComponent>
      )}

      {/* Banners */}
      <WrapperComponent classes={{ sectionClass: "single-banner-section", fluidClass: "container", row: "row g-sm-4 g-3" }} customCol={true}>
        <Col md="6">
          <ImageLink imgUrl={data?.grid_banner?.banner_1} classes="custom-border-radius" height={640} width={676} />
        </Col>
        <Col md="6">
          <Row className=" g-sm-4 g-3">
            <Col xs="12">
              <ImageLink imgUrl={data?.grid_banner?.banner_2} classes="custom-border-radius" height={366} width={676} />
            </Col>
            <Col xs="12">
              <ImageLink imgUrl={data?.grid_banner?.banner_3} classes="custom-border-radius mt-xl-2" height={366} width={676} />
            </Col>
          </Row>
        </Col>
      </WrapperComponent>

      {/* Video Section */}
      {data?.product_video?.status && (
        <>
          <WrapperComponent classes={{ sectionClass: "video-section", fluidClass: "container" }} colProps={{ md: "12" }}>
            <a href={Href}>
              <div className="video-img custom-border-radius overflow-hidden">
                <img src={storageURL + data?.product_video?.image} alt="" className="img-fluid" />
                {data?.product_video?.video && (
                  <div className="play-btn" onClick={() => setOpenModal(true)}>
                    <span>
                      <i className="ri-play-fill"></i>
                    </span>
                  </div>
                )}
              </div>
            </a>
          </WrapperComponent>
          <Modal centered size="lg" isOpen={openModal} fade toggle={() => setOpenModal(false)}>
            <div className="modal-content">
              <ModalBody>
                <video autoplay="true" loop="true" className="w-100 h-100">
                  <source type="video/mp4" src={storageURL + data?.product_video?.video} />
                </video>
              </ModalBody>
            </div>
          </Modal>
        </>
      )}

      {/* Deal Product Tab */}
      <WrapperComponent classes={{ sectionClass: "deal-section", fluidClass: "container" }}>
        <HomeProduct productIds={prodId} style="horizontal" product_box_style="single_product" />
      </WrapperComponent>

      {data?.products_list?.status && data?.products_list?.product_ids && (
        <section className="deal-section section-t-space">
          <div className="container">
            <TitleBox title={data?.products_list} type="single_product" />
            <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider} />
          </div>
        </section>
      )}

      {/* Testimonial And Comments */}
      {data?.testimonial?.status && banners && banners.length && (
        <WrapperComponent classes={{ sectionClass: "comment-section", fluidClass: "container" }} noRowCol={true}>
          <TitleBox title={data?.testimonial} type="single_product" />
          <Row className=" comment-list-box g-4 justify-content-center">
            {banners?.map((testimonial, i) => (
              <Col xl="4" sm="6" key={i}>
                <div className="comment-box">
                  <div className="profile-name">
                    <img src={storageURL + testimonial.image_url} className="img-fluid" alt="" />
                    <h4>{testimonial?.name}</h4>
                  </div>
                  <div className="profile-detail">
                    <p>{testimonial?.review}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </WrapperComponent>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className="instagram ratio_square section-t-space">
          <HomeSocialMedia media={data?.social_media || []} type="borderless" />
        </section>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <section className="section-b-space blog-wo-bg section-t-space">
          <HomeBrand brandIds={data?.brand?.brand_ids || []} sliderOptions={brandSlider3} />
        </section>
      )}
    </div>
  );
};

export default SingleProduct;
