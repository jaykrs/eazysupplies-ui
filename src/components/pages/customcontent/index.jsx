"use client";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { useContext } from "react";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import Breadcrumbs from "@/utils/commonComponents/breadcrumb";
import Loader from "@/layout/loader";
import CustomText from "./customText";
import { useState, useEffect } from 'react';
import { prodapiurl } from "@/utils/constants";
import { useSearchParams } from 'next/navigation';
const CustomContent = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  useEffect(() => {
    const fetchPolicy = async () => {
      const pageid = searchParams.get('name'); 
      try {
        const response = await fetch(prodapiurl+'/template?name='+pageid);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data =  await response.json();
        console.log(data.htmlData);
        // Extract only the htmlData string
        setHtmlContent(data.htmlData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load policy');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  if (isLoading) return <Loader />;
  return (
    <>
      {/* <Breadcrumbs title={pageid} subNavigation={[{ name: pageid }]} /> */}
      <WrapperComponent
        classes={{
          sectionClass: "about-page section-b-space ",
          fluidClass: "container",
        }}
        noRowCol={true}
      >
          <CustomText data={htmlContent}/>
      </WrapperComponent>
    </>
  );
};

export default CustomContent;
