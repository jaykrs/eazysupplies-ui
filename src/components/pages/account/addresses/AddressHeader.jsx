import CustomModal from "@/components/widgets/CustomModal";
import NoDataFound from "@/components/widgets/NoDataFound";
import AccountContext from "@/context/accountContext";
import Btn from "@/elements/buttons/Btn";
import { AddressAPI, CreateAddress } from "@/utils/axiosUtils/API";
import useCreate from "@/utils/hooks/useCreate";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";
import AddAddressForm from "./AddAddressForm";
import AddressData from "./AddressData";
import AddressContext from "@/context/addressContext";

/**
 * AddressHeader Component
 * 
 * Manages the address book functionality for user accounts.
 * Provides functionality to view, add, edit, and delete addresses.
 * Integrates with AddressContext for global state management and
 * uses custom hooks for API operations.
 * 
 * Features:
 * - Display list of user addresses
 * - Add new addresses via modal form
 * - Edit existing addresses
 * - Real-time state synchronization between local and context state
 * - Loading states and error handling
 * - Responsive modal forms for address management
 * 
 * @component
 * @example
 * return (
 *   <AddressHeader />
 * )
 * 
 * @returns {JSX.Element} Address management interface with modal forms
 * 
 * @developer Simran Samir
 */
const AddressHeader = () => {
  const { t } = useTranslation("common");
  
  // Local state management
  const [addressState, setAddressState] = useState([]); // Local copy of addresses for UI
  const [editAddress, setEditAddress] = useState(); // Currently edited address object
  const [modal, setModal] = useState(""); // Modal state: "add", "edit", or ""
  
  // Context hooks for global state management
  const { accountData } = useContext(AccountContext);
  const { addressData, refetch, isLoading: addressesLoading, isValidUserId, currentUserId } = useContext(AddressContext);

  /**
   * Synchronizes address data from context to local state
   * Ensures UI always reflects the latest data from global state
   * Runs whenever addressData context changes
   */
  useEffect(() => {
    console.log('AddressHeader - Syncing address data:', {
      hasAddressData: !!addressData,
      addressCount: addressData?.data?.length,
      currentUserId,
      isValidUserId,
      accountUserId: accountData?.data?.id
    });

    if (addressData?.data?.length > 0) {
      // DEBUG: Let's see what's happening with user IDs
      console.log('All addresses with user IDs:', addressData.data.map(addr => ({
        id: addr.id,
        addressUserId: addr.userId,
        type: typeof addr.userId,
        currentUserId,
        typeCurrent: typeof currentUserId,
        accountUserId: accountData?.data?.id
      })));

      // FIX: Use the correct user ID for filtering
      // Try multiple possible user ID sources
      const effectiveUserId = currentUserId || accountData?.data?.id;
      
      console.log('Using effectiveUserId for filtering:', effectiveUserId);

      if (effectiveUserId) {
        // Convert both to string for safe comparison
        const userAddresses = addressData.data.filter(address => 
          address.userId && address.userId.toString() === effectiveUserId.toString()
        );

        console.log('Filtered addresses:', {
          allAddresses: addressData.data.length,
          userAddresses: userAddresses.length,
          effectiveUserId
        });

        setAddressState([...userAddresses]);
      } else {
        // If we can't determine user ID, show all addresses from context (fallback)
        console.warn('No user ID available for filtering, showing all addresses');
        setAddressState([...addressData.data]);
      }
    } else {
      // Reset local state if no addresses in context
      setAddressState([]);
    }
  }, [addressData, currentUserId, accountData?.data?.id]);

  /**
   * Mutation hook for creating new addresses
   * Handles API call, loading states, and success/error responses
   */
  const { mutate, isLoading } = useCreate(
    CreateAddress, 
    false, 
    false, 
    "Address Added successfully", 
    (resData) => {
      console.log('Address added:', resData);
      // Update local state immediately for better UX
      if (resData?.data) {
        setAddressState(prev => [...prev, resData.data]);
      }
      // Refetch from context to ensure data consistency with server
      refetch();
      // Close modal after successful addition
      setModal("");
    },
    (error) => {
      console.error('❌ Error adding address:', error);
    }
  );

  /**
   * Mutation hook for updating existing addresses
   * Reuses the same endpoint but with different method (PUT)
   */
  const { mutate: editMutate, isLoading: editLoader } = useCreate(
    `${CreateAddress}`, 
    false, 
    false, 
    "Address Updated successfully", 
    (resData) => {
      console.log('Address updated:', resData);
      // Update local state by mapping through addresses
      if (resData?.data) {
        setAddressState(prev =>
          prev.map((elem) => {
            if (elem?.id == resData?.data?.id) {
              return resData.data; // Replace updated address
            } else {
              return elem; // Keep other addresses unchanged
            }
          })
        );
      }
      // Refetch from context to sync with server
      refetch();
      // Reset modal and edit state
      setModal("");
      setEditAddress("");
    },
    (error) => {
      console.error('Error updating address:', error);
    }
  );

  /**
   * Handles modal close operation
   * Resets modal state and clears any edit data
   * Prevents stale data when reopening modal
   */
  const handleModalClose = () => {
    setModal("");
    setEditAddress("");
  };

  // Get effective user ID for the component
  const effectiveUserId = currentUserId || accountData?.data?.id;

  /**
   * Debug logging for development
   * Helps track data flow and state changes
   */
  console.log('AddressHeader Debug:', {
    addressContextData: addressData,
    localAddressState: addressState,
    modalState: modal,
    currentUserId,
    accountUserId: accountData?.data?.id,
    effectiveUserId,
    isValidUserId,
    addressesLoading,
    addressCount: addressData?.data?.length,
    filteredCount: addressState?.length
  });

  // Show loading state while addresses are being fetched
  if (addressesLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 mb-0">Loading your addresses...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Show message if user is not properly authenticated (optional - remove if too restrictive)
  if (!effectiveUserId) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4 text-muted">
            <p className="mb-2">Please login to manage your addresses</p>
            <small>User ID not available</small>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        {/* Header Section with Title and Add Button */}
        <div className="top-sec">
          <h3>{t("AddressBook")}</h3>
          {/* Add New Address Button - Opens modal form */}
          <Btn 
            tag="a" 
            size="sm" 
            color="transparent" 
            className="btn-solid" 
            onClick={() => setModal("add")}
          >
            + {t("AddNew")}
          </Btn>
        </div>
        
        {/* Conditional Rendering based on Address Data */}
        {addressState?.length > 0 ? (
          // Display address list when addresses exist
          <div className="address-book-section">
            <AddressData 
              addressState={addressState} 
              setAddressState={setAddressState} 
              modal={modal} 
              setModal={setModal} 
              setEditAddress={setEditAddress} 
              currentUserId={effectiveUserId} // Pass current user ID for security
            />
          </div>
        ) : (
          // Display empty state when no addresses found
          <NoDataFound 
            customClass="no-data-added" 
            imageUrl={`/assets/svg/empty-items.svg`} 
            title="NoAddressFound" 
            description="NoAddressDescription" 
            height="300" 
            width="300" 
          />
        )}
        
        {/* Modal Container for Add/Edit Address Forms */}
        <div className="checkout-detail">
          <CustomModal 
            modal={modal === "add" || modal === "edit"} // Show modal for add or edit
            setModal={handleModalClose} // Use custom close handler
            classes={{ 
              modalClass: "theme-modal-2 view-modal address-modal", 
              title: modal === "add" ? "AddAddress" : "EditAddress" // Dynamic title
            }}
          >
            <div className="right-sidebar-box">
              {/* Address Form Component - Conditionally renders based on modal type */}
              <AddAddressForm 
                mutate={modal === "add" ? mutate : editMutate} // Pass appropriate mutation
                method={modal === "add" ? "POST" : "PUT"} // Set HTTP method
                isLoading={isLoading || editLoader} // Combine loading states
                setModal={setModal} 
                setEditAddress={setEditAddress} 
                editAddress={editAddress} // Pass address data for editing
                modal={modal} 
                setAddressState={setAddressState} 
                currentUserId={effectiveUserId} // Pass current user ID
              />
            </div>
          </CustomModal>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressHeader;