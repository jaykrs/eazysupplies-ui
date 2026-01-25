/**
 * useHandlePhnLogin Custom Hook
 * 
 * Handles phone login OTP generation flow using React Query mutation.
 * Manages phone number formatting, API communication, cookie storage, and UI state updates.
 * Includes comprehensive debugging for API response validation and error handling.
 * 
 * Key Responsibilities:
 * - Formats phone numbers (removes non-digits, leading zeros)
 * - Calls OTP generation endpoint with proper headers
 * - Validates JSON response (detects HTML errors)
 * - Stores country code and phone in cookies
 * - Updates UI state between phone/OTP screens
 * - Shows success/error messages via callback functions
 * 
 * @param {Function} setShowBoxMessage - Callback for displaying UI messages
 * @param {Function} setState - Callback for updating auth flow state (phone → otp)
 * @returns {Object} React Query mutation object for phone login
 * 
 * @developer Simran Samir
 * @version 1.0
 */

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

const useHandlePhnLogin = (setShowBoxMessage, setState) => {
  return useMutation({
    mutationFn: async (data) => {
       // Format: country_code + phone
      let phoneNumber = data.phone.replace(/\D/g, '');
      // Remove leading 0 if present
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      const fullPhone =  phoneNumber;
      
      try {
        // Use absolute URL with your backend port (3000)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.eazysupplies.com';
        const url = `${API_URL}/api/auth/login?action=generateotp&phone=${fullPhone}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        // First, read as text to see what we're getting
        const responseText = await response.text();
        
        // Check if it's HTML
        if (responseText.trim().startsWith('<!DOCTYPE') || 
            responseText.trim().startsWith('<html') ||
            responseText.includes('</html>')) {
          throw new Error(`Server returned HTML instead of JSON. Check if API endpoint exists at: ${url}`);
        }
        
        // Try to parse as JSON
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error("Invalid JSON response from server");
        }
   
        return {
          status: response.status,
          data: responseData,
          ok: response.ok,
        };
      } catch (error) {
        throw error;
      }
    },
    // ... rest of the code remains the same
    onSuccess: (responseData, variables) => {
  
      if (responseData.ok && responseData.data) {
        // Format phone properly
        let phoneNumber = variables.phone.replace(/\D/g, '');
        if (phoneNumber.startsWith('0')) {
          phoneNumber = phoneNumber.substring(1);
        }
        const fullPhone = phoneNumber;
        
        // Save to cookies
        Cookies.set("uc", variables.country_code, { 
          path: "/", 
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        Cookies.set("up", fullPhone, { 
          path: "/", 
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        // Switch to OTP screen
        if (setState) {
          setState("otp");
        } else {
          console.error("DEBUG: setState is undefined!");
        }
        
        // Show debug OTP in alert for testing
        {/*if (responseData.data.debug_otp) {
          alert(`DEBUG: OTP is ${responseData.data.debug_otp}`);
        }*/}
        
        // Show success message
        if (setShowBoxMessage) {
          setShowBoxMessage({
            type: 'success',
            message: 'OTP sent successfully!'
          });
        }
        
      } else {
        const errorMsg = responseData.data?.error || responseData.data?.message || "Failed to send OTP";
        if (setShowBoxMessage) {
          setShowBoxMessage({
            type: 'error',
            message: errorMsg
          });
        }
      }
    },
    onError: (error) => {
      console.error("DEBUG: onError called:", error);
      if (setShowBoxMessage) {
        setShowBoxMessage({
          type: 'error',
          message: error.message || "Failed to send OTP. Please try again."
        });
      }
    }
  });
};

export default useHandlePhnLogin;
