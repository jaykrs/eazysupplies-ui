import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import request from "../axiosUtils";
import SuccessHandle from "../customFunctions/SuccessHandle";

const extractErrorMessage = (err) => {
  if (!err) return "Something went wrong";

  if (err.response?.data?.message) return err.response.data.message;

  if (err.response?.data?.error) return err.response.data.error;

  return err.message || "Unexpected error occurred";
};

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
    mutationFn: (data) => {
      return request({
        withCredentials: true,
        url: updateId
          ? `${url}/${Array.isArray(updateId) ? updateId.join("/") : updateId}`
          : url,
        data,
        method: "post",
        responseType: responseType || ""
      });
    },

    onSuccess: (resDta) => {
      !notHandler &&
        SuccessHandle(resDta, router, path, message, setCouponError, pathName, setShowBoxMessage);

      extraFunction && extraFunction(resDta);
      refetch && refetch();
    },

    onError: (err) => {
      errFunction && errFunction(err);

      const msg = extractErrorMessage(err);
      setShowBoxMessage(msg);
    }
  });
};

export default useCreate;
