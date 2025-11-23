import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import request from "../axiosUtils";
import { LoginAPI } from "../axiosUtils/API";

const useHandleGSTLogin = (setShowBoxMessage, setState) => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data) => request({ 
      url: LoginAPI, 
      method: "post", 
      data: {
        gstn: data.gstn, // Using gstn field instead of email
        password: data.password,
        login_type: "gst" // This tells backend to use GST login logic
      }
    }),
    onSuccess: (responseData, requestData) => {
      if (responseData.status === 200 || responseData.data?.success) {
        setShowBoxMessage(responseData.data?.message || "Login successful!");
        
        // Store authentication data
        if (responseData.data.token) {
          Cookies.set("auth_token", responseData.data.token);
        }
        if (responseData.data.user) {
          Cookies.set("user_data", JSON.stringify(responseData.data.user));
        }
        
        // Close modal after success
        setTimeout(() => {
          window.location.reload(); // Refresh to update auth state
        }, 1000);
        
      } else {
        setShowBoxMessage(responseData.response?.data?.message || "Login failed");
      }
    },
    onError: (error) => {
      setShowBoxMessage(error.response?.data?.message || "Something went wrong");
    },
  });
};

export default useHandleGSTLogin;