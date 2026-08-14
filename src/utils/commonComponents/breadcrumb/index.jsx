import CategoryContext from "@/context/categoryContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

const Breadcrumbs = ({ mainHeading, subNavigation, subTitle, title }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categoryData = [] } = useContext(CategoryContext) || {};
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  const openCategory = (category) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("layout", params.get("layout") || "collection_3_grid");
    params.set("category", String(category.id));
    params.set("title", category.name);
    params.delete("brand");
    setCategoryPopoverOpen(false);
    router.push(`/collections?${params.toString()}`);
  };

  const visibleCategories = categoryData.filter((category) => category?.name && category.name.toUpperCase() !== "DEFAULT");
  return (
    <div className="breadcrumb-section">
      <Container>
        <h2>{t(title?.replaceAll("-", " "))}</h2>
        <nav className="theme-breadcrumb">
          <Breadcrumb>
            <div className="breadcrumb-item active">
              <Link href="/"> {t("Home")} </Link>
            </div>
            {subNavigation?.map((result, i) => (
              <div key={i} className="breadcrumb-item active ">
                {result?.categoryPopover ? (
                  <Dropdown isOpen={categoryPopoverOpen} toggle={() => setCategoryPopoverOpen((open) => !open)}>
                    <DropdownToggle tag="button" color="link" className="p-0 border-0 text-uppercase" style={{ color: "inherit", fontSize: "inherit", fontWeight: 600, textDecoration: "none" }}>
                      {t(result?.name?.replaceAll("-", " "))}
                    </DropdownToggle>
                    <DropdownMenu style={{ maxHeight: "320px", minWidth: "280px", overflowY: "auto" }}>
                      <DropdownItem header>{t("Categories")}</DropdownItem>
                      {visibleCategories.map((category) => (
                        <DropdownItem key={category.id} active={String(category.id) === searchParams.get("category")} onClick={() => openCategory(category)}>
                          {category.name}
                        </DropdownItem>
                      ))}
                      {!visibleCategories.length && <DropdownItem disabled>{t("NoCategoryFound")}</DropdownItem>}
                    </DropdownMenu>
                  </Dropdown>
                ) : result?.link ? (
                  <Link href={result.link}> {t(result?.name?.replaceAll("-", " "))} </Link>
                ) : (
                  <span> {t(result?.name?.replaceAll("-", " "))} </span>
                )}
              </div>
            ))}
          </Breadcrumb>
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
