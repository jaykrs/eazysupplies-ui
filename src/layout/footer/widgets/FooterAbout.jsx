import ThemeOptionContext from "@/context/themeOptionsContext";
import React, { useContext } from "react";

const FooterAbout = () => {
  const { themeOption } = useContext(ThemeOptionContext);

  return <p>{"Earthling offers a wide selection of canned fruits, vegetables, sauces, mayonnaise, spreads, and dressings — carefully prepared to bring rich flavour, better ingredients, and more enjoyment to everyday meals."}</p>;
};

export default FooterAbout;
