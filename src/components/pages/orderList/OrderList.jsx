import Loader from "@/layout/loader";
import ConsumerDetails from "./common/ConsumerDetails";
import StatusDetail from "./common/StatusDetails";
import SubTable from "./common/SubTable";
import TableDetails from "./common/TableDetails";
import TitleDetails from "./common/TitleDetails";
import { useEffect } from "react";
import { BASE_URL, CreateOrderAPI, GetOrderByUserId } from "@/utils/axiosUtils/API";
import axios from "axios";
import { useRouter } from "next/navigation";

const OrderTable = ({ data, orders, isLoading, orderNumber }) => {
  const router = useRouter();
  const handleClick = (id) => {
    router.push("/account/order/details?orderId=" + id)
  }

  const calculatePrice = (items) => {
    const total = items?.reduce((sum, item) => sum + item?.price, 0);
    return total.toFixed(2)
  }

  if (isLoading) return <Loader />;
  return (
    <>
      <div className="container py-4">
        <h2 className="h5 fw-semibold mb-4">Orders</h2>

        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Status</th>
                <th scope="col">Price</th>
                <th scope="col">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order?.id}
                    className="cursor-pointer"
                    onClick={() => handleClick(order?.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="fw-medium text-dark">{order.id}</td>
                    <td
                      className={`fw-semibold ${order?.status === "Completed"
                        ? "text-success"
                        : order.status === "Pending"
                          ? "text-warning"
                          : "text-danger"
                        }`}
                    >
                      {order?.status}
                    </td>
                    <td className="text-dark">
                      ₹{calculatePrice(order?.items)}
                    </td>
                    <td className="text-muted">
                      {new Date(order?.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted fst-italic py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderTable;
