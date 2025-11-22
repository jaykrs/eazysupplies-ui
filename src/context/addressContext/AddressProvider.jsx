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

  // Add proper loading state for account data
  const isAccountLoading = !accountData; // Or however you track account loading

  const { data, refetch, fetchStatus, isLoading, error } = useFetchQuery(
    ['userAddress', userId], 
    () => {
      // STRICT validation - prevent API call if userId is missing
      if (!userId || userId === 'undefined' || userId === undefined) {
        console.log('Skipping address fetch - invalid userId:', userId);
        return Promise.resolve({ data: [] });
      }
      
      console.log('Fetching addresses for valid userId:', userId);
      
      return request({ 
        url: `${GetUserAddress}${userId}`, 
        withCredentials: true, 
        method: "GET" 
      });
    },
    {
      // More strict enabling condition
      enabled: !!userId && !!cookies && userId !== 'undefined',
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data;
      },
      // Add retry configuration
      retry: (failureCount, error) => {
        // Don't retry if it's a userId issue
        if (error?.message?.includes('userId') || !userId) {
          return false;
        }
        return failureCount < 2;
      }
    }
  );

  /**
   * Refetch addresses when userId becomes available
   * This is the KEY FIX - handle the case where userId loads after component mount
   */
  useEffect(() => {
    if (userId && cookies && userId !== 'undefined') {
      console.log('UserId available, refetching addresses:', userId);
      refetch();
    }
  }, [userId, cookies, refetch]);

  /**
   * Update local address state when query data changes
   */
  useEffect(() => {
    if (data) {
      setAddressData(data);
    }
  }, [data]);

  // Add debug logging to track the flow
  console.log('AddressProvider Debug:', {
    userId,
    hasCookies: !!cookies,
    isAccountLoading,
    addressData: addressData?.data?.length,
    shouldFetch: !!userId && !!cookies
  });

  return (
    <AddressContext.Provider 
      value={{ 
        ...props, 
        addressData, 
        setAddressData, 
        refetch, 
        mobileSideBar, 
        setMobileSideBar,
        isLoading: isLoading || isAccountLoading, // Combine loading states
        error
      }}
    >
      {props.children}
    </AddressContext.Provider>
  );
};

export default AddressProvider;