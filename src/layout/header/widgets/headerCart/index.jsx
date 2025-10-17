import CartContext from "@/context/cartContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import React, { useContext } from "react";
import { RiShoppingCartLine } from "react-icons/ri";
import HeaderCartData from "./HeaderCartData";
import Link from "next/link";

const HeaderCart = () => {
  const { setCartCanvas } = useContext(ThemeOptionContext);
  const { cartProducts } = useContext(CartContext);
  return (
    <>
      <Link  href={`/cart`}>
        <RiShoppingCartLine onClick={() => {}} />
      </Link>
      {cartProducts?.length > 0 && <span className="cart_qty_cls ">{cartProducts?.length}</span>}
      <HeaderCartData />
    </>
  );
};

export default HeaderCart;
