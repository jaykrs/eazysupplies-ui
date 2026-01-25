import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import request from "../axiosUtils";
import { BASE_URL, LoginAPI } from "../axiosUtils/API";

const useHandleGSTLogin = (setShowBoxMessage, setState) => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data) => request({ 
      url: BASE_URL + LoginAPI, 
      method: "post", 
      data: {
        gstn: data.gstn, // Using gstn field instead of email
        password: data.password,
        login_type: "gst" // This tells backend to use GST login logic
      }
    }),
    onSuccess: (responseData, requestData) => {
      if (responseData.status === 200 || responseData.data?.success) {
        const finalCallBackUrl = Cookies.get("CallBackUrl") ? Cookies.get("CallBackUrl") : "/account/dashboard";
        setShowBoxMessage(responseData.data?.message || "Login successful!");    
        Cookies.set("uat", responseData.data?.access_token, { path: "/", expires: new Date(Date.now() + 24 * 60 * 6000) });
            const ISSERVER = typeof window === "undefined";
            if (typeof window !== "undefined") {
              Cookies.set("account", JSON.stringify(responseData.data));
              localStorage.setItem("account", JSON.stringify(responseData.data));
            }
        // Close modal after success
        setTimeout(() => {
          window.location.href = finalCallBackUrl; // Refresh to update auth state
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