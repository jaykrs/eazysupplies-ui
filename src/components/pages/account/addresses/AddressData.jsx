/**
 * AddressData Component
 *
 * Renders all saved user addresses inside the Account Dashboard.
 * Provides Edit and Delete actions for each address card.
 *
 * FEATURES:
 * - Displays list of user addresses
 * - Triggers edit modal on clicking "Edit"
 * - Handles delete confirmation modal
 * - Calls backend DELETE /api/address/:id using useDelete hook
 * - Updates local state + refetches global context after deletion
 *
 * STATE VARIABLES:
 * - deleteId → stores the ID of the address being deleted
 * - deleteError → holds any error message during delete operation
 *
 * DEPENDENCIES:
 * - useDelete → custom hook used to send DELETE request
 * - ConfirmDeleteModal → reusable delete confirmation popup
 * - AddressTable → displays formatted address content
 *
 * @developer Simran Samir
 */

import ConfirmDeleteModal from "@/components/widgets/ConfirmDeleteModal";
import AccountContext from "@/context/accountContext";
import Btn from "@/elements/buttons/Btn";
import { BASE_URL } from "@/utils/axiosUtils/API";
import useDelete from "@/utils/hooks/useDelete";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import AddressTable from "./AddressTable";

const AddressData = ({
  addressState,
  setAddressState,
  modal,
  setModal,
  setEditAddress
}) => {
  const { t } = useTranslation("common");
  const { refetch } = useContext(AccountContext);

  // Holds ID of the address selected for deletion
  const [deleteId, setDeleteId] = useState("");

  // Stores an error message when delete fails
  const [deleteError, setDeleteError] = useState("");

  /**
   * Backend DELETE API endpoint
   * DELETE /api/address/:id
   */
  const deleteURL = `${BASE_URL}/api/address`;

  /**
   * useDelete Hook
   * Calls DELETE /api/address/:id
   */
  const {
    data,
    mutate: deleteMutate,
    isLoading,
    error
  } = useDelete(deleteURL, false);

  /**
   * Executes the delete operation
   * Triggered when user confirms deletion in modal
   */
  const removeAddress = async () => {
    if (!deleteId) return;

    try {
      setDeleteError("");
      await deleteMutate(deleteId); // The hook appends ID automatically to URL
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError("Failed to delete address. Please try again.");
    }
  };

  /**
   * Handles API response of delete request
   * Updates UI & resets modal when delete succeeds or fails
   */
  useEffect(() => {
    // SUCCESS — remove from UI immediately
    if (data?.status) {
      setAddressState((prev) =>
        prev.filter((elem) => elem.id !== deleteId)
      );

      refetch(); // Sync context with backend
      setModal("");
      setDeleteId("");
      setDeleteError("");
    }

    // ERROR — show error message
    if (error) {
      console.error("Delete failed:", error);
      setDeleteError("Failed to delete address.");
    }
  }, [data, error]);

  /**
   * Close delete confirmation modal
   * Reset temporary delete state
   */
  const handleCloseModal = () => {
    setModal("");
    setDeleteId("");
    setDeleteError("");
  };

  return (
    <Row className="g-4">
      {addressState?.map((address, i) => (
        <Col xl={4} md={6} key={i}>
          <div className="select-box">
            <div className="address-box">
              {/* Display formatted address details */}
              <AddressTable address={address} />

              {/* Action buttons → Edit / Remove */}
              <div className="bottom">
                <Btn
                  color="transparent"
                  className="bottom_btn"
                  onClick={() => {
                    setEditAddress(address);
                    setModal("edit");
                  }}
                >
                  {t("Edit")}
                </Btn>

                <Btn
                  color="transparent"
                  className="bottom_btn text-danger"
                  onClick={() => {
                    setDeleteId(address?.id);
                    setModal("delete");
                  }}
                  disabled={isLoading}
                >
                  {isLoading && deleteId === address.id
                    ? t("Deleting...")
                    : t("Remove")}
                </Btn>
              </div>
            </div>
          </div>
        </Col>
      ))}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        modal={modal === "delete"}
        setModal={handleCloseModal}
        loading={isLoading}
        confirmFunction={removeAddress}
        error={deleteError}
      />
    </Row>
  );
};

export default AddressData;
