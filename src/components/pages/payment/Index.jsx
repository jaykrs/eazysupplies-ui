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
import { useEffect, useState } from "react";
import axios from "axios";
import PaymentTable from "./PaymentList";
import AccountSidebar from "../account/common/AccountSidebar";
import ResponsiveMenuOpen from "../account/common/ResponsiveMenuOpen";

const PaymentList = () => {
  const search = useSearchParams();
  let orderNumber = search.get("order_number");
  let emailPhone = search.get("email_or_phone");
  const [paymentData, setPaymentData] = useState([

  ])

  const router = useRouter();
  const { data, isLoading } = useFetchQuery([TrackingAPI], () => request({ url: TrackingAPI, params: { order_number: orderNumber, email_or_phone: emailPhone } }, router), {
    enabled: true,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });

  useEffect(() => {
    setPaymentData([
      {
        id: 1,
        name: "Avinash Kumar",
        orderId: "ORD1001",
        amount: 2450,
        status: "pending",
        transactionId: "TXN78651234",
        createdDate: "2025-10-13T09:25:00Z"
      },
      {
        id: 2,
        name: "Ravi Sharma",
        orderId: "ORD1002",
        amount: 3100,
        status: "success",
        transactionId: "TXN78651235",
        createdDate: "2025-10-12T14:45:00Z"
      },
      {
        id: 3,
        name: "Priya Singh",
        orderId: "ORD1003",
        amount: 1890,
        status: "failed",
        transactionId: "TXN78651236",
        createdDate: "2025-10-11T11:10:00Z"
      },
      {
        id: 4,
        name: "Amit Verma",
        orderId: "ORD1004",
        amount: 2750,
        status: "success",
        transactionId: "TXN78651237",
        createdDate: "2025-10-10T16:05:00Z"
      },
      {
        id: 5,
        name: "Neha Patel",
        orderId: "ORD1005",
        amount: 3300,
        status: "pending",
        transactionId: "TXN78651238",
        createdDate: "2025-10-09T08:55:00Z"
      },
      {
        id: 6,
        name: "Rahul Mehta",
        orderId: "ORD1006",
        amount: 1999,
        status: "failed",
        transactionId: "TXN78651239",
        createdDate: "2025-10-08T13:30:00Z"
      },
      {
        id: 7,
        name: "Sneha Kapoor",
        orderId: "ORD1007",
        amount: 2890,
        status: "success",
        transactionId: "TXN78651240",
        createdDate: "2025-10-07T10:00:00Z"
      },
      {
        id: 8,
        name: "Deepak Yadav",
        orderId: "ORD1008",
        amount: 4100,
        status: "pending",
        transactionId: "TXN78651241",
        createdDate: "2025-10-06T09:15:00Z"
      },
      {
        id: 9,
        name: "Anjali Gupta",
        orderId: "ORD1009",
        amount: 2200,
        status: "failed",
        transactionId: "TXN78651242",
        createdDate: "2025-10-05T17:25:00Z"
      },
      {
        id: 10,
        name: "Vikram Rao",
        orderId: "ORD1010",
        amount: 3550,
        status: "success",
        transactionId: "TXN78651243",
        createdDate: "2025-10-04T12:00:00Z"
      }
    ])
    // axios.get(BASE_URL + GetOrderByUserId + "2",{withCredentials:true}).then((res)=>{
    //   console.log(res.data?.data,"Order Data")
    //   setPaymentData(res.data?.data)
    // }, (err)=>{
    //   console.log(err)
    // })
  }, [])

  if (isLoading) return <Loader />;
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
                {paymentData && paymentData?.length > 0 ? (
                  <PaymentTable payments={paymentData} />
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
