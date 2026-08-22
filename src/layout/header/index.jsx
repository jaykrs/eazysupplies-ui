import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import request from "@/utils/axiosUtils";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import React, { useContext, useEffect } from "react";
import HeaderEight from "./headerEight";
import HeaderFive from "./headerFive";
import HeaderFour from "./headerFour";
import HeaderOne from "./headerOne";
import HeaderSeven from "./headerSeven";
import HeaderSix from "./headerSix";
import HeaderThree from "./headerThree";
import HeaderTwo from "./headerTwo";
import { BASE_URL } from "@/utils/axiosUtils/API";

const Headers = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { setMenuLoader } = useContext(SettingContext);
  const style = "header_one";

  const headerOptions = {
    header_one: <HeaderOne />,
    // header_two: <HeaderTwo />,
    // header_three: <HeaderThree />,
    // header_four: <HeaderFour />,
    // header_five: <HeaderFive />,
    // header_six: <HeaderSix />,
    // header_seven: <HeaderSeven />,
    // header_eight: <HeaderEight />,
  };

  const {
    data: headerMenu,
    refetch,
    isLoading,
  } = useFetchQuery(["menu"], () => request({ url: BASE_URL+"/api/template?name=menu" }), {
    select: (res) => {
      const originalData = res.data.jsonData.data;
      const modifiedData = originalData.map((item) => ({
        ...item,
        class: `${["Product", "Mega Menu"].includes(item.title) ? 1 : 0}`,
      }));

      return modifiedData;
    },
    refetchOnWindowFocus: true,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  return headerOptions[style];
};

export default Headers;
