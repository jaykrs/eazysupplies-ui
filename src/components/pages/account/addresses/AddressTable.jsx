/**
 * AddressTable Component
 *
 * Displays a single saved address inside the address book.
 *
 * This component:
 * - Extracts phone number from the merged string
 * - Shows the phone on a separate line below the address
 * - Formats address, city, and pincode for clean UI display
 *
 * @developer Simran Samir
 */

import AccountContext from "@/context/accountContext";
import { useContext } from "react";

const AddressTable = ({ address }) => {
  const { accountData } = useContext(AccountContext);

  // -------------------------------------------------------------
  // Extract phone number from merged address string
  // -------------------------------------------------------------
  const extractPhone = (fullAddress) => {
    if (!fullAddress) return "";

    const parts = fullAddress.split("| Phone:");
    return parts[1]?.trim() || ""; // return only the phone
  };

  // Get pure address text (without phone)
  const getCleanAddress = (fullAddress) => {
    if (!fullAddress) return "";
    return fullAddress.split("| Phone:")[0].trim();
  };

  const phoneNumber = extractPhone(address?.address);
  const cleanAddress = getCleanAddress(address?.address);

  return (
    <>
      <div className="top">
        <h6>
          <span>{address?.name}</span>
        </h6>
      </div>

      <div className="middle">
        <div className="address">
          {/* Main Address */}
          <p>{cleanAddress}</p>

          {/* Phone Number on Separate Line */}
          {phoneNumber && (
            <p className="text-muted">
              <span>Phone:</span> {phoneNumber}
            </p>
          )}

          {/* City + Pincode */}
          <p>
            {address?.city}, {address?.zipcode}
          </p>
        </div>
      </div>
    </>
  );
};

export default AddressTable;
