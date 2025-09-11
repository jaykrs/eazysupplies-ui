import ThemeOptionContext from "@/context/themeOptionsContext";
import React, { useContext } from "react";

const FooterAbout = () => {
  const { themeOption } = useContext(ThemeOptionContext);

  return <p>{"Discover the latest trends and enjoy seamless shopping with our exclusive collections. from static text"}</p>;
};

export default FooterAbout;
