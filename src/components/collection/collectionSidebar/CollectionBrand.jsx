import NoDataFound from "@/components/widgets/NoDataFound";
import BrandContext from "@/context/brandContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccordionBody, Input, Label } from "reactstrap";

const CollectionBrand = ({ filter, setFilter }) => {
  const { brandState = [],isLoading,refetch } = useContext(BrandContext);
  const [showList, setShowList] = useState([]);
  const { t } = useTranslation("common");
  
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    !isLoading && setShowList(brandState);
  }, [brandState,isLoading]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasValue = (item, term) => {
    let valueToReturn = false;
    if (item && item["name"] && item["name"].toLowerCase().includes(term?.toLowerCase())) {
      valueToReturn = true;
    }
    return valueToReturn;
  };
  const handleChange = (event) => {
    const keyword = event.target.value;
    if (keyword !== "") {
      const updatedData = [];
      brandState?.forEach((item) => {
        hasValue(item, keyword) && updatedData.push(item);
      });
      setShowList(updatedData);
    } else {
      setShowList(brandState);
    }
  };
  const redirectToCollection = (event, slug, name) => {
    event.preventDefault();
    let temp = [...filter?.brand];

    if (!temp.includes(slug)) {
      temp.push(slug);
    } else {
      temp = temp.filter((elem) => elem !== slug);
    }
    setFilter((prev) => {
      return {
        ...prev,
        brand: temp,
      };
    });
    const queryParams = new URLSearchParams(searchParams.toString());
    if (temp.length > 0) queryParams.set("brand", temp.join(","));
    else queryParams.delete("brand");
    queryParams.delete("page");
    if (temp.length === 1) {
      const selected = brandState.find((item) => String(item?.slug) === String(temp[0]) || String(item?.id) === String(temp[0]));
      queryParams.set("title", selected?.name || name);
    } else if (temp.length > 1) queryParams.set("title", "Selected Brands");
    else queryParams.delete("title");
    router.push(`${pathname}?${queryParams.toString()}`, { scroll: false });
  };  
  return (
    <div className="collapse show accordion-collapse collapsed ">
      <AccordionBody accordionId="2" className=" collection-brand-filter ">
        {brandState.length > 5 && (
          <div className="theme-form search-box">
            <Input type="search" placeholder={t("Search")} onChange={handleChange} />
          </div>
        )}
        <div className="custom-sidebar-height">
          {showList?.length > 0 ? (
            <ul className="shop-category-list ">
              {showList?.map((elem, i) => (
                <li key={i}>
                  <div className="form-check collection-filter-checkbox">
                    <Input className="checkbox_animated" type="checkbox" id={`brand-${elem?.slug}`} checked={filter?.brand?.includes(String(elem?.slug)) || filter?.brand?.includes(String(elem?.id))} onChange={(e) => redirectToCollection(e, String(elem?.slug || elem?.id), elem?.name)} />
                    <Label className="form-check-label" htmlFor={`brand-${elem?.slug}`}>
                      <span className="name">{elem?.name}</span>
                    </Label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <NoDataFound customClass="search-not-found-box" title="NoBrandFound" />
          )}
        </div>
      </AccordionBody>
    </div>
  );
};

export default CollectionBrand;
