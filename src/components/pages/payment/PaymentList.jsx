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

const PaymentTable = ({ data, payments, isLoading, orderNumber }) => {
  const router = useRouter();
  const handleClick = (id) => {
    router.push("/order/details?orderId=" + id)
  }

  if (isLoading) return <Loader />;
  return (
    <>
      <div className="container py-4">
        <h2 className="h5 fw-semibold mb-4">Payments</h2>

        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th scope="col">Payment ID</th>
                <th scope="col">Order ID</th>
                <th scope="col">Transaction ID</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments?.length > 0 ? (
                payments?.map((payment) => (
                  <tr
                    key={payment?.id}
                    className="cursor-pointer"
                    onClick={() => handleClick(payment?.orderId)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="fw-medium text-dark">{payment?.id}</td>
                    <td className="fw-medium text-dark">{payment?.orderId}</td>
                    <td className="fw-medium text-dark">{!!payment?.transactionId ? payment?.transactionId.toUpperCase() : "PENDING"}</td>
                    <td className="text-dark">
                      ₹{payment?.amount}
                    </td>
                    <td
                      className={`fw-semibold ${payment?.status === "success"
                        ? "text-success"
                        : payment.status === "Pending"
                          ? "text-warning"
                          : "text-danger"
                        }`}
                    >
                      {payment?.status}
                    </td>

                    <td className="text-muted">
                      {new Date(payment?.createdAt).toLocaleDateString()}
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

export default PaymentTable;
