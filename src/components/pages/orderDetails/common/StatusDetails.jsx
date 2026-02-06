/**
 * StatusDetail Component
 * 
 * Visualizes the order status progression through a timeline tracker interface.
 * Displays real-time order status with appropriate icons and handles rejected/cancelled
 * order scenarios. Integrates payment status to determine overall order progress.
 * 
 * Features:
 * - Visual order status timeline with progress indicators
 * - Dynamic status images based on order state
 * - Payment status integration for accurate progress calculation
 * - Rejected/cancelled order handling
 * - Responsive design with appropriate icons
 * - Date formatting for status timestamps
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.data - Order data containing status and payment information
 * @param {string} props.data.status - Current order status
 * @param {Object} props.data.payment - Payment information object
 * @param {string} props.data.payment.status - Payment status
 * 
 * @example
 * return (
 *   <StatusDetail data={orderData} />
 * )
 * 
 * @returns {JSX.Element} Visual order status tracker with timeline
 * 
 * @developer : Simran Samir
 */

import request from "@/utils/axiosUtils";
import { OrderStatusAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
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
  
  /**
   * Predefined order status sequence with system-reserved statuses
   * Sequence defines the progression order: pending → approved → paid → shipped → delivered
   * rejected is handled as a terminal state
   */
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
      "id": 4,
      "name": "paid",
      "slug": "paid",
      "sequence": 3,
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
      "sequence": 4,
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
      "sequence": 5,
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
      "sequence": 6,
      "created_by_id": "1",
      "status": 1,
      "system_reserve": "1",
      "created_at": "2024-05-02T08:34:46.000000Z",
      "updated_at": "2024-05-02T08:34:46.000000Z",
      "deleted_at": null
    }
  ]);
  
  const [currentStatus, setCurrentStatus] = useState(0);

  /**
   * Mapping of status slugs to corresponding visual images
   * Provides appropriate icons for each order status state
   */
  const imageObj = {
    paid: processingImage,
    approved: outfordeliveryImage,
    pending: pendingImage,
    shipped: outfordeliveryImage,
    delivered: deliveredImage,
    rejected: cancelledImage,
  };

  /**
   * Calculates current status sequence based on order and payment data
   * Combines order status and payment status to determine accurate progression
   * Rejected orders are handled as terminal state (sequence 6)
   */
  useEffect(() => {
    // Determine the current status based on both order status and payment status
    let currentSequence = 0;
    
    if (data?.status?.toLowerCase() === "rejected") {
      currentSequence = 6; // Rejected - Terminal state
    } else {
      // Check order status progression
      if (data?.status?.toLowerCase() === "completed") {
        currentSequence = 5; // Delivered
      } 
      else if (data?.status?.toLowerCase() === "shipped") {
        currentSequence = 4; // Shipped
      }
      // Check payment status - if payment is successful, mark up to paid
      else if (data?.payment?.status?.toLowerCase() === "sucess" || data?.payment?.status?.toLowerCase() === "success") {
        currentSequence = 3; // Paid
      }
      else if (data?.status?.toLowerCase() === "approved") {
        currentSequence = 2; // Approved
      }
      else if (data?.status?.toLowerCase() === "pending") {
        currentSequence = 1; // Pending
      }
    }
    
    setCurrentStatus(currentSequence);
  }, [data]);

  /**
   * Formats hyphenated or underscored strings to proper display format
   * @param {string} value - Input string with hyphens or underscores
   * @returns {string} Formatted display string
   */
  const modifyWord = (value) => {
    if (!value) return "";
    return value
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /**
   * Gets display name for status items with special handling for 'paid'
   * @param {Object} statusItem - Status object from orderStatus array
   * @returns {string} Formatted display name
   */
  const getDisplayName = (statusItem) => {
    if (statusItem.slug === "paid") {
      return "Paid";
    }
    return modifyWord(statusItem.name);
  };

  /**
   * Determines visual state of each status item in the timeline
   * Handles active/completed states, rejected orders, and cancelled scenarios
   * @param {Object} statusItem - Status object from orderStatus array
   * @returns {Object} Status information object
   */
  const getStatusInfo = (statusItem) => {
    const dataStatusSlug = data?.status?.toLowerCase();
    const paymentStatus = data?.payment?.status?.toLowerCase();
    const rejected = dataStatusSlug === "rejected";
    const isCancelled = (dataStatusSlug === "rejected" && statusItem?.slug !== "rejected") || 
                       (dataStatusSlug !== "rejected" && statusItem?.slug === "rejected");
    
    // If this is the rejected status and order is not rejected, skip it
    if (statusItem?.slug === "rejected" && dataStatusSlug !== "rejected") {
      return { isActive: false, isCompleted: false, isCancelled: true, rejected: false };
    }
    
    // If order is rejected, only show rejected status
    if (rejected) {
      const isActive = statusItem?.slug === "rejected";
      return { isActive, isCompleted: false, isCancelled: false, rejected: true };
    }
    
    // Handle normal flow
    const statusSequence = statusItem?.sequence;
    
    // If current status is determined
    if (currentStatus > 0) {
      // For all statuses up to and including currentStatus, mark them as "active"
      const isActive = statusSequence <= currentStatus;
      const isCompleted = false; // We're not using "completed" class, all will be "active"
      
      return { isActive, isCompleted, isCancelled, rejected: false };
    }
    
    // Default case
    return { isActive: false, isCompleted: false, isCancelled, rejected: false };
  };

  /**
   * Formats date strings to user-friendly display format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string (e.g., "15 Jan 2024, 2:30 PM")
   */
  const dateFormat = (dateString) => {
    if (!dateString) return undefined;
    let date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hour = date.getHours() % 12;
    let minute = date.getMinutes().toString().padStart(2, '0');
    let period = date.getHours() >= 12 ? "PM" : "AM";
    return `${day} ${month} ${year}, ${hour === 0 ? 12 : hour}:${minute} ${period}`;
  };
  
  return (
    <div className="mb-4">
      {/* Order Status Timeline Container */}
      <div className="tracking-panel">
        {data && !data?.item?.length ? (
          <ul>
            {orderStatus?.length > 0
              ? orderStatus
                  // Filter: only show rejected status if order is actually rejected
                  .filter(item => item.slug !== "rejected" || data?.status?.toLowerCase() === "rejected")
                  // Sort by sequence for proper timeline order
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((elem, index) => {
                    const { isActive, isCompleted, isCancelled, rejected } = getStatusInfo(elem);
                    
                    // Skip cancelled items from display
                    if (isCancelled) return null;
                    
                    return (
                      <li 
                        className={`${isActive ? "active" : ""} ${rejected ? "cancelled-box" : ""}`} 
                        key={index}
                      >
                        <div className="panel-content">
                          {/* Status Icon */}
                          <div className="icon">
                            {elem?.slug && (
                              <Image 
                                src={imageObj[elem?.slug] || imageObj["pending"]} 
                                className="img-fluid" 
                                alt={elem?.slug} 
                                height={40} 
                                width={40} 
                              />
                            )}
                          </div>
                          {/* Status Label */}
                          <div className="status">{getDisplayName(elem)}</div>
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