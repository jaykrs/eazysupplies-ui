"use client";
import NoDataFound from "@/components/widgets/NoDataFound";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import Loader from "@/layout/loader";
import request from "@/utils/axiosUtils";
import { BASE_URL, GetOrderByUserId, TrackingAPI } from "@/utils/axiosUtils/API";
import Breadcrumb from "@/utils/commonComponents/breadcrumb";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import { useRouter, useSearchParams } from "next/navigation";
import { Col, TabContent, TabPane } from "reactstrap";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PaymentTable from "./PaymentList";
import AccountSidebar from "../account/common/AccountSidebar";
import ResponsiveMenuOpen from "../account/common/ResponsiveMenuOpen";
import AccountContext from "@/context/accountContext";

const PaymentList = () => {
  const search = useSearchParams();
  let orderNumber = search.get("order_number");
  let emailPhone = search.get("email_or_phone");
  const [paymentData, setPaymentData] = useState([]);
  const { accountData } = useContext(AccountContext);
  const router = useRouter();
  // const { data, isLoading } = useFetchQuery([TrackingAPI], () => request({ url: TrackingAPI, params: { order_number: orderNumber, email_or_phone: emailPhone } }, router), {
  //   enabled: true,
  //   refetchOnWindowFocus: false,
  //   select: (res) => res?.data,
  // });

  const userId = accountData?.data?.id;
  const { data: payments, isLoading } = useFetchQuery(
    ["payments", userId],
    () => request({ url: "/payments", params: { withCookies: 1 } }, router),
    {
      enabled: Boolean(userId),
      refetchOnWindowFocus: false,
      select: (response) => response?.data?.data || [],
    }
  );

  useEffect(() => setPaymentData(payments || []), [payments]);

  // if (isLoading) return <Loader />;
  return (
    <>
      <Breadcrumb title={"PaymentList"} subNavigation={[{ name: "PaymentList" }]} />
      <WrapperComponent classes={{ sectionClass: "dashboard-section section-b-space user-dashboard-section", fluidClass: 'container' }} customCol={true}>
        <AccountSidebar tabActive={"payment"} />
        <Col lg={9}>
          <div className="faq-content">
            <div className="tab-pane">
              <ResponsiveMenuOpen />
              <Col xxl={12} lg={8}>
                {isLoading ? <Loader /> : paymentData?.length > 0 ? (
                  <PaymentTable payments={paymentData} isLoading={isLoading} />
                ) : (
                  <NoDataFound customClass="no-data-added" imageUrl={`/assets/svg/empty-items.svg`} title="NoOrderFound" height="300" width="300" />
                )}
              </Col>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

export default PaymentList;
