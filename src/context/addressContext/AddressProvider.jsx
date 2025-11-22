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
import { useContext, useEffect, useState, useCallback } from "react";
import AccountContext from "../accountContext";
import AddressContext from ".";

const AddressProvider = (props) => {
  const cookies = Cookies.get("uat");
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [addressData, setAddressData] = useState({ data: [] });
  const { accountData } = useContext(AccountContext);

  // Get the current user ID from account context with strict validation
  const userId = accountData?.data?.id;

  // Strict validation to prevent undefined userId
  const isValidUserId = userId && userId !== 'undefined' && typeof userId !== 'undefined' && userId !== null;

  console.log('AddressProvider Debug:', {
    userId,
    isValidUserId,
    hasAccountData: !!accountData,
    hasCookies: !!cookies,
    accountData: accountData // Log full account data for debugging
  });

  /**
   * Fetch user addresses with query optimization
   * Query is only enabled when both userId and authentication cookies are available
   */
  const { data, refetch, fetchStatus, isLoading, error } = useFetchQuery(
    ['userAddress', userId], 
    () => {
      // STRICT Guard clause to prevent API call without valid userId
      if (!isValidUserId) {
        console.warn('Preventing API call - invalid userId:', userId);
        return Promise.resolve({ data: [] });
      }
      
      console.log('Fetching addresses for valid userId:', userId);
      
      return request({ 
        url: `${GetUserAddress}${userId}`, 
        withCredentials: true, 
        method: "GET" 
      }).then(response => {
        console.log('Address API response:', response);
        return response;
      }).catch(error => {
        console.error('Address API error:', error);
        throw error;
      });
    },
    {
      enabled: isValidUserId && !!cookies, // STRICT enabling condition
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data;
      },
      retry: false, // Prevent retries on errors
      onError: (error) => {
        console.error('Error fetching addresses:', error);
      }
    }
  );

  /**
   * Safe refetch function that includes validation
   */
  const safeRefetch = useCallback(() => {
    if (!isValidUserId) {
      console.warn('Cannot refetch - invalid userId:', userId);
      return Promise.resolve({ data: [] });
    }
    console.log('Safe refetch for userId:', userId);
    return refetch();
  }, [refetch, isValidUserId, userId]);

  /**
   * Refetch addresses when userId becomes available
   * This handles cases where user authentication happens after component mount
   */
  useEffect(() => {
    if (isValidUserId && cookies) {
      console.log('UserId available, refetching addresses:', userId);
      safeRefetch();
    }
  }, [userId, cookies, safeRefetch, isValidUserId]);

  /**
   * Update local address state when query data changes
   * This provides a synchronized state for context consumers
   * ADD SECURITY FILTER: Only show addresses for current user
   */
  useEffect(() => {
    if (data) {
      console.log('Raw address data from API:', data);
      
      // SECURITY FIX: Filter addresses to only show current user's addresses
      // This protects against backend returning all addresses
      let filteredData = data;
      
      if (data.data && Array.isArray(data.data)) {
        const userAddresses = data.data.filter(address => 
          address.userId && address.userId.toString() === userId?.toString()
        );
        
        console.log('Filtered addresses for current user:', {
          allAddresses: data.data.length,
          userAddresses: userAddresses.length,
          userId
        });
        
        filteredData = {
          ...data,
          data: userAddresses
        };
      }
      
      setAddressData(filteredData);
    } else {
      // Reset if no data
      setAddressData({ data: [] });
    }
  }, [data, userId]);

  /**
   * Reset address data when user logs out
   */
  useEffect(() => {
    if (!cookies || !isValidUserId) {
      console.log('Resetting address data - user logged out or invalid');
      setAddressData({ data: [] });
    }
  }, [cookies, isValidUserId]);

  return (
    <AddressContext.Provider 
      value={{ 
        ...props, 
        addressData, 
        setAddressData, 
        refetch: safeRefetch, // Use safe refetch
        mobileSideBar, 
        setMobileSideBar,
        isLoading,
        error,
        isValidUserId, // Export for components to check
        currentUserId: userId // Export current user ID
      }}
    >
      {props.children}
    </AddressContext.Provider>
  );
};

export default AddressProvider;