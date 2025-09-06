import request from "@/utils/axiosUtils";
import { AddToCartAPI, ClearCart, ReplaceCartAPI } from "@/utils/axiosUtils/API";
import getCookie from "@/utils/customFunctions/GetCookie";
import { ToastNotification } from "@/utils/customFunctions/ToastNotification";
import useCreate from "@/utils/hooks/useCreate";
import useDelete from "@/utils/hooks/useDelete";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import CartContext from ".";

const CartProvider = (props) => {
  const isCookie = Cookies.get("uat");
  const [cartProducts, setCartProducts] = useState([]);
  const [variationModal, setVariationModal] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [cartToggle, setCartToggle] = useState(false);
  const [getCardData, setGetCardData] = useState([]);

  // Getting data from Cart API
  const { data: CartAPIData, isLoading: getCartLoading, refetch } = useFetchQuery([AddToCartAPI], () => request({ url: AddToCartAPI }), { enabled: false, refetchOnWindowFocus: false, select: (res) => res?.data });

  // Adding data to Cart API
  const {
    data: addData,
    mutate,
    isLoading,
  } = useCreate(AddToCartAPI, false, false, "No", (resDta) => {
    if (resDta?.status == 200 || resDta?.status == 201) {
      setGetCardData(resDta?.data?.items[0]);
      setCartProducts((prevCart) =>
        prevCart?.map((elem) => {
          if (!elem?.variation_id && !resDta?.data?.items[0]?.variation_id && elem?.product_id == resDta?.data?.items[0]?.product_id) {
            return resDta?.data?.items[0];
          } else return elem;
        })
      );
    }
  });
  // Delete Cart API Data
  const { mutate: deleteCart, isLoading: deleteCartLoader } = useDelete(AddToCartAPI, false);

  // Replace Cart API
  const { mutate: replaceCartMutate, isLoading: replaceCartLoader } = useCreate(ReplaceCartAPI, false, false, "No");

  //Clear Cart API
  const { mutate: ClearCartData, isLoading: clearCartLoader } = useMutation({
    mutationFn: () => request({ url: ClearCart, method: "delete" }),
    onSuccess: (responseData) => {
      if (responseData.status === 200 || responseData.status === 201) {
        ToastNotification("success", responseData.data.message);
      }
    },
  });

  // Refetching Cart API
  useEffect(() => {
    if (isCookie) {
      refetch();
    }
  }, [isCookie]);

  // Setting CartAPI data to state and LocalStorage
  useEffect(() => {
    if (isCookie) {
      if (CartAPIData) {
        setCartProducts(CartAPIData?.items);
        setCartTotal(CartAPIData?.total);
      }
    } else {
      const isCartAvailable = JSON.parse(localStorage.getItem("cart"));
      if (isCartAvailable?.items?.length > 0) {
        setCartProducts(isCartAvailable?.items);
        setCartTotal(isCartAvailable?.total);
      }
    }
  }, [getCartLoading]);

  // Adding data in localstorage when not Login
  useEffect(() => {
    storeInLocalStorage();
  }, [cartProducts]);

  // Getting total
  const total = useMemo(() => {
    return cartProducts?.reduce((prev, curr) => {
      return prev + Number(curr.sub_total);
    }, 0);
  }, [getCartLoading, cartProducts, deleteCartLoader]);

  // Total Function for child components
  const getTotal = (value) => {
    return value?.reduce((prev, curr) => {
      return prev + Number(curr.sub_total);
    }, 0);
  };

  const clearCart = () => {
    setCartProducts([]);
    if (isCookie) {
      ClearCartData();
    }
  };

  // Remove and Delete cart data from API and State
  const removeCart = (id, cartId) => {
    const updatedCart = cartProducts?.filter((item) => (item?.variation_id ? item?.variation_id !== id : item.product_id !== id));
    setCartProducts(updatedCart);
  };

  const fetchReplaceCartData = async (obj) => {
    try {
      const res = await fetch(`${process.env.API_PROD_URL}/replace/cart`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("uat")}`,
        },

        body: JSON.stringify(obj),
      });
      let result = await res.json();
      return result?.items;
    } catch (err) {}
  };
  const handleIncDec = async (qty, productObj, isProductQty, setIsProductQty, isOpenFun, cloneVariation) => {
    const updatedQty = (isProductQty ? isProductQty : 0) + qty;
    const cart = [...cartProducts];
    const index = cart.findIndex((item) => item.product_id === productObj?.id);
    let newProduct;
    const obj = {
      id: null,
      product_id: productObj?.id,
      variation_id: cloneVariation?.selectedVariation?.id ? cloneVariation?.selectedVariation?.id : cart[index]?.variation_id ? cart[index]?.variation_id : null,
      quantity: qty,
    };
    if (isCookie && !isLoading) {
      if (index !== -1) {
        obj._method = "PUT";
      }
    }
    const cartUid = newProduct?.find((elem) => (elem?.variation_id ? elem?.variation_id == cloneVariation?.variation_id : elem?.product_id == productObj?.id));
    let tempProductId = productObj?.id;
    let tempVariantProductId = cloneVariation?.selectedVariation?.product_id;

    // Checking conditions for Replace Cart
    if (cart[index]?.variation && cloneVariation?.variation_id && tempProductId == tempVariantProductId && cloneVariation?.variation_id !== cart[index]?.variation_id) {
      return replaceCart(updatedQty, productObj, cloneVariation);
    }

    if (index === -1) {
      const params = {
        id: cartUid?.id ? cartUid?.id : null,
        product: productObj,
        product_id: productObj?.id,
        variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
        variation_id: cloneVariation?.selectedVariation?.id ? cloneVariation?.selectedVariation?.id : null,
        quantity: cloneVariation?.selectedVariation?.productQty ? cloneVariation?.selectedVariation?.productQty : updatedQty,
        sub_total: cloneVariation?.selectedVariation?.sale_price ? updatedQty * cloneVariation?.selectedVariation?.sale_price : updatedQty * productObj?.sale_price,
      };
      isCookie ? !isLoading && setCartProducts((prev) => [...prev, params]) : setCartProducts((prev) => [...prev, params]);
    } else {
      // Checking the Stock QTY of particular product
      const productStockQty = cart[index]?.variation?.quantity ? cart[index]?.variation?.quantity : cart[index]?.product?.quantity;
      if (productStockQty < cart[index]?.quantity + qty) {
        ToastNotification("error", `You can not add more items than available. In stock ${productStockQty} items.`);
        return false;
      }

      if (cart[index]?.variation) {
        cart[index].variation.selected_variation = cart[index]?.variation?.attribute_values?.map((values) => values.value).join("/");
      }
      const newQuantity = cart[index].quantity + qty;
      if (newQuantity < 1) {
        // Remove the item from the cart if the new quantity is less than 1
        return removeCart(cloneVariation?.variation_id ? cloneVariation?.variation_id : productObj?.id, cartUid ? cartUid : cart[index].id);
      } else {
        cart[index] = {
          ...cart[index],
          id: cartUid?.id ? cartUid?.id : cart[index].id ? cart[index].id : null,
          quantity: newQuantity,
          sub_total: newQuantity * (cart[index]?.variation ? cart[index]?.variation?.sale_price : cart[index]?.product?.sale_price),
        };
        isCookie ? !isLoading && setCartProducts([...cart]) : setCartProducts([...cart]);
      }
    }

    // Update the productQty state immediately after updating the cartProducts state
    if (isCookie) {
      setIsProductQty && !isLoading && setIsProductQty(updatedQty);
      isOpenFun && !isLoading && isOpenFun(true);
    } else {
      setIsProductQty && setIsProductQty(updatedQty);
      isOpenFun && isOpenFun(true);
    }
  };

  //Toggle open
  const cartToggleValue = (value) => {
    setCartToggle(value);
  };

  // Replace Cart
  const replaceCart = async (updatedQty, productObj, cloneVariation, selectedVariation) => {
    const cart = [...cartProducts];
    const isAvailableInCart = cart.find((cartProduct) => cartProduct?.variation_id == cloneVariation.variation_id);

    if (isAvailableInCart) {
      ToastNotification("error", "You already have this item in your cart.");
      return false;
    }
    const index = cart.findIndex((item) => item.product_id === productObj?.id && item.variation_id == selectedVariation.variation_id);
    cart[index].quantity = 0;

    const productQty = cart[index]?.variation ? cart[index]?.variation?.quantity : cart[index]?.product?.quantity;

    if (cart[index]?.variation) {
      cart[index].variation.selected_variation = cart[index]?.variation?.attribute_values?.map((values) => values.value).join("/");
    }

    // Checking the Stock QTY of particular product
    if (productQty < cart[index]?.quantity + updatedQty) {
      ToastNotification("error", `You can not add more items than available. In stock ${productQty} items.`);
      return false;
    }
    let newProduct;
    if (isCookie && !replaceCartLoader) {
      newProduct = await fetchReplaceCartData({
        _method: "PUT",
        id: cart[index]?.id,
        product: productObj,
        product_id: productObj?.id,
        variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
        quantity: cloneVariation?.productQty ? cloneVariation?.productQty : updatedQty,
        variation_id: cloneVariation?.selectedVariation?.id ? cloneVariation?.selectedVariation?.id : null,
        quantity: cloneVariation?.productQty ? cloneVariation?.productQty : updatedQty,
      });
    }
    const cartUid = newProduct?.find((elem) => (elem?.variation_id ? elem?.variation_id == cloneVariation?.variation_id : elem?.product_id == productObj?.product?.id));

    const params = {
      id: cartUid?.id ? cartUid?.id : cart[index].id ? cart[index].id : null,
      product: productObj,
      product_id: productObj?.id,
      variation: cloneVariation?.selectedVariation ? cloneVariation?.selectedVariation : null,
      variation_id: cloneVariation?.selectedVariation?.id ? cloneVariation?.selectedVariation?.id : null,
      quantity: cloneVariation?.productQty ? cloneVariation?.productQty : updatedQty,
      sub_total: cloneVariation?.selectedVariation?.sale_price ? updatedQty * cloneVariation?.selectedVariation?.sale_price : updatedQty * productObj?.sale_price,
    };

    isCookie
      ? !isLoading &&
    setCartProducts((prevCartProducts) =>
          prevCartProducts.map((elem) => {
            if (elem?.product_id === cloneVariation?.selectedVariation?.product_id) {
              return params;
            } else {
              return elem;
            }
          })
        )
      : setCartProducts((prevCartProducts) =>
          prevCartProducts.map((elem) => {
            if (elem?.product_id === cloneVariation?.selectedVariation?.product_id) {
              return params;
            } else {
              return elem;
            }
          })
        );
  };

  // Setting data to localstorage when UAT is not there
  const storeInLocalStorage = () => {
    setCartTotal(total);
    localStorage.setItem("cart", JSON.stringify({ items: cartProducts, total: total }));
  };

  return (
    <CartContext.Provider
      value={{
        ...props,
        cartProducts,
        setCartProducts,
        cartTotal,
        getCardData,
        setCartTotal,
        removeCart,
        clearCart,
        getTotal,
        handleIncDec,
        cartToggle,
        cartToggleValue,
        variationModal,
        refetch,
        setVariationModal,
        isLoading,
        getCartLoading,
        replaceCartLoader,
        replaceCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
