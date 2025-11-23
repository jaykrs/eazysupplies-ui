/**
 * DeliveryAddress card group
 *
 * Renders address cards (shipping or billing) and the Add Address modal.
 * Uses `address` prop as an array of { value, label, full } objects.
 *
 * Developer: Simran Samir
 */

import React, { useEffect } from "react";
import { Row } from "reactstrap";
import { RiAddLine, RiMapPinLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import CheckoutCard from "./common/CheckoutCard";
import AddAddressForm from "./common/AddAddressForm";
import ShowAddress from "./ShowAddress";
import CustomModal from "@/components/widgets/CustomModal";

const DeliveryAddress = ({
  type,
  title,
  address = [],
  modal,
  setModal,
  setFieldValue,
  mutate,
  isLoading
}) => {
  const { t } = useTranslation("common");

  // Auto-select first address if present
  useEffect(() => {
    if (address?.length > 0) {
      const firstVal = address[0].value || address[0].id;
      setFieldValue(`${type}_address_id`, firstVal);
      setFieldValue(`${type}_address`, address[0].full || address[0]);
    }
  }, [address]);

  return (
    <CheckoutCard icon={<RiMapPinLine />}>
      <div className="checkout-title">
        <h4>{t(title)} {t("Address")}</h4>
        <a className="d-flex align-items-center fw-bold" onClick={() => setModal(type)}>
          <RiAddLine className="me-1" />
          {t("AddNew")}
        </a>
      </div>

      <div className="checkout-detail">
        {address?.length > 0 ? (
          <Row className="g-4">
            {address.map((addr, i) => (
              <ShowAddress item={addr.full || addr} key={i} type={type} index={i} />
            ))}
          </Row>
        ) : (
          <div className="empty-box">
            <h2>{t("NoaddressFound")}</h2>
          </div>
        )}

        <CustomModal
          modal={modal === type}
          setModal={setModal}
          classes={{ modalClass: "theme-modal-2 address-modal address-modal-2", title: "AddAddress" }}
        >
          <div className="right-sidebar-box">
            <AddAddressForm mutate={mutate} isLoading={isLoading} setModal={setModal} type={type} />
          </div>
        </CustomModal>
      </div>
    </CheckoutCard>
  );
};

export default DeliveryAddress;
