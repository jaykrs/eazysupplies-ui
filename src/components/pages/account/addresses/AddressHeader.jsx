/**
 * AddressHeader Component
 *
 * Manages address list UI + Add/Edit modal.
 * Delete functionality is fully handled inside AddressData.jsx
 *
 * @developer Simran Samir
 */

import CustomModal from "@/components/widgets/CustomModal";
import NoDataFound from "@/components/widgets/NoDataFound";
import AccountContext from "@/context/accountContext";
import Btn from "@/elements/buttons/Btn";
import { CreateAddress } from "@/utils/axiosUtils/API";
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

  const { addressData, refetch } = useContext(AddressContext);

  // Keep UI state in sync with global context data
  useEffect(() => {
    if (addressData?.data?.length > 0) {
      setAddressState([...addressData.data]);
    } else {
      setAddressState([]);
    }
  }, [addressData]);

  /**
   * CREATE ADDRESS
   */
  const { mutate, isLoading } = useCreate(
    CreateAddress,
    false,
    false,
    "Address Added successfully",
    (res) => {
      const saved = res?.data?.data || res?.data;
      saved?.id && setAddressState((prev) => [...prev, saved]);
      refetch();
      setModal("");
    }
  );

  /**
   * EDIT ADDRESS
   */
  const { mutate: editMutate, isLoading: editLoader } = useCreate(
    CreateAddress,
    false,
    false,
    "Address Updated successfully",
    (res) => {
      const saved = res?.data?.data || res?.data;
      setAddressState((prev) =>
        prev.map((elem) => (elem.id === saved?.id ? saved : elem))
      );

      refetch();
      setModal("");
      setEditAddress(null);
    }
  );

  /** Close all modals */
  const handleModalClose = () => {
    setModal("");
    setEditAddress(null);
  };

  return (
    <Card>
      <CardBody>
        <div className="top-sec">
          <h3>{t("AddressBook")}</h3>
          <Btn
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
            imageUrl="/assets/svg/empty-items.svg"
            title="NoAddressFound"
            description="NoAddressDescription"
            height="300"
            width="300"
          />
        )}

        {/* Add / Edit modal */}
        <CustomModal
          modal={modal === "add" || modal === "edit"}
          setModal={handleModalClose}
          classes={{
            modalClass: "theme-modal-2 view-modal address-modal",
            title: modal === "add" ? "AddAddress" : "EditAddress",
          }}
        >
          <div className="right-sidebar-box">
            <AddAddressForm
              mutate={modal === "add" ? mutate : editMutate}
              method={modal === "add" ? "POST" : "PUT"}
              isLoading={isLoading || editLoader}
              setModal={setModal}
              editAddress={editAddress}
            />
          </div>
        </CustomModal>
      </CardBody>
    </Card>
  );
};

export default AddressHeader;
