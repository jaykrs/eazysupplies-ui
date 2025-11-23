import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import request from "../axiosUtils";
import SuccessHandle from "../customFunctions/SuccessHandle";

/**
 * Extract readable error messages from backend response
 */
const extractErrorMessage = (err) => {
  if (!err) return "Something went wrong";

  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data?.error) return err.response.data.error;

  return err.message || "Unexpected error occurred";
};

/**
 * useCreate Hook
 *
 * Now supports:
 * - dynamic URL
 * - dynamic HTTP method (POST, PUT, DELETE, PATCH)
 * - compatibility with old usage (updateId still supported)
 *
 * New Standard Usage:
 * mutate({ url: "/address/id", method: "PUT", data: payload })
 *
 * @developer Simran Samir
 */
const useCreate = (
  url,
  updateId,
  path = false,
  message,
  extraFunction,
  notHandler,
  setCouponError,
  refetch,
  setShowBoxMessage,
  responseType,
  errFunction
) => {
  const router = useRouter();
  const pathName = usePathname();

  return useMutation({
    /**
     * Main mutation function
     * Accepts either:
     * - mutate(body)  (old behavior)
     * - mutate({ url, method, data }) (new behavior)
     */
    mutationFn: (payload) => {
      let finalUrl = url;
      let method = "POST";
      let data = payload;

      // NEW DYNAMIC METHOD SUPPORT 
      if (payload?.url || payload?.method || payload?.data) {
        finalUrl = payload.url || url;
        method = payload.method || "POST";
        data = payload.data || {};
      } else {
        // backwards compatibility with old usage
        if (updateId) {
          finalUrl = `${url}/${Array.isArray(updateId) ? updateId.join("/") : updateId}`;
        }
        method = "POST";
      }

      return request({
        withCredentials: true,
        url: finalUrl,
        method: method,
        data: data,
        responseType: responseType || ""
      });
    },

    /**
     * ON SUCCESS
     */
    onSuccess: (resData) => {
      !notHandler &&
        SuccessHandle(
          resData,
          router,
          path,
          message,
          setCouponError,
          pathName,
          setShowBoxMessage
        );

      extraFunction && extraFunction(resData);
      refetch && refetch();
    },

    /**
     * ON ERROR
     */
    onError: (err) => {
      errFunction && errFunction(err);

      const msg = extractErrorMessage(err);
      setShowBoxMessage && setShowBoxMessage(msg);
    }
  });
};

export default useCreate;
