import request from "@/utils/axiosUtils";
import { SelfAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import AccountContext from ".";

/**
 * Account Provider
 *
 * Loads the logged-in user's account details.
 * Uses React Query for controlled fetching.
 * Runs only when the auth cookie is available.
 *
 * Exposes:
 * - accountData (user profile)
 * - refetch (manual refresh)
 * - mobileSideBar state
 *
 * @developer Simran Samir
 */
const AccountProvider = (props) => {
  const cookies = Cookies.get("uat");          // Auth token
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [accountData, setAccountData] = useState();

  // Fetch logged-in user details (disabled by default)
  const { data, refetch, fetchStatus } = useFetchQuery(
    [SelfAPI],
    () =>
      request({
        url: SelfAPI,
        withCredentials: true,
        method: "GET",
      }),
    {
      enabled: false,
      select: (res) => res?.data,
    }
  );

  // Fetch user info when cookie exists
  useEffect(() => {
    if (cookies) refetch();
  }, [cookies, refetch]);

  // Save fetched account data
  useEffect(() => {
    if (data) {
      setAccountData(data);
    }
  }, [data]); // Fixed dependency

  return (
    <AccountContext.Provider
      value={{
        ...props,
        accountData,
        setAccountData,
        refetch,
        mobileSideBar,
        setMobileSideBar,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;

