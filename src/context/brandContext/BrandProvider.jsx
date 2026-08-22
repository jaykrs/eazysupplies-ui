import request from "@/utils/axiosUtils";
import { BrandAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import { useEffect, useState } from "react";
import BrandContext from ".";

const BrandProvider = (props) => {
  const [brandState, setBrandState] = useState([]);
  const [brandParams, setBrandParams] = useState("");
  const { data: BrandData, isLoading, refetch } = useFetchQuery([BrandAPI], () => request({ url: BrandAPI }), { enabled: false, refetchOnWindowFocus: false, select: (res) => res?.data?.data });

  useEffect(() => {
    BrandData && setBrandState(BrandData);
  }, [isLoading]);

  const handleSetQueryParams = (value) => {
    setBrandParams(value);
  };

  return (
    <>
      <BrandContext.Provider value={{ isLoading, handleSetQueryParams, refetch, brandParams, brandState, setBrandParams, brandContextLoader: isLoading, ...props }}>{props.children}</BrandContext.Provider>
    </>
  );
};

export default BrandProvider;
