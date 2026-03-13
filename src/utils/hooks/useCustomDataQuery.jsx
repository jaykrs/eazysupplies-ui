import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import request from "../axiosUtils";
import { BASE_URL, GetHomePageData, HomePageAPI } from "../axiosUtils/API";

const useCustomDataQuery = ({ params }) => {
  return useFetchQuery(
    ["data", params],
    async () => {
      const response = await request({ url: `${BASE_URL}${GetHomePageData}` });
      return response?.data?.jsonData?.data?.content;
    },
    {
      select: (data) => data,
      refetchOnWindowFocus: false,
      enabled:false
    }
  );
};

export default useCustomDataQuery;
