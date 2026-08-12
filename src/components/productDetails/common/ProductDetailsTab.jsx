import NavTabTitles from "@/components/widgets/NavTabs";
import NoDataFound from "@/components/widgets/NoDataFound";
import TextLimit from "@/utils/customFunctions/TextLimit";
import { useState } from "react";
import { Col, Row, TabContent, TabPane } from "reactstrap";
import CustomerReview from "./CustomerReview";
import QnATab from "./QnATab";
import { RiArrowDownSLine } from "react-icons/ri";
import Btn from "@/elements/buttons/Btn";

const ProductDetailsTab = ({ productState }) => {
  let [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const ProductDetailsTabTitle = [
    { id: 1, name: "Description" },
    //{ id: 2, name: "Review" },
    //{ id: 3, name: "QA" },
  ];

  const seeMore = () => {
    setShowMore(!showMore);
  };
  return (
    <Col sm={12} lg={12}>
      <NavTabTitles classes={{ navClass: "nav nav-tabs nav-material" }} titleList={ProductDetailsTabTitle} activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent className="nav-material" activeTab={activeTab}>
       <TabPane className={activeTab == 1 ? "show active" : ""}>
          <style>{`
            .product-description { 
              white-space: pre-line !important; 
            }
          `}</style>
          <div className={`product-description more-less-box ${showMore ? "more" : ""}`}>
  <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
    {(showMore || productState?.product?.description?.length <= 1500
      ? productState?.product?.description
      : productState?.product?.description?.substring(0, productState?.product?.description?.length / 2) + "..."
    )
      ?.split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => (
        <li key={index} className="text-content" style={{ marginBottom: "0.5rem", display: "list-item" }}>
          {line}
        </li>
      ))}
  </ul>
    {productState?.product?.description?.length > 1500 && <Btn className="btn-solid hover-solid bg-theme btn-md scroll-button btn-sm mt-3 more-lest-btn" onClick={seeMore}>
              {showMore ? "Show Less" : "Show more"}
              <RiArrowDownSLine />
            </Btn>}
          </div>
        </TabPane>

        <TabPane className={activeTab == 2 ? "show active" : ""}>
          <div className="single-product-tables ">
            <Row>
              {productState?.product?.can_review || productState?.product?.reviews_count ? (
                <CustomerReview productState={productState} />
              ) : (
                <Col xl={12}>
                  <NoDataFound customClass="no-data-added" title="NoReviewYet" description="NoReviewYetDescription" />
                </Col>
              )}
            </Row>
          </div>
        </TabPane>
        <TabPane className={activeTab == 3 ? "show active" : ""}>
          <QnATab productState={productState} activeTab={activeTab} />
        </TabPane>
      </TabContent>
    </Col>
  );
};

export default ProductDetailsTab;
