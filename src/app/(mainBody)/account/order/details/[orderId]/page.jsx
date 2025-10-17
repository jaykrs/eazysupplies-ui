'use client'
import OrderDetailsTracking from "@/components/pages/orderDetails/Index";
import { useParams } from "next/navigation";

const OrderDetails = () => {
  const params = useParams()
  return <>{params?.orderId && <OrderDetailsTracking />}</>;
};

export default OrderDetails;
