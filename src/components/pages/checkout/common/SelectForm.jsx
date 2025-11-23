/**
 * Checkout Shipping SelectForm
 *
 * This form is used to create or edit a shipping address during checkout.
 * It now matches the simplified `address` table used across the project.
 *
 * Saved Fields:
 *  - name
 *  - address
 *  - city
 *  - zipcode
 *  - phone
 *
 * NOTE:
 * Country selection in UI is only for selecting phone country code.
 * It is NOT stored in the database.
 *
 * Default:
 *  - country_code = "91" (India)
 *
 * @developer Simran Samir
 */

import { Form } from "formik";
import { Col, ModalFooter, Row } from "reactstrap";
import Btn from "@/elements/buttons/Btn";
import { useTranslation } from "react-i18next";
import SimpleInputField from "@/components/widgets/inputFields/SimpleInputField";
import SearchableSelectInput from "@/utils/commonComponents/inputFields/SearchableSelectInput";
import { AllCountryCode } from "@/data/CountryCode";
import { useEffect } from "react";

const SelectForm = ({
  values,
  isLoading,
  setModal,
  setFieldValue,
  isFooterDisplay = true
}) => {
  const { t } = useTranslation("common");

  /**
   * Set default country code only ONCE for new forms.
   * Avoids infinite re-rendering by moving this inside useEffect.
   */
  useEffect(() => {
    if (!values.country_code) {
      setFieldValue("country_code", "91");
    }
  }, []);

  return (
    <Form>
      <Row className="g-3">

        {/* Address Nickname / Label */}
        <SimpleInputField
          nameList={[
            {
              name: "name",
              placeholder: t("EnterAddressType"),
              toplabel: "Address Type",
              colprops: { xs: 12 },
              require: "true"
            }
          ]}
        />

        {/* Address */}
        <SimpleInputField
          nameList={[
            {
              name: "address",
              placeholder: t("EnterAddress"),
              toplabel: "Address",
              colprops: { xs: 12 },
              require: "true"
            }
          ]}
        />

        {/* City + Zipcode */}
        <SimpleInputField
          nameList={[
            {
              name: "city",
              placeholder: t("EnterCity"),
              toplabel: "City",
              colprops: { md: 6 },
              require: "true"
            },
            {
              name: "zipcode",
              placeholder: t("EnterPincode"),
              toplabel: "Pincode",
              colprops: { md: 6 },
              require: "true"
            }
          ]}
        />

        {/* Phone with Country Code */}
        <Col xs={12} className="phone-field">
          <div className="form-box position-relative">
            <div className="country-input">

              <SimpleInputField
                nameList={[
                  {
                    name: "phone",
                    type: "number",
                    placeholder: t("EnterPhoneNumber"),
                    require: "true",
                    toplabel: "Phone",
                    colprops: { xs: 12 },
                    colclass: "country-input-box"
                  }
                ]}
              />

              <SearchableSelectInput
                nameList={[
                  {
                    name: "country_code",
                    notitle: "true",
                    toplabel: "Country Code",
                    inputprops: {
                      name: "country_code",
                      id: "country_code",
                      options: AllCountryCode
                    }
                  }
                ]}
              />

            </div>
          </div>
        </Col>

        {/* Footer Buttons */}
        {isFooterDisplay && (
          <ModalFooter className="ms-auto justify-content-end save-back-button">
            <Btn
              size="md"
              className="btn-outline fw-bold"
              title="Cancel"
              onClick={() => setModal(false)}
            />
            <Btn
              className="btn-solid"
              type="submit"
              title="Submit"
              loading={Number(isLoading)}
            />
          </ModalFooter>
        )}

      </Row>
    </Form>
  );
};

export default SelectForm;
