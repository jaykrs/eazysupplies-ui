import Loader from "@/layout/loader";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Table } from "reactstrap";
import AccountHeading from "../account/common/AccountHeading";
import Capitalize from "@/utils/customFunctions/Capitalize";
import { showMonthWiseDateAndTime } from "@/utils/customFunctions/DateFormat";
import { RiEyeLine } from "react-icons/ri";
import Link from "next/link";
import NoDataFound from "@/components/widgets/NoDataFound";
import Pagination from "@/components/widgets/Pagination";
import SettingContext from "@/context/settingContext";

/**
 * PaymentTable Component
 * 
 * Displays a paginated list of payments in a table format with horizontal scrolling.
 * Shows payment ID, order ID, transaction ID, amount, status, date, and view action.
 * Payments are sorted with latest entries first for better user experience.
 * Handles loading states, empty states, and pagination for large datasets.
 * 
 * Features:
 * - Latest payments displayed first (sorted by date descending)
 * - Horizontal scrolling for better mobile responsiveness
 * - Standard column spacing for comfortable readability
 * - Client-side pagination for smooth user experience
 * - Status-based color coding for quick visual reference
 * 
 * @param {Object} props - Component props
 * @param {Array} props.payments - Array of payment objects from API
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {string} props.orderNumber - Optional order number filter
 * @returns {JSX.Element} Payments table with pagination and horizontal scroll
 * 
 * @developer Simran Samir
 */
const PaymentTable = ({ payments, isLoading, orderNumber }) => {
  const [allPayments, setAllPayments] = useState([]);
  const [currentPayments, setCurrentPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPayments, setTotalPayments] = useState(0);
  
  const router = useRouter();
  const { convertCurrency } = useContext(SettingContext);

  /**
   * Sorts payments by date in descending order (latest first)
   * @param {Array} paymentsArray - Array of payment objects
   * @returns {Array} Sorted payments array with latest first
   */
  const sortPaymentsByDate = (paymentsArray) => {
    if (!paymentsArray || !Array.isArray(paymentsArray)) return [];
    
    return [...paymentsArray].sort((a, b) => {
      const dateA = new Date(a?.createdAt || a?.paymentDate || 0);
      const dateB = new Date(b?.createdAt || b?.paymentDate || 0);
      return dateB - dateA; // Descending order (latest first)
    });
  };

  /**
   * Initializes payments data with sorting and applies pagination
   */
  useEffect(() => {
    if (payments && Array.isArray(payments)) {
      const sortedPayments = sortPaymentsByDate(payments);
      setAllPayments(sortedPayments);
      setTotalPayments(sortedPayments.length);
      applyPagination(sortedPayments, currentPage, itemsPerPage);
    }
  }, [payments]);

  /**
   * Re-applies pagination when currentPage or itemsPerPage changes
   */
  useEffect(() => {
    if (allPayments.length > 0) {
      applyPagination(allPayments, currentPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage, allPayments]);

  /**
   * Applies client-side pagination to the sorted payments data
   * Calculates start and end indices for the current page
   * 
   * @param {Array} payments - Sorted payments array
   * @param {number} page - Current page number (1-based)
   * @param {number} limit - Number of items per page
   */
  const applyPagination = (payments, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPayments = payments.slice(startIndex, endIndex);
    
    setCurrentPayments(paginatedPayments);
  };

  /**
   * Handles page change for pagination
   * Updates current page and re-applies pagination
   * 
   * @param {number} page - The page number to navigate to
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    applyPagination(allPayments, page, itemsPerPage);
  };

  /**
   * Handles items per page change
   * Resets to first page when changing items per page for better UX
   * 
   * @param {Event} e - The change event from select element
   */
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page for consistent user experience
    applyPagination(allPayments, 1, newLimit);
  };

  /**
   * Handles row click to navigate to order details page
   * Provides quick access to order information from payment records
   * 
   * @param {string|number} orderId - Order ID to view details for
   */
  const handleClick = (orderId) => {
    if (orderId) {
      router.push("/account/order/details?orderId=" + orderId);
    }
  }

  /**
   * Determines appropriate CSS class for payment status badge
   * Provides visual indicators for different payment states
   * 
   * @param {string} status - Payment status from API
   * @returns {string} CSS class for the status badge
   */
  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "success":
      case "paid":
        return "badge bg-success";
      case "pending":
      case "processing":
        return "badge bg-warning";
      case "failed":
      case "cancelled":
      case "declined":
        return "badge bg-danger";
      case "refunded":
      case "reversed":
        return "badge bg-info";
      default:
        return "badge bg-secondary";
    }
  };

  // Calculate pagination information for display
  const totalPages = Math.ceil(totalPayments / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalPayments);

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="box-loader">
        <Loader classes={"blur-bg"} />
      </div>
    );
  }

  return (
    <Card className="dashboard-table mt-0">
      <CardBody className="p-0">
        <AccountHeading title="Payments" classes={"top-sec"} />
        
        {/* Payments Table with Standard Layout */}
        {currentPayments?.length > 0 ? (
          <>
            {/* Pagination Controls - Top */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <div className="d-flex align-items-center">
                <span className="me-2">Show:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={handleItemsPerPageChange}
                  className="form-select form-select-sm w-auto"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="ms-2">entries</span>
              </div>
              
              <div className="text-muted">
                Showing {startItem} to {endItem} of {totalPayments} payments
              </div>
            </div>

            <div className="total-box mt-0">
              <div className="wallet-table mt-0">
                {/* Horizontal Scroll Container for Table */}
                <div 
                  className="table-responsive" 
                  style={{ 
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {/* Standard Table with Normal Column Spacing */}
                  <Table 
                    className="table cart-table order-table" 
                    style={{ 
                      minWidth: '900px' // Ensure minimum width for horizontal scroll
                    }}
                  >
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
                      {currentPayments.map((payment, index) => (
                        <tr
                          key={payment?.id || index}
                          className="cursor-pointer"
                          onClick={() => handleClick(payment?.orderId)}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Payment ID */}
                          <td>
                            <span className="fw-bolder">
                              #{payment?.id || `PAY-${index + 1}`}
                            </span>
                          </td>
                          
                          {/* Order ID */}
                          <td>
                            <span className="fw-medium">
                              {payment?.orderId || "N/A"}
                            </span>
                          </td>
                          
                          {/* Transaction ID */}
                          <td 
                            className="fw-medium text-dark"
                            title={payment?.transectionid} // Show full ID on hover
                          >
                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                              {payment?.transectionid ?
                                payment.transectionid.toUpperCase() :
                                "PENDING"
                              }
                            </span>
                          </td>

                          {/* Amount */}
                          <td>
                            <span className="fw-bold">
                              {convertCurrency ? 
                                convertCurrency(payment?.amount) : 
                                `₹${(payment?.amount || 0).toFixed(2)}`
                              }
                            </span>
                          </td>
                          
                          {/* Status with Colored Badge */}
                          <td>
                            <div className={`${getStatusBadgeClass(payment?.status)} custom-badge rounded-0`}>
                              <span>{Capitalize(payment?.status || "Unknown")}</span>
                            </div>
                          </td>
                          
                          {/* Date */}
                          <td>
                            <span>
                              {payment?.createdAt ? 
                                showMonthWiseDateAndTime(payment.createdAt) : 
                                "Date not available"
                              }
                            </span>
                          </td>
                          
                          {/* View Details Link */}
                          <td>
                            <Link 
                              href={`/account/order/details?orderId=${payment?.orderId || payment?.id}`}
                              onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
                              className="text-decoration-none"
                              title="View Order Details"
                            >
                              <RiEyeLine size={18} className="text-primary" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Pagination Controls - Bottom - Only show if we have multiple pages */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <div className="text-muted">
                  Showing {startItem} to {endItem} of {totalPayments} payments
                </div>
                
                <div className="product-pagination">
                  <div className="theme-pagination-block">
                    <nav>
                      <Pagination 
                        current_page={currentPage} 
                        total={totalPayments} 
                        per_page={itemsPerPage} 
                        setPage={handlePageChange}
                      />
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <NoDataFound 
            customClass="no-data-added" 
            imageUrl={`/assets/svg/empty-items.svg`} 
            title="NoPaymentsFound" 
            description="NoPaymentsHaveBeenMadeYet" 
            height="300" 
            width="300" 
          />
        )}
      </CardBody>
    </Card>
  );
};

export default PaymentTable;
