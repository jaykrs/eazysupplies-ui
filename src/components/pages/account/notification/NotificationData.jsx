/**
 * NotificationData Component
 * 
 * Displays a user's notifications in a modern, interactive UI with filtering capabilities.
 * Shows notifications with expandable details, read/unread status, and actions to mark as read.
 * Supports filtering by all/unread/read status and real-time updates.
 * 
 * Key Features:
 * - Modern card-based notification display with hover effects
 * - Filter notifications by status (all/unread/read)
 * - Expandable notification details
 * - Mark individual/all notifications as read
 * - Extract and display emails and links from notification content
 * - Responsive design with smooth animations
 * - User-specific notification filtering
 * - Client-side pagination for 100+ notifications
 * 
 * @returns {JSX.Element} Notification management interface with filtering and actions
 * 
 * @developer Simran Samir
 */

import "../../../../index.css";
import Loader from "@/layout/loader";
import request from "@/utils/axiosUtils";
import { NotificationAPI } from "@/utils/axiosUtils/API";
import { showMonthWiseDateAndTime } from "@/utils/customFunctions/DateFormat";
import { useTranslation } from "react-i18next";
import { 
  RiTimeLine, 
  RiCheckDoubleLine, 
  RiNotification2Line,
  RiArrowRightSLine,
  RiMailLine,
  RiExternalLinkLine,
  RiArrowLeftSLine,
  RiArrowRightSLine as RiArrowRightLine
} from "react-icons/ri";
import { Card, CardBody } from "reactstrap";
import AccountHeading from "../common/AccountHeading";
import { useState, useEffect, useCallback, useMemo, memo } from "react";

// Memoized Notification Item for better performance
const NotificationItem = memo(({ 
  notification, 
  isExpanded, 
  onToggleExpand, 
  onMarkRead 
}) => {
  const remarks = notification?.remarks || notification?.data?.message || notification?.name || "You have a new notification";
  const truncatedRemarks = remarks.length > 180 ? remarks.substring(0, 180) + "..." : remarks;
  const email = remarks.match(/[\w\.-]+@[\w\.-]+\.\w+/)?.[0] || "";
  const activationLink = remarks.match(/https?:\/\/[^\s]+/g)?.[0] || "";
  const isLongText = remarks.length > 180;
  const type = notification?.type || "General";
  
  const handleClick = useCallback(() => {
    if (!notification.readStatus) {
      onMarkRead(notification.id);
    }
    onToggleExpand(notification.id);
  }, [notification.id, notification.readStatus, onMarkRead, onToggleExpand]);
  
  const getNotificationIcon = useCallback((type) => {
    switch(type?.toLowerCase()) {
      case 'welcome': return <RiMailLine />;
      case 'order': return '📦';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      default: return <RiNotification2Line />;
    }
  }, []);
  
  return (
    <li 
      className={`notification-card-modern ${!notification.readStatus ? 'unread' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-header-modern">
        <div className="notification-title-wrapper-modern">
          <div className="notification-icon-modern">
            {getNotificationIcon(type)}
          </div>
          <div>
            <h4 className="notification-title-modern">
              {notification?.name || "New Notification"}
            </h4>
            <div className="notification-meta-modern">
              <span className="notification-type-modern">
                {type}
              </span>
              {notification.recepient === 'all' ? (
                <span className="notification-recipient-modern">
                  <RiNotification2Line size={12} /> All Users
                </span>
              ) : (
                <span className="notification-recipient-modern">
                  👤 User {notification.recepient}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="notification-status-modern">
          {!notification.readStatus ? (
            <div className="unread-dot-modern" />
          ) : (
            <div className="read-badge-modern">
              <RiCheckDoubleLine /> Read
            </div>
          )}
        </div>
      </div>
      
      <div className="notification-body-modern">
        <div 
          className={`notification-message-modern ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
          {isExpanded ? remarks : truncatedRemarks}
        </div>
        
        {isLongText && (
          <button 
            className="expand-toggle-btn-modern"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(notification.id);
            }}
          >
            {isExpanded ? "Show Less" : "Read More"}
            <RiArrowRightSLine style={{ 
              transform: isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)',
              transition: 'transform 0.2s ease'
            }} />
          </button>
        )}
        
        {(email || activationLink) && (
          <div className="notification-extras-modern">
            {email && (
              <div className="notification-email-modern">
                <RiMailLine />
                <strong>Email:</strong> {email}
              </div>
            )}
            
            {activationLink && (
              <div className="notification-link-modern">
                <RiExternalLinkLine />
                <a 
                  href={activationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open Activation Link
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="notification-footer-modern">
        <div className="notification-time-modern">
          <RiTimeLine /> {showMonthWiseDateAndTime(notification.createdAt)}
        </div>
        
        <div className="notification-actions-modern">
          {!notification.readStatus && (
            <button
              className="notification-action-button-modern"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
            >
              <RiCheckDoubleLine /> Mark as read
            </button>
          )}
        </div>
      </div>
    </li>
  );
});

const NotificationData = () => {
  const { t } = useTranslation("common");
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Changed to state variable
  const [allNotifications, setAllNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user?.id || user?.userId || '3');
  }, []);

  // Fetch all notifications (simplified - no pagination params)
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await request({ 
        url: NotificationAPI, 
        method: 'GET',
        withCredentials: true 
      });
      
      const fetchedNotifications = response?.notifications || response?.data?.notifications || [];
      console.log("Fetched notifications:", fetchedNotifications.length);
      setAllNotifications(fetchedNotifications);
      
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
    }
  }, [currentUserId, fetchNotifications]);

  // Filter notifications for current user only
  const filterNotifications = useCallback((notificationsList) => {
    if (!notificationsList || !currentUserId) return [];
    
    return notificationsList.filter(notification => 
      notification.recepient === currentUserId.toString() || 
      notification.recepient === 'all'
    );
  }, [currentUserId]);

  // Get filtered notifications based on status
  const getFilteredNotifications = useCallback(() => {
    const userNotifications = filterNotifications(allNotifications);
    
    switch(filter) {
      case 'unread':
        return userNotifications.filter(n => !n.readStatus);
      case 'read':
        return userNotifications.filter(n => n.readStatus);
      default:
        return userNotifications;
    }
  }, [allNotifications, filter, filterNotifications]);

  // Get paginated notifications
  const getPaginatedNotifications = useCallback(() => {
    const filtered = getFilteredNotifications();
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
  }, [page, itemsPerPage, getFilteredNotifications]);

  // Calculate counts
  const userNotifications = useMemo(() => filterNotifications(allNotifications), [allNotifications, filterNotifications]);
  const unreadCount = useMemo(() => userNotifications.filter(n => !n.readStatus).length, [userNotifications]);
  const readCount = useMemo(() => userNotifications.filter(n => n.readStatus).length, [userNotifications]);
  const filteredNotifications = useMemo(() => getFilteredNotifications(), [getFilteredNotifications]);
  const totalPages = useMemo(() => Math.ceil(filteredNotifications.length / itemsPerPage), [filteredNotifications, itemsPerPage]);
  const displayedNotifications = getPaginatedNotifications();

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await request({
        url: `${NotificationAPI}?id=${id}`,
        method: 'PUT',
        withCredentials: true
      });
      
      // Optimistically update UI
      setAllNotifications(prev => prev.map(notification => 
        notification.id === id 
          ? { ...notification, readStatus: true }
          : notification
      ));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = filteredNotifications.filter(n => !n.readStatus);
      await Promise.all(
        unreadNotifications.map(notification => 
          request({
            url: `${NotificationAPI}?id=${notification.id}`,
            method: 'PUT',
            withCredentials: true
          })
        )
      );
      
      // Optimistically update UI
      setAllNotifications(prev => prev.map(notification => 
        unreadNotifications.some(n => n.id === notification.id)
          ? { ...notification, readStatus: true }
          : notification
      ));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Toggle expanded view
  const toggleExpanded = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
    setExpandedId(null);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    setExpandedId(null);
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    
    // Reset to page 1 when changing items per page
    setPage(1);
    setExpandedId(null);
  }, []);

  if (isLoading) {
    return (
      <div className="box-loader">
        <Loader classes={"blur-bg"} />
      </div>
    );
  }

  return (
    <Card className="mt-0 notification-card-container-modern">
      <CardBody className="notification-card-body-modern">
        <div className="notification-modern-container">
          <AccountHeading 
            title={`Notifications (${userNotifications.length})`} 
            classes={"top-sec"} 
          />
          
          {/* Filter Bar */}
          <div className="notification-filter-bar-modern">
            <button
              className={`notification-filter-button-modern ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All ({userNotifications.length})
            </button>
            <button
              className={`notification-filter-button-modern ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => handleFilterChange('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`notification-filter-button-modern ${filter === 'read' ? 'active' : ''}`}
              onClick={() => handleFilterChange('read')}
            >
              Read ({readCount})
            </button>
            
            {unreadCount > 0 && (
              <button
                className="notification-mark-all-read-modern"
                onClick={markAllAsRead}
              >
                <RiCheckDoubleLine /> Mark all as read
              </button>
            )}
            
            {/* Refresh button */}
            <button
              className="notification-refresh-button"
              onClick={fetchNotifications}
              title="Refresh notifications"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Page Size Selector - Moved to top for better visibility */}
          <div className="page-size-selector-top">
            <label htmlFor="pageSize">Items per page: </label>
            <select 
              id="pageSize"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="page-size-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          {/* Notification List Container */}
          <div className="notification-list-container">
            {displayedNotifications.length > 0 ? (
              <ul className="notification-list-modern">
                {displayedNotifications.map((notification) => (
                  <NotificationItem
                    key={`${notification.id}-${page}`}
                    notification={notification}
                    isExpanded={expandedId === notification.id}
                    onToggleExpand={toggleExpanded}
                    onMarkRead={markAsRead}
                  />
                ))}
              </ul>
            ) : (
              <div className="notification-empty-state-modern">
                <div className="notification-empty-icon-modern">
                  <RiNotification2Line />
                </div>
                <h3 className="notification-empty-title-modern">No notifications found</h3>
                <p className="notification-empty-description-modern">
                  {filter === 'all' 
                    ? "You're all caught up! When you get new notifications, they'll appear here."
                    : filter === 'unread'
                    ? "You don't have any unread notifications."
                    : "You haven't marked any notifications as read."}
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination Controls - Only show if we have multiple pages */}
          {filteredNotifications.length > itemsPerPage && (
            <div className="notification-pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <RiArrowLeftSLine /> Previous
              </button>
              
              <div className="pagination-pages">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-page-button ${page === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="pagination-ellipsis">...</span>
                    <button
                      className="pagination-page-button"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <div className="pagination-info">
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length}
              </div>
              
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next <RiArrowRightLine />
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default NotificationData;