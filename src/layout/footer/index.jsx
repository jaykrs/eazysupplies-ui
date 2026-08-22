"use client";
import ThemeOptionContext from "@/context/themeOptionsContext";
import React, { useContext } from "react";
import FooterFour from "./footerFour";
import FooterOne from "./footerOne";
import FooterThree from "./footerThree";
import FooterTwo from "./footerTwo";

const Footers = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const style = "footer_one";

  return (
    <>
      <>
        {style == "footer_one" && <FooterOne />}
        {/* {style == "footer_two" && <FooterTwo />}
        {style == "footer_three" && <FooterThree />}
        {style == "footer_four" && <FooterFour />} */}
      </>
    </>
  );
};

export default Footers;
