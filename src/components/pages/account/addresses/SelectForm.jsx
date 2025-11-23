/**
 * SelectForm Component
 *
 * This component renders the address form fields inside the Add/Edit Address modal.
 * It is used together with Formik inside AddAddressForm.
 *
 * FIELD STRUCTURE:
 * - Row 1: Address Type
 * - Row 2: Address
 * - Row 3: Phone (stored inside final address string)
 * - Row 4: Pincode
 * - Row 5: City
 *
 * FORM BEHAVIOR:
 * - The "phone" field is NOT stored as a DB column; instead, it is appended to "address"
 *   before sending the form to the backend.
 * - All fields use Formik validation passed from AddAddressForm.
 *
 * @component
 * @developer Simran Samir
 */

import SimpleInputField from "@/components/widgets/inputFields/SimpleInputField";
import Btn from "@/elements/buttons/Btn";
import { Form } from "formik";
import { useTranslation } from "react-i18next";
import { Col, ModalFooter, Row } from "reactstrap";

const SelectForm = ({ values, isLoading, setModal, isFooterDisplay = true }) => {
  const { t } = useTranslation("common");

  return (
    <Form>
      <Row>

        {/* ------------------------------------------------------------------
         * Row 1: Address Type
         * User defines whether the address belongs to "Home", "Office", etc.
         * ------------------------------------------------------------------ */}
        <SimpleInputField
          nameList={[
            {
              name: "name",
              placeholder: t("EnterAddressType"),
              toplabel: "Address Type",
              colprops: { xs: 12 },
              require: "true",
            },
          ]}
        />

        {/* ------------------------------------------------------------------
         * Row 2: Full Address  
         * Main location details (flat no, street, area, etc.)
         * ------------------------------------------------------------------ */}
        <SimpleInputField
          nameList={[
            {
              name: "address",
              placeholder: t("EnterAddress"),
              toplabel: "Address (Street, Flat no, Area)",
              colprops: { xs: 12 },
              require: "true",
            },
          ]}
        />

        {/* ------------------------------------------------------------------
         * Row 3: Phone Number
         * Only used temporarily and merged with "address" during submit.
         * NOT stored as a separate DB field.
         * ------------------------------------------------------------------ */}
        <SimpleInputField
          nameList={[
            {
              name: "phone",
              placeholder: t("EnterPhoneNumber"),
              toplabel: "Phone",
              type: "number",
              colprops: { xs: 12 },
              require: "true",
            },
          ]}
        />

        {/* ------------------------------------------------------------------
         * Row 4: Pincode / Postal Code
         * Stored directly as "zipcode" in the backend.
         * ------------------------------------------------------------------ */}
        <SimpleInputField
          nameList={[
            {
              name: "zipcode",
              placeholder: t("EnterPincode"),
              toplabel: "Pincode",
              colprops: { xs: 12 },
              require: "true",
            },
          ]}
        />

        {/* ------------------------------------------------------------------
         * Row 5: City Name
         * Stores the city for this address.
         * ------------------------------------------------------------------ */}
        <SimpleInputField
          nameList={[
            {
              name: "city",
              placeholder: t("EnterCity"),
              toplabel: "City",
              colprops: { xs: 12 },
              require: "true",
            },
          ]}
        />

        {/* ------------------------------------------------------------------
         * Footer Buttons (Cancel + Submit)
         * Visibility controlled via isFooterDisplay flag.
         * ------------------------------------------------------------------ */}
        <Col xs="12">
          {isFooterDisplay && (
            <ModalFooter className="ms-auto justify-content-end save-back-button mt-0">
              <Btn
                className="btn-md btn-outline fw-bold"
                color="transparent"
                onClick={() => setModal(false)}
              >
                {t("Cancel")}
              </Btn>

              <Btn 
                className="btn-solid" 
                type="submit" 
                loading={Number(isLoading)}
              >
                {t("Submit")}
              </Btn>
            </ModalFooter>
          )}
        </Col>

      </Row>
    </Form>
  );
};

export default SelectForm;
