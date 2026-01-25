{/*import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import request from "../axiosUtils";
import { LoginPhnAPI } from "../axiosUtils/API";

const useHandlePhnLogin = (setShowBoxMessage, setState) => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data) => request({ url: LoginPhnAPI, method: "post", data }),
    onSuccess: (responseData, requestData) => {
      if (responseData.status === 200) {
        Cookies.set("uc", requestData.country_code);
        Cookies.set("up", requestData.phone);
        setState("otp");
      } else {
        setShowBoxMessage(responseData.response.data.message);
      }
    },
  });
};

export default useHandlePhnLogin;*/}

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
      console.log("DEBUG useHandlePhnLogin: mutationFn called with data:", data);
      
      // Format: country_code + phone
      let phoneNumber = data.phone.replace(/\D/g, '');
      
      // Remove leading 0 if present
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      const fullPhone = data.country_code + phoneNumber;
      console.log("DEBUG: Sending OTP to:", fullPhone);
      
      try {
        // Use absolute URL with your backend port (3000)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.eazysupplies.com';
        const url = `${API_URL}/api/auth/login?action=generateotp&phone=${fullPhone}`;
        
        console.log("DEBUG: Calling URL:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });
        
        console.log("DEBUG: Response status:", response.status);
        console.log("DEBUG: Response headers:", {
          'content-type': response.headers.get('content-type'),
          'location': response.headers.get('location')
        });
        
        // First, read as text to see what we're getting
        const responseText = await response.text();
        console.log("DEBUG: Response first 200 chars:", responseText.substring(0, 200));
        
        // Check if it's HTML
        if (responseText.trim().startsWith('<!DOCTYPE') || 
            responseText.trim().startsWith('<html') ||
            responseText.includes('</html>')) {
          console.error("DEBUG: Got HTML instead of JSON!");
          console.error("DEBUG: Full response:", responseText);
          
          throw new Error(`Server returned HTML instead of JSON. Check if API endpoint exists at: ${url}`);
        }
        
        // Try to parse as JSON
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("DEBUG: Failed to parse JSON:", parseError);
          console.error("DEBUG: Response was:", responseText);
          throw new Error("Invalid JSON response from server");
        }
        
        console.log("DEBUG: Parsed JSON response:", responseData);
        
        return {
          status: response.status,
          data: responseData,
          ok: response.ok,
        };
      } catch (error) {
        console.error("DEBUG: API Call Failed:", error);
        throw error;
      }
    },
    // ... rest of the code remains the same
    onSuccess: (responseData, variables) => {
      console.log("DEBUG: onSuccess called with:", {
        responseData,
        variables,
        hasSetState: !!setState,
        hasSetShowBoxMessage: !!setShowBoxMessage
      });
      
      if (responseData.ok && responseData.data.success) {
        // Format phone properly
        let phoneNumber = variables.phone.replace(/\D/g, '');
        if (phoneNumber.startsWith('0')) {
          phoneNumber = phoneNumber.substring(1);
        }
        const fullPhone = variables.country_code + phoneNumber;
        
        // Save to cookies
        Cookies.set("uc", variables.country_code, { 
          path: "/", 
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        Cookies.set("up", fullPhone, { 
          path: "/", 
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        
        console.log("DEBUG: Cookies set, calling setState('otp')");
        
        // Switch to OTP screen
        if (setState) {
          console.log("DEBUG: setState function exists, calling it...");
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
        console.error("DEBUG: Response not successful:", responseData);
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
