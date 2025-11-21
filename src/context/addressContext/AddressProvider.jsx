/**
 * Address Provider
 * 
 * Provides address management functionality across the application.
 * Handles fetching, caching, and state management for user addresses.
 * 
 * Key Features:
 * - Fetches user addresses when authenticated user is available
 * - Manages address data state and provides refresh capability
 * - Handles mobile sidebar state for address selection UI
 * - Integrates with authentication context for user-specific data
 * 
 * Dependencies:
 * - Requires AccountContext for user authentication data
 * - Uses useFetchQuery for efficient data fetching with React Query
 * - Validates user authentication via cookies before making requests
 * 
 * @component
 * @param {Object} props - React component props
 * @param {ReactNode} props.children - Child components that consume address context
 * 
 * @developer Simran Samir
 */

import request from "@/utils/axiosUtils";
import { GetUserAddress } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import AccountContext from "../accountContext";
import AddressContext from ".";

const AddressProvider = (props) => {
  const cookies = Cookies.get("uat");
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [addressData, setAddressData] = useState();
  const { accountData } = useContext(AccountContext);

  // Get the current user ID from account context
  const userId = accountData?.data?.id;

  /**
   * Fetch user addresses with query optimization
   * Query is only enabled when both userId and authentication cookies are available
   */
  const { data, refetch, fetchStatus } = useFetchQuery(
    ['userAddress', userId], // Cache key includes userId for proper cache invalidation
    () => {
      // Guard clause to prevent API call without userId
      if (!userId) {
        return Promise.resolve({ data: [] });
      }
      
      return request({ 
        url: `${GetUserAddress}${userId}`, 
        withCredentials: true, 
        method: "GET" 
      });
    },
    {
      enabled: !!userId && !!cookies, // Optimize: only fetch when user is authenticated
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data;
      },
    }
  );

  /**
   * Refetch addresses when userId becomes available
   * This handles cases where user authentication happens after component mount
   */
  useEffect(() => {
    if (userId && cookies) {
      refetch();
    }
  }, [userId, cookies, refetch]);

  /**
   * Update local address state when query data changes
   * This provides a synchronized state for context consumers
   */
  useEffect(() => {
    if (data) {
      setAddressData(data);
    }
  }, [data]);

  return (
    <AddressContext.Provider 
      value={{ 
        ...props, 
        addressData, 
        setAddressData, 
        refetch, 
        mobileSideBar, 
        setMobileSideBar 
      }}
    >
      {props.children}
    </AddressContext.Provider>
  );
};

export default AddressProvider;