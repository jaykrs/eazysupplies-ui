"use client"
import NoDataFound from "@/components/widgets/NoDataFound";
import Pagination from "@/components/widgets/Pagination";
import SettingContext from "@/context/settingContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { Card, CardBody, Table } from "reactstrap";
import request from "@/utils/axiosUtils";
import { GetOrderByUserId, OrderAPI } from "@/utils/axiosUtils/API";
import { showMonthWiseDateAndTime } from "@/utils/customFunctions/DateFormat";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import { useTranslation } from "react-i18next";
import AccountHeading from "../common/AccountHeading";
import Loader from "@/layout/loader";
import Capitalize from "@/utils/customFunctions/Capitalize";

const MyOrders = ({userId}) => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation("common");
  const { data, isLoading, refetch } = useFetchQuery([GetOrderByUserId], () => request({ url: GetOrderByUserId + userId, withCredentials: true }), {
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (res) => res?.data?.data,
  });
  const { convertCurrency } = useContext(SettingContext);
  
  const handleClick = (id) => {
    router.push("/account/order/details?orderId=" + id)
  }

  useEffect(() => {
    isLoading && refetch();
  }, [isLoading]);

  const calculatePrice = (items) => {
    const total = items?.reduce((sum, item) => sum + item?.price, 0);
    return total.toFixed(2)
  }

  if (isLoading)
    return (
      <div className="box-loader">
        <Loader classes={"blur-bg"} />
      </div>
    );
  return (
    <Card className="dashboard-table mt-0">
      <CardBody className="p-0">
        <AccountHeading title="MyOrders" classes={"top-sec"} />
        {data?.length > 0 ? (
          <>
            <div className="total-box mt-0">
              <div className="wallet-table mt-0">
                <div className="table-responsive">
                  <Table className="table cart-table order-table">
                    <thead>
                      <tr className="table-head">
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((order, i) => (
                        <tr 
                        key={order?.id}
                         className="cursor-pointer"
                          onClick={() => handleClick(order?.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <span className="fw-bolder">{order.id}</span>
                          </td>
                          <td>
                            <div className={`${order.status.toLowerCase() === "pending" ? "badge bg-pending" : order.status.toLowerCase() === "completed" ? "badge bg-completed" : "badge bg-cancelled custom-badge rounded-0"} custom-badge rounded-0`}>
                              <span>{Capitalize(order?.status)}</span>
                            </div>
                          </td>
                          <td>{convertCurrency(calculatePrice(order?.items))} </td>
                          <td>{showMonthWiseDateAndTime(order?.createdAt)}</td>

                          {/* <td>{order.payment_method.toUpperCase()}</td> */}
                          <td>
                            <Link href={`/account/order/details?orderId=${order.id}`}>
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

export default MyOrders;
