"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { RiLayoutGridLine, RiPlantLine } from "react-icons/ri";

const ThemeVariantSwitch = ({ activeTheme }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const earthlingActive = activeTheme === "earthling";

  const switchLabel = useMemo(
    () => (earthlingActive ? "Switch to classic storefront" : "Preview Earthling editorial theme"),
    [earthlingActive],
  );

  const switchHref = useMemo(() => {
    const nextTheme = earthlingActive ? "classic" : "earthling";
    const params = new URLSearchParams(searchParams.toString());
    params.set("theme", nextTheme);
    return `${pathname}?${params.toString()}`;
  }, [earthlingActive, pathname, searchParams]);

  return (
    <a
      className="storefront-theme-switch"
      aria-label={switchLabel}
      title={switchLabel}
      href={switchHref}
    >
      {earthlingActive ? <RiLayoutGridLine aria-hidden="true" /> : <RiPlantLine aria-hidden="true" />}
      <span>{earthlingActive ? "Classic Store" : "Earthling Theme"}</span>
    </a>
  );
};

export default ThemeVariantSwitch;
