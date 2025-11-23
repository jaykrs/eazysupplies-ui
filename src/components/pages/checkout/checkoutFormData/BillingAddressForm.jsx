/**
 * BillingAddressForm (Checkout)
 *
 * Updated to:
 *  - Split "address | Phone: XXXXX" into clean UI fields
 *  - Display clean address, phone, city, pincode
 *  - Sync with Shipping Address if "same as shipping" is checked
 *
 * @developer Simran Samir
 */

import SimpleInputField from "@/components/widgets/inputFields/SimpleInputField";
import { AllCountryCode } from "@/data/CountryCode";
import SearchableSelectInput from "@/utils/commonComponents/inputFields/SearchableSelectInput";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Col, Input, Label, Row } from "reactstrap";

const BillingAddressForm = ({ values, setFieldValue, errors, data }) => {
  const { t } = useTranslation("common");

  /** Split backend stored address: "address | Phone: 9999999999" */
  const extractAddress = (storedAddress) => {
    if (!storedAddress) return { address: "", phone: "" };

    const [addr, phone] = storedAddress.split("| Phone:");
    return {
      address: addr?.trim() ?? "",
      phone: phone?.trim() ?? ""
    };
  };

  /** When "same as shipping" is toggled */
  useEffect(() => {
    if (values.billing_address.same_shipping) {
      const parsed = extractAddress(values.shipping_address.address);

      setFieldValue("billing_address", {
        same_shipping: true,
        title: values.shipping_address.name,
        street: parsed.address,
        city: values.shipping_address.city,
        pincode: values.shipping_address.zipcode,
        country_code: values.shipping_address.country_code,
        phone: values.shipping_address.phone,
        country_id: values.billing_address.country_id,
        state_id: values.billing_address.state_id
      });
    }
  }, [values.billing_address.same_shipping]);

  return (
    <div className="checkbox-main-box">
      <div className="checkout-title1">
        <h2>{t(`BillingDetails`)}</h2>
      </div>

      <Row className="g-md-4 g-sm-3 g-2 checkout-form">

        {!errors?.shipping_address && (
          <Col xs={12}>
            <div className="mb-3 form-box form-checkbox">
              <Input
                className="checkbox_animated check-box"
                type="checkbox"
                name="billing_address.same_shipping"
                checked={values.billing_address.same_shipping}
                onChange={(e) =>
                  setFieldValue("billing_address.same_shipping", e.target.checked)
                }
              />
              <Label className="form-check-label">
                {t("Is the shipping address the same as your billing address?")}
              </Label>
            </div>
          </Col>
        )}

        {/* -------- Title + Address (CLEAN) -------- */}
        <SimpleInputField
          nameList={[
            {
              name: "billing_address.title",
              placeholder: t("EnterTitle"),
              toplabel: "Title",
              colprops: { md: 12 },
              require: "true"
            },
            {
              name: "billing_address.street",
              placeholder: t("EnterAddress"),
              toplabel: "Address",
              colprops: { xs: 12 },
              require: "true"
            }
          ]}
        />

        {/* -------- Country + State -------- */}
        <SearchableSelectInput
          nameList={[
            {
              name: "billing_address.country_id",
              require: "true",
              title: "Country",
              toplabel: "Country",
              colprops: { md: 6 },
              inputprops: {
                name: "billing_address.country_id",
                id: "billing_address.country_id",
                options: data
              }
            },
            {
              name: "billing_address.state_id",
              require: "true",
              title: "State",
              toplabel: "State",
              colprops: { md: 6 },
              inputprops: {
                name: "billing_address.state_id",
                id: "billing_address.state_id",
                options:
                  data?.find((x) => Number(x.id) === Number(values.billing_address.country_id))
                    ?.state || [],
                defaultOption: "Select state"
              }
            }
          ]}
        />

        {/* -------- City + Pincode -------- */}
        <SimpleInputField
          nameList={[
            {
              name: "billing_address.city",
              placeholder: t("EnterCity"),
              toplabel: "City",
              colprops: { xxl: 6, lg: 12, sm: 6 },
              require: "true"
            },
            {
              name: "billing_address.pincode",
              placeholder: t("EnterPincode"),
              toplabel: "Pincode",
              colprops: { xxl: 6, lg: 12, sm: 6 },
              require: "true"
            }
          ]}
        />

        {/* -------- Phone (clean) + Country Code -------- */}
        <Col xs={12} className="phone-field">
          <Row className="g-2">

            <Col xs={4}>
              <SearchableSelectInput
                nameList={[
                  {
                    name: "billing_address.country_code",
                    toplabel: "Code",
                    inputprops: {
                      name: "billing_address.country_code",
                      id: "billing_address.country_code",
                      options: AllCountryCode
                    }
                  }
                ]}
              />
            </Col>

            <Col xs={8}>
              <SimpleInputField
                nameList={[
                  {
                    name: "billing_address.phone",
                    type: "number",
                    placeholder: t("EnterPhoneNumber"),
                    toplabel: "Phone",
                    require: "true",
                    colprops: { xs: 12 }
                  }
                ]}
              />
            </Col>

          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BillingAddressForm;
