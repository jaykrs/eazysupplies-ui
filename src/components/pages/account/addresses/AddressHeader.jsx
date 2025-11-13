import CustomModal from "@/components/widgets/CustomModal";
import NoDataFound from "@/components/widgets/NoDataFound";
import AccountContext from "@/context/accountContext";
import Btn from "@/elements/buttons/Btn";
import { AddressAPI, CreateAddress } from "@/utils/axiosUtils/API";
import useCreate from "@/utils/hooks/useCreate";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";
import AddAddressForm from "./AddAddressForm";
import AddressData from "./AddressData";
import AddressContext from "@/context/addressContext";

const AddressHeader = () => {
  const { t } = useTranslation("common");
  const [addressState, setAddressState] = useState([]);
  const [editAddress, setEditAddress] = useState();
  const [modal, setModal] = useState("");
  const { accountData } = useContext(AccountContext);
  const { addressData, refetch } = useContext(AddressContext);

  // Properly sync addressData from context to local state
  useEffect(() => {
    if (addressData?.data?.length > 0) {
      setAddressState([...addressData.data]);
    } else {
      setAddressState([]);
    }
  }, [addressData]);

  const { mutate, isLoading } = useCreate(
    CreateAddress, 
    false, 
    false, 
    "Address Added successfully", 
    (resData) => {
      console.log('Address added:', resData);
      // Update local state immediately
      setAddressState(prev => [...prev, resData?.data]);
      // Refetch from context to ensure data consistency
      refetch();
      setModal("");
    }
  );

  const { mutate: editMutate, isLoading: editLoader } = useCreate(
    `${CreateAddress}`, 
    false, 
    false, 
    "Address Updated successfully", 
    (resData) => {
      console.log('Address updated:', resData);
      // Update local state
      setAddressState(prev =>
        prev.map((elem) => {
          if (elem?.id == resData?.data?.id) {
            return resData?.data;
          } else {
            return elem;
          }
        })
      );
      // Refetch from context
      refetch();
      setModal("");
      setEditAddress("");
    }
  );

  // Handle modal close properly
  const handleModalClose = () => {
    setModal("");
    setEditAddress("");
  };

  // Debug logs to check data flow
  console.log('Address Context Data:', addressData);
  console.log('Local Address State:', addressState);
  console.log('Modal State:', modal);

  return (
    <Card>
      <CardBody>
        <div className="top-sec">
          <h3>{t("AddressBook")}</h3>
          <Btn 
            tag="a" 
            size="sm" 
            color="transparent" 
            className="btn-solid" 
            onClick={() => setModal("add")}
          >
            + {t("AddNew")}
          </Btn>
        </div>
        
        {addressState?.length > 0 ? (
          <div className="address-book-section">
            <AddressData 
              addressState={addressState} 
              setAddressState={setAddressState} 
              modal={modal} 
              setModal={setModal} 
              setEditAddress={setEditAddress} 
            />
          </div>
        ) : (
          <NoDataFound 
            customClass="no-data-added" 
            imageUrl={`/assets/svg/empty-items.svg`} 
            title="NoAddressFound" 
            description="NoAddressDescription" 
            height="300" 
            width="300" 
          />
        )}
        
        <div className="checkout-detail">
          <CustomModal 
            modal={modal === "add" || modal === "edit"} 
            setModal={handleModalClose}
            classes={{ 
              modalClass: "theme-modal-2 view-modal address-modal", 
              title: modal === "add" ? "AddAddress" : "EditAddress" 
            }}
          >
            <div className="right-sidebar-box">
              <AddAddressForm 
                mutate={modal === "add" ? mutate : editMutate} 
                method={modal === "add" ? "POST" : "PUT"}
                isLoading={isLoading || editLoader} 
                setModal={setModal} 
                setEditAddress={setEditAddress} 
                editAddress={editAddress} 
                modal={modal} 
                setAddressState={setAddressState} 
              />
            </div>
          </CustomModal>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressHeader;