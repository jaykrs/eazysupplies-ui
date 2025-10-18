import request from "@/utils/axiosUtils";
import { CountryAPI } from "@/utils/axiosUtils/API";
import { YupObject, nameSchema, phoneSchema } from "@/utils/validation/ValidationSchema";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import SelectForm from "./SelectForm";
import { useContext } from "react";
import AccountContext from "@/context/accountContext";

const AddAddressForm = ({ isLoading, mutate, type, editAddress, setModal, isFooterDisplay, method }) => {
  const { accountData } = useContext(AccountContext)
  const { data } = useFetchQuery([CountryAPI], () => request({ url: CountryAPI }), {
    refetchOnWindowFocus: false,
    select: (res) => res.data.map((country) => ({ id: country.id, name: country.name, state: country.state })),
  });

  const { t } = useTranslation("common");
  return (
    <Formik
      initialValues={{
        name: editAddress ? editAddress?.name : "",
        zipcode: editAddress ? editAddress?.zipcode : "",
        city: editAddress ? editAddress?.city : "",
        address: editAddress ? editAddress?.address : "",
      }}
      validationSchema={YupObject({
        name: nameSchema,
        zipcode: nameSchema,
        city: nameSchema,
        address: nameSchema
      })}
      onSubmit={(values) => {
        if (editAddress) {
          values["_method"] = method ? method : "PUT";
          mutate({ ...values, id: accountData?.data?.id })
        }
        values["zipcode"] = values["zipcode"].toString();
        // Put your logic here
        mutate({ ...values, userId: accountData?.data?.id })
        setModal(false);
      }}
    >
      {({ values, setFieldValue }) => <SelectForm values={values} setFieldValue={setFieldValue} setModal={setModal} isLoading={isLoading} data={data} isFooterDisplay={isFooterDisplay} />}
    </Formik>
  );
};

export default AddAddressForm;
