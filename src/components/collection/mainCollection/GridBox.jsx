import ThemeOptionContext from "@/context/themeOptionsContext";
import { ImagePath } from "@/utils/constants";
import Image from "next/image";
import { useContext } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const GridBox = ({ grid, setGrid }) => {
  const { setVariant, themeOption } = useContext(ThemeOptionContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectGrid = (value) => {
    setGrid(value);
    window.localStorage.setItem("eazyCollectionView", String(value));
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("view", String(value));
    nextParams.delete("page");
    if (value === "list") setVariant("product_box_eleven");
    else setVariant(themeOption?.product?.product_box_variant || "product_box_one");
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const onGridKeyDown = (event, value) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectGrid(value);
    }
  };

  return (
    <div className="collection-grid-view">
      <ul>
        <li className={`${grid == 2 ? "active" : ""}`} onClick={() => selectGrid(2)} onKeyDown={(event) => onGridKeyDown(event, 2)} aria-label="Two products per row" role="button" tabIndex={0}>
          <Image src={`${ImagePath}/icon/2.png`} alt="grid image" height={16} width={11} className="product-2-layout-view" />
        </li>
        <li className={`${grid == 3 ? "active" : ""}`} onClick={() => selectGrid(3)} onKeyDown={(event) => onGridKeyDown(event, 3)} aria-label="Three products per row" role="button" tabIndex={0}>
          <Image src={`${ImagePath}/icon/3.png`} alt="grid image" height={16} width={18} className="product-3-layout-view" />
        </li>
        <li className={` ${grid == 4 ? "active" : ""}`} onClick={() => selectGrid(4)} onKeyDown={(event) => onGridKeyDown(event, 4)} aria-label="Four products per row" role="button" tabIndex={0}>
          <Image src={`${ImagePath}/icon/4.png`} className="product-4-layout-view" alt="grid image" height={16} width={25} />
        </li>
        <li className={` ${grid == "list" ? "active" : ""}`} onClick={() => selectGrid("list")} onKeyDown={(event) => onGridKeyDown(event, "list")} aria-label="List view" role="button" tabIndex={0}>
          <Image src={`${ImagePath}/icon/list.png`} className="product-6-layout-view" alt="grid image" height={12} width={18} />
        </li>
      </ul>
    </div>
  );
};

export default GridBox;
