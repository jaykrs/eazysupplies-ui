import request from "@/utils/axiosUtils";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useEffect, useRef, useState } from "react";
import MenuList from "./MenuList";
import { BASE_URL } from "@/utils/axiosUtils/API";
import Link from "next/link";

const MainHeaderMenu = () => {
  const [isOpen, setIsOpen] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef();

  const closeMenus = () => {
    setIsOpen([]);
    setIsClosing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIsClosing(false), 350);
  };
  const {
    data: headerMenu,
    refetch,
    isLoading,
    fetchStatus,
  } = useFetchQuery(["menu"], () => request({ url: BASE_URL + "/api/template?name=menu" }), {
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
    isLoading && refetch();
  }, [isLoading]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <>
      {isLoading ? (
        <ul className="skeleton-menu navbar-nav">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      ) : (
        <ul className={`navbar-nav ${isClosing ? "menu-closing" : ""}`}>
          <li className="nav-item">
            <Link onClick={closeMenus} className="dropdown-item" href="/collections?layout=collection_3_grid">
              All Products
            </Link>
          </li>
          {headerMenu?.map((menu, i) => (
            <MenuList menu={menu} key={i} customClass={`${!menu?.path ? "dropdown" : ""} nav-item `} level={0} isOpen={isOpen} setIsOpen={setIsOpen} closeMenus={closeMenus} />
          ))}
        </ul>
      )}
    </>
  );
};

export default MainHeaderMenu;
