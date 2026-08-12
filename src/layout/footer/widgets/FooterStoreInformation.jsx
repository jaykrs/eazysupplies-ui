import ThemeOptionContext from "@/context/themeOptionsContext";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { RiMailLine, RiMapPinLine, RiPhoneLine } from "react-icons/ri";

const FooterStoreInformation = ({ icon }) => {
  const { t } = useTranslation("common");
  const { themeOption } = useContext(ThemeOptionContext);

  return (
    <ul className={icon ? "contact-list" : "contact-details"}>
      {themeOption?.footer?.about_address && (
        <li>
          {icon && <RiMapPinLine />}
          {themeOption?.footer?.about_address}
        </li>
      )}
      {themeOption?.footer?.support_number && (
        <li>
          {icon && <RiPhoneLine />}
          {t("CallUs")}: {themeOption?.footer?.support_number}
        </li>
      )}
      <li>
        {icon && <RiMailLine />}
        {t("EmailUs")}: <a href="mailto:info@eazysupplies.com">info@eazysupplies.com</a>
      </li>
    </ul>
  );
};

export default FooterStoreInformation;
