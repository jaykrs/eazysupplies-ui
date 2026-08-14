/**
 * TableDetails Component
 *
 * Renders the order item list inside the order details page for the customer dashboard.
 * This table shows each product with its image, name, unit price, quantity, and subtotal.
 *
 * IMPORTANT:
 * The backend returns "price" as a line total (price × quantity).
 * To avoid doubled values, this component derives:
 *   - unitPrice  = price / quantity
 *   - subtotal   = price (already total from backend)
 *
 * This ensures consistency with checkout calculations and admin order details.
 *
 * @param {Object} props - Component props
 * @param {Object} props.data - Order details object containing "items"
 * @returns {JSX.Element} A responsive table displaying all order items
 *
 * @developer Simran Samir
 * 
 */

import OptimizedImage from "@/components/widgets/OptimizedImage";
import Avatar from '@/components/widgets/Avatar';
import { placeHolderImage } from '@/components/widgets/Placeholder';
import SettingContext from '@/context/settingContext';
import { useContext, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Card, CardBody, Table } from 'reactstrap';

const TableDetails = ({ data }) => {
  const { t } = useTranslation('common');
  const { convertCurrency } = useContext(SettingContext);

  return (
    <>
      <Card className='border-0 dashboard-table'>
        <CardBody className='p-0'>
          <div className="wallet-table">
            <div className='tracking-wrapper table-responsive'>
              <Table className='product-table order-table'>
                <thead>
                  <tr>
                    <th scope='col'>{t('Image')}</th>
                    <th scope='col'>{t('Name')}</th>
                    <th scope='col'>{t('Price')}</th>
                    <th scope='col'>{t('Quantity')}</th>
                    <th scope='col'>{t('Subtotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.length > 0 &&
                    data.items.map((product, i) => {
                      const qty = Number(product.quantity);
                      const subtotal = Number(product.price);
                      const unitPrice = qty > 0 ? subtotal / qty : subtotal;

                      return (
                        <tr key={i}>
                          <td className='product-image'>
                            <OptimizedImage loading="lazy" src={placeHolderImage} height={80} width={80} />
                          </td>

                          <td>
                            <h6>{product?.product?.name}</h6>
                          </td>

                          <td>
                            <h6>{convertCurrency(unitPrice)}</h6>
                          </td>

                          <td>
                            <h6>{qty}</h6>
                          </td>

                          <td>
                            <h6>{convertCurrency(subtotal)}</h6>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default TableDetails;

