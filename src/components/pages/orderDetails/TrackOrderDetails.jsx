import Loader from "@/layout/loader";
import ConsumerDetails from "./common/ConsumerDetails";
import StatusDetail from "./common/StatusDetails";
import SubTable from "./common/SubTable";
import TableDetails from "./common/TableDetails";
import TitleDetails from "./common/TitleDetails";
import { useState } from "react";

const TrackOrderDetails = ({ data, isLoading, orderNumber, taxData }) => {
 function generateProductDiscount(product, ordId) {
        let jsonData = product.jsonData;
        let _dd = [];
        if (!jsonData) {
            _dd = [{ discountPercentage: 0, discountAmount: 0, taxId: 0, taxAmount: 0, taxpercent: 0, totalPrice: 0 }];
            let _taxId = Number(product?.tax);
            let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
            _taxpercent = _taxpercent[0]?.value;
            let _taxAmt = Number(product?.price) * Number(_taxpercent) / 100;
            _dd[0].taxAmount = _taxAmt;
            _dd[0].taxpercent = _taxpercent;
            _dd[0].totalPrice = Number(product?.price) + _taxAmt;
            return _dd[0];
        }
        else {
            _dd = jsonData.filter(el => el.orderId == ordId);
            if (_dd.length > 0) {
                let _taxId = Number(product?.tax);
                let _taxpercent = taxData.filter((elm) => Number(elm.id) == _taxId);
                _taxpercent = _taxpercent[0]?.value;
                let _taxAmt = Number(_dd[0].sellingPrice) * Number(_taxpercent) / 100;
                _dd[0].taxAmount = _taxAmt;
                _dd[0].taxpercent = _taxpercent;
                _dd[0].totalPrice = Number(_dd[0].sellingPrice) + _taxAmt;
                return _dd[0];
            }
        }
    }


  if (isLoading) return <Loader />;
  return (
    <>
      {/* <TitleDetails params={orderNumber} data={data} /> */}
      <StatusDetail data={data} />
      <div className="flex-grow-1 p-3">
                 

                    {data?.items?.length > 0 ? (
                        data.items.map((el, index) => {
                            const quantity = Number(el?.quantity || 0);
                            const price = Number(el?.product?.price || 0);

                            const amtDetails = generateProductDiscount(el?.product, el.orderId) || {};
                      //      const deliveryAgentFilter = state.deliveryAgent?.filter(el => el.id == Number(state.productItemDetails?.deliveryAgent));
                            const {
                                discountPercentage = 0,
                                discountAmount = 0,
                                taxpercent = 0,
                                taxAmount = 0,
                                totalPrice = price - discountAmount + taxAmount
                            } = amtDetails;
                         
                            return (
                                <div key={index} className="card shadow-sm mb-4 border-0">
                                    <div className="card-body p-4">

                                        {/* Header */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="fw-bold text-primary m-0">{el?.product?.name}</h4>
                                            <span className="badge bg-secondary">Order #{el?.orderId}</span>
                                        </div>

                                        {/* Dates */}
                                        <div className="d-flex gap-2 text-muted small mb-4">
                                            <div>
                                                <strong>Ordered:</strong>{" "}
                                                {el?.createdAt ? new Date(el.createdAt).toLocaleDateString() : "-"}
                                            </div>
                                            <div>
                                                <strong>Updated:</strong>{" "}
                                                {el?.updatedAt ? new Date(el.updatedAt).toLocaleDateString() : "-"}
                                            </div>
                                            <div>
                                                <strong>Payment:</strong>{" "}
                                                {data?.payment?.status.toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>Shipping:</strong>{" "}
                                                {data?.shipping?.status.toUpperCase()}
                                            </div>
                                            {/* <div>
                                                <strong>Delivery Agent: {deliveryAgentFilter.length > 0 ? deliveryAgentFilter[0]?.name : "NA"}</strong>{" "}
                                            </div> */}
                                        </div>

                                        {/* Content Section */}
                                        <div className="row g-3">

                                            {/* Left Column */}
                                            <div className="col-md-6">
                                                <div className="p-3 rounded">
                                                    <p><strong>Price per unit:</strong> ₹{price}</p>
                                                    <p><strong>Quantity:</strong> {quantity}</p>

                                                   
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="col-md-6">
                                                <div className="p-3 rounded ">
                                                    <p><strong>Discount:</strong> {discountPercentage}%</p>
                                                    <p><strong>Discount Amount:</strong> ₹{(discountAmount * quantity).toFixed(2)}</p>

                                                    <p><strong>Tax:</strong> {taxpercent}%</p>
                                                    <p><strong>Tax Amount:</strong> ₹{(taxAmount * quantity).toFixed(2)}</p>
                                                      
                                                    <p><strong>Subtotal:</strong> ₹{((price - discountAmount) * quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <h3 className="fw-bold text-success">
                                                Total: ₹{(quantity * totalPrice).toFixed(2)}
                                            </h3>

                                            {/* Edit Button */}
                                            {/* Uncomment if needed */}
                                          
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted py-5">No order items found.</p>
                    )}


                </div>
      {/* <TableDetails data={data} /> */}
      <ConsumerDetails data={data} taxData={taxData}/>
      {/* {data?.items?.length > 0 ? <SubTable data={data?.sub_orders} /> : null} */}
    </>
  );
};

export default TrackOrderDetails;
