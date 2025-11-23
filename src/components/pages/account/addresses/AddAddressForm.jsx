/**
 * AddAddressForm Component
 *
 * Handles Create and Edit operations for user addresses.
 *
 * FEATURES:
 * - Splits stored "address | phone" into separate UI fields during edit
 * - Re-merges phone back into the final address on save
 * - Sends correct API URLs:
 *      POST → /api/address
 *      PUT  → /api/address/:id
 * - Formik + Yup validation
 *
 * @developer Simran Samir
 */

import request from "@/utils/axiosUtils";
import { CountryAPI } from "@/utils/axiosUtils/API";
import { YupObject, nameSchema, phoneSchema } from "@/utils/validation/ValidationSchema";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import SelectForm from "./SelectForm";
import { useContext } from "react";
import AccountContext from "@/context/accountContext";

const AddAddressForm = ({ isLoading, mutate, editAddress, setModal, isFooterDisplay }) => {
  const { accountData } = useContext(AccountContext);
  const { t } = useTranslation("common");

  /**
   * (Optional) Fetch Countries - not used but kept for future needs
   */
  const { data } = useFetchQuery([CountryAPI], () => request({ url: CountryAPI }), {
    refetchOnWindowFocus: false,
    select: (res) =>
      res.data.map((country) => ({
        id: country.id,
        name: country.name,
        state: country.state,
      })),
  });

  /**
   * Extract phone if stored inside DB as:
   * "flat no, area, landmark | Phone: 9999999999"
   */
  const parseAddress = (fullAddress) => {
    if (!fullAddress) return { address: "", phone: "" };

    const parts = fullAddress.split("| Phone:");
    return {
      address: parts[0]?.trim() || "",
      phone: parts[1]?.trim() || "",
    };
  };

  // Extract parsed values for edit mode
  const parsed = editAddress ? parseAddress(editAddress.address) : {};

  return (
    <Formik
      /**
       * INITIAL VALUES
       * Works for both Create & Edit mode
       */
      initialValues={{
        name: editAddress?.name || "",
        zipcode: editAddress?.zipcode || "",
        city: editAddress?.city || "",
        address: parsed.address || "",
        phone: parsed.phone || "",
      }}

      /**
       * VALIDATION RULES
       */
      validationSchema={YupObject({
        name: nameSchema,
        zipcode: nameSchema,
        city: nameSchema,
        address: nameSchema,
        phone: phoneSchema,
      })}

      /**
       * ON SUBMIT
       * Builds final payload + calls correct API endpoint
       */
      onSubmit={async (values) => {
        values.zipcode = values.zipcode.toString();

        // Merge phone back into final address field
        const finalAddress = `${values.address} | Phone: ${values.phone}`;

        if (editAddress) {
          /**
           * EDIT MODE → PUT /api/address/:id
           */
          const editData = {
            name: values.name,
            zipcode: values.zipcode,
            city: values.city,
            address: finalAddress,
          };

          console.log("EDIT REQUEST →", editData);

          mutate({
            url: `/address/${editAddress.id}`,
            method: "PUT",
            data: editData,
          });

        } else {
          /**
           * CREATE MODE → POST /api/address
           */
          const addData = {
            name: values.name,
            zipcode: values.zipcode,
            city: values.city,
            address: finalAddress,
            userId: accountData?.data?.id,
          };

          console.log("CREATE REQUEST →", addData);

          mutate({
            url: "/address",
            method: "POST",
            data: addData,
          });
        }

        setModal(false);
      }}
    >
      {({ values, setFieldValue }) => (
        <SelectForm
          values={values}
          setFieldValue={setFieldValue}
          setModal={setModal}
          isLoading={isLoading}
          data={data}
          isFooterDisplay={isFooterDisplay}
          editAddress={editAddress}
        />
      )}
    </Formik>
  );
};

export default AddAddressForm;
