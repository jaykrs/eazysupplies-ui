import ThemeOptionContext from "@/context/themeOptionsContext";
import Link from "next/link";
import React, { useContext } from "react";
import { RiFacebookFill, RiInstagramFill, RiYoutubeFill , RiPinterestFill, RiTwitterFill, RiLinkedinFill  } from "react-icons/ri";

const FooterSocial = () => {
  const { themeOption } = useContext(ThemeOptionContext)
  return (
    <>
      <div className="footer-social">
        <ul>
          {themeOption?.footer?.facebook && (
            <li>
              <Link href={themeOption?.footer?.facebook} target="_blank">
                <RiFacebookFill />
              </Link>
            </li>
          )}
          {themeOption?.footer?.linkedin && (
            <li>
              <Link href={themeOption?.footer?.linkedin} target="_blank">
                <RiLinkedinFill  />
              </Link>
            </li>
          )}
          {themeOption?.footer?.instagram && (
            <li>
              <Link href={themeOption?.footer?.instagram} target="_blank">
                <RiInstagramFill />
              </Link>
            </li>
          )}
          {themeOption?.footer?.youtube && (
            <li>
              <Link href={themeOption?.footer?.youtube} target="_blank">
                <RiYoutubeFill />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default FooterSocial;
