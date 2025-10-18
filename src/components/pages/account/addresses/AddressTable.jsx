import AccountContext from "@/context/accountContext";
import { useContext } from "react";

const AddressTable = ({ address }) => {
  const { accountData } = useContext(AccountContext);
  return (
    <>
      <div className="top">
        <h6>
          <span>{address?.name}</span>
        </h6>
      </div>
      <div className="middle">
        <div className="address">
          <p>{address?.address}, {address?.city}</p>
          <p>{address?.zipcode}</p>
        </div>
        {/* <div className="number">
          <p>
            Phone: +{address?.country_code} {address?.phone}
          </p>
        </div> */}
      </div>
    </>
  );
};

export default AddressTable;
