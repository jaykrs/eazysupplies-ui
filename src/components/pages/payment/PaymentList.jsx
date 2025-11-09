import Loader from "@/layout/loader";
import ConsumerDetails from "./common/ConsumerDetails";
import StatusDetail from "./common/StatusDetails";
import SubTable from "./common/SubTable";
import TableDetails from "./common/TableDetails";
import TitleDetails from "./common/TitleDetails";
import { useContext, useEffect } from "react";
import { BASE_URL, CreateOrderAPI, GetOrderByUserId } from "@/utils/axiosUtils/API";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardBody, Pagination, Table } from "reactstrap";
import AccountHeading from "../account/common/AccountHeading";
import Capitalize from "@/utils/customFunctions/Capitalize";
import { showMonthWiseDateAndTime } from "@/utils/customFunctions/DateFormat";
import { RiEyeLine } from "react-icons/ri";
import Link from "next/link";
import NoDataFound from "@/components/widgets/NoDataFound";
import SettingContext from "@/context/settingContext";

const PaymentTable = ({ data, payments, isLoading, orderNumber }) => {
  const router = useRouter();
  const { convertCurrency } = useContext(SettingContext);

  const handleClick = (id) => {
    router.push("/order/details?orderId=" + id)
  }

  if (isLoading)
    return (
      <div className="box-loader">
        <Loader classes={"blur-bg"} />
      </div>
    )
  return (
    <Card className="dashboard-table mt-0">
      <CardBody className="p-0">
        <AccountHeading title="Payments" classes={"top-sec"} />
        {payments?.length > 0 ? (
          <>
            <div className="total-box mt-0">
              <div className="wallet-table mt-0">
                <div className="table-responsive">
                  <Table className="table cart-table order-table">
                    <thead>
                      <tr className="table-head">
                        <th>Payment ID</th>
                        <th>Order ID</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments?.map((payment, i) => (
                        <tr
                          key={payment?.id}
                          className="cursor-pointer"
                          onClick={() => handleClick(payment?.orderId)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <span className="fw-bolder">{payment.id}</span>
                          </td>
                          <td>
                            {payment.orderId}
                          </td>
                          <td className="fw-medium text-dark">{!!payment?.transactionId ? payment?.transactionId.toUpperCase() : "PENDING"}</td>

                          <td>{convertCurrency(payment?.amount)} </td>
                          <td>
                            <div className={`${payment?.status.toLowerCase() === "pending" ? "badge bg-pending" : payment?.status.toLowerCase() === "completed" ? "badge bg-completed" : "badge bg-cancelled custom-badge rounded-0"} custom-badge rounded-0`}>
                              <span>{Capitalize(payment?.status)}</span>
                            </div>
                          </td>
                          <td>{showMonthWiseDateAndTime(payment?.createdAt)}</td>
                          <td>
                            <Link href={`/order/details?orderId=${payment.id}`}>
                              <RiEyeLine />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            {/* <div className="product-pagination">
              <div className="theme-pagination-block">
                <nav>
                  <Pagination current_page={data?.current_page} total={data?.total} per_page={data?.per_page} setPage={setPage} />
                </nav>
              </div>
            </div> */}
          </>
        ) : (
          <NoDataFound customClass="no-data-added" imageUrl={`/assets/svg/empty-items.svg`} title="NoOrdersFound" description="NoOrdersHaveBeenMadeYet" height="300" width="300" />
        )}
      </CardBody>
    </Card>
  );
};

export default PaymentTable;
