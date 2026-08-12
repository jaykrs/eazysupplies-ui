"use client";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import Breadcrumb from "@/utils/commonComponents/breadcrumb";
import { Col, TabPane } from "reactstrap";
import ResponsiveMenuOpen from "../common/ResponsiveMenuOpen";
import MyOrders from "./MyOrders";
import AccountContext from "@/context/accountContext";
import { useContext, useEffect } from "react";

const AccountOrders = () => {
  const { accountData } = useContext(AccountContext);

  useEffect(()=>{
    console.log((accountData?.userId != undefined),accountData?.userId, "ppppo")
  },[accountData])
  return (
    <>
      <Breadcrumb title={"Order"} subNavigation={[{ name: "Order" }]} />
      <WrapperComponent classes={{ sectionClass: "dashboard-section section-b-space user-dashboard-section", fluidClass: "container" }} customCol={true}>
        <Col lg={12}>
          <div className="faq-content">
            <div className="tab-content">
              <ResponsiveMenuOpen />
              <TabPane className="show fade active">
                {accountData?.userId != undefined && <MyOrders userId={accountData?.userId} />}
              </TabPane>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

export default AccountOrders;
