import request from "@/utils/axiosUtils";
import { OrderStatusAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import Image from "next/image";
import { useRouter } from "next/navigation";
import cancelledImage from "../../../../../public/assets/svg/tracking/cancelled.svg";
import deliveredImage from "../../../../../public/assets/svg/tracking/delivered.svg";
import outfordeliveryImage from "../../../../../public/assets/svg/tracking/out-for-delivery.svg";
import pendingImage from "../../../../../public/assets/svg/tracking/pending.svg";
import processingImage from "../../../../../public/assets/svg/tracking/processing.svg";
import shippedImage from "../../../../../public/assets/svg/tracking/shipped.svg";
import { useEffect, useState } from "react";

const StatusDetail = ({ data }) => {
  const router = useRouter();
  // const { data: orderStatus } = useFetchQuery([OrderStatusAPI], () => request({ url: OrderStatusAPI }, router), {
  //   enabled: true,
  //   refetchOnWindowFocus: false,
  //   select: (res) => res?.data?.data,
  // });
  const [orderStatus] = useState([
    {
      "id": 1,
      "name": "pending",
      "slug": "pending",
      "sequence": 1,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    },
    {
      "id": 2,
      "name": "approved",
      "slug": "approved",
      "sequence": 2,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    },
    {
      "id": 3,
      "name": "rejected",
      "slug": "rejected",
      "sequence": 3,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    },
    {
      "id": 4,
      "name": "processing",
      "slug": "processing",
      "sequence": 4,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    },
    {
      "id": 5,
      "name": "shipped",
      "slug": "shipped",
      "sequence": 5,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    },
    {
      "id": 7,
      "name": "delivered",
      "slug": "delivered",
      "sequence": 7,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    }
  ])
  const [currentStatus, setCurrentStatus] = useState()

  const imageObj = {
    processing: processingImage,
    approved: shippedImage,
    pending: pendingImage,
    shipped: outfordeliveryImage,
    delivered: deliveredImage,
    rejected: cancelledImage,
  };

  useEffect(() => {
    const temp = orderStatus.find(item => item?.slug == data?.status?.toLowerCase()).sequence
    setCurrentStatus(temp)
  }, [data])

  const modifyWord = (value) => {
    return value
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const dateFormat = (dateString) => {
    if (!dateString) return undefined; // Handle undefined case
    let date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hour = date.getHours() % 12; // Convert hour to 12-hour format
    let minute = date.getMinutes();
    let period = date.getHours() >= 12 ? "PM" : "AM";
    return `${day} ${month} ${year}, ${hour === 0 ? 12 : hour}:${minute} ${period}`; // Fixed time format
  };
  return (
    <div className="mb-4">
      <div className="tracking-panel">
        {data && !data?.item?.length ? (
          <ul>
            {orderStatus?.length > 0
              ? orderStatus?.map((elem, index) => {
                elem = elem;
                const rejected = data?.status?.toLowerCase() == "rejected";
                const isCancelled = (data?.status?.toLowerCase() == "rejected" && elem?.slug != "rejected") || (data?.status?.toLowerCase() != "rejected" && elem?.slug == "rejected");
                const isActive = (elem?.slug == data?.status?.toLowerCase() || elem?.sequence <= currentStatus) && !isCancelled;
                return (
                  <li className={`${isCancelled ? "d-none" : ""} ${isActive ? "active" : ""} ${rejected ? "cancelled-box" : ""}`} key={index}>
                    <div className="panel-content">
                      <div className="icon">{elem?.slug && <Image src={elem?.slug == "approved" ? imageObj["accepted"] : imageObj[elem?.slug]} className="img-fluid" alt={elem?.slug} height={40} width={40} />}</div>
                      <div className="status">{modifyWord(elem?.name)}</div>
                    </div>
                  </li>
                );
              })
              : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default StatusDetail;
