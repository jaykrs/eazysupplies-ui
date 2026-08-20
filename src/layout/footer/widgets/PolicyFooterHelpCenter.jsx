import NoDataFound from "@/components/widgets/NoDataFound";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Link from "next/link";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

const PolicyFooterHelpCenter = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { t } = useTranslation("common");

  return (
    <div className="footer-content">
      {themeOption?.footer?.policy_help_center?.length ? (
        <ul>
          {themeOption?.footer?.policy_help_center?.map((item, i) => (
            <li key={i}>
              <Link href={resolvePolicyRoute(item)} className="text-content">
                {t(item?.name)}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <NoDataFound customClass={"no-data-footer"} title={"No Link Found"} />
      )}
    </div>
  );
};

export default PolicyFooterHelpCenter;
  const policyRoutes = {
    "website policy": "/pages?name=website-policy",
    "return policy": "/pages?name=return-policy",
    "replacement policy": "/pages?name=replacement-policy",
    "refund policy": "/pages?name=refund-policy",
    "shipping policy": "/pages?name=shipping-policy",
    "career": "/pages?name=career",
  };

  const resolvePolicyRoute = (item) => {
    const translatedName = String(t(item?.name) || item?.name || "").trim();
    const mapped = policyRoutes[translatedName.toLowerCase()];
    if (mapped) return mapped;
    const value = String(item?.value || "").trim();
    return value.startsWith("/") ? value : `/${value}`;
  };
