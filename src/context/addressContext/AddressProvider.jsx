import request from "@/utils/axiosUtils";
import { GetUserAddress } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import AccountContext from "../accountContext";
import AddressContext from ".";

const AddressProvider = (props) => {
  const cookies = Cookies.get("uat");
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [addressData, setAddressData] = useState();
  const {accountData} = useContext(AccountContext);

  const { data, refetch, fetchStatus } = useFetchQuery([GetUserAddress+accountData?.data?.id], () => request({ url: GetUserAddress+accountData?.data?.id, withCredentials: true, method: "GET" }), {
    enabled: false,
    select: (res) => {
      return res?.data;
    },
  });

  useEffect(() => {
    console.log(accountData, "hhhh")
    cookies && refetch() ;
  }, [cookies]);

  useEffect(() => {
    if (data) {
      setAddressData(data);
    }
  }, [fetchStatus == "fetching", data]);

  return <AddressContext.Provider value={{ ...props, addressData, setAddressData, refetch, mobileSideBar, setMobileSideBar }}>{props.children}</AddressContext.Provider>;
};

export default AddressProvider;
