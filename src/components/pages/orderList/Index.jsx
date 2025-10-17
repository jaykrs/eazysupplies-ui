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
import TrackOrderDetails from "./OrderList";
import OrderTable from "./OrderList";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountSidebar from "../account/common/AccountSidebar";
import ResponsiveMenuOpen from "../account/common/ResponsiveMenuOpen";

const OrderList = () => {
  const search = useSearchParams();
  let orderNumber = search.get("order_number");
  let emailPhone = search.get("email_or_phone");
  const [orderData, setOrderData] = useState([])

  const router = useRouter();
  const { data, isLoading } = useFetchQuery([TrackingAPI], () => request({ url: TrackingAPI, params: { order_number: orderNumber, email_or_phone: emailPhone } }, router), {
    enabled: true,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });

  useEffect(() => {
    axios.get(BASE_URL + GetOrderByUserId + "2", { withCredentials: true }).then((res) => {
      console.log(res.data?.data, "Order Data")
      setOrderData(res.data?.data)
    }, (err) => {
      console.log(err)
    })
  }, [])

  const sampleOrders = [
    { email: "user@hotmail.com", id: 101, status: "Completed", price: 2499.99, date: "2025-10-01" },
    { email: "user@hotmail.com", id: 102, status: "Pending", price: 1299.5, date: "2025-10-03" },
    { email: "user@hotmail.com", id: 103, status: "Cancelled", price: 899.0, date: "2025-10-05" },
  ];

  if (isLoading) return <Loader />;
  return (
    <>
      <Breadcrumb title={"OrderList"} subNavigation={[{ name: "OrderList" }]} />
      <WrapperComponent classes={{ sectionClass: "dashboard-section section-b-space user-dashboard-section", fluidClass: 'container' }} customCol={true}>
        <AccountSidebar tabActive={"order"} />
        <Col lg={9}>
          <div className="faq-content">
            <div className="tab-pane">
              <ResponsiveMenuOpen />
              <Col xxl={12} lg={8}>
                {orderData && orderData?.length > 0 ? (
                  <OrderTable orders={orderData} />
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

export default OrderList;
