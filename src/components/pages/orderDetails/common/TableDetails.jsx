import Avatar from '@/components/widgets/Avatar';
import { placeHolderImage } from '@/components/widgets/Placeholder';
import SettingContext from '@/context/settingContext';
import { useContext, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Card, CardBody, Table } from 'reactstrap';

const TableDetails = ({ data }) => {
  const { t } = useTranslation('common');
  const { convertCurrency } = useContext(SettingContext);
  useEffect(() => {
    console.log(data, "popppp")
  }, [])
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
                  {data?.items?.length > 0
                    ? data?.items?.map((product, i) => (
                      <tr key={i}>
                        <td className='product-image'>
                          <img loading="lazy" className={""} src={placeHolderImage} height={80} width={80} alt={product?.name || product?.name || ""} />
                        </td>
                        <td>
                          <h6>{product?.product?.name}</h6>
                        </td>
                        <td>
                          <h6>{convertCurrency(product?.price)}</h6>
                        </td>
                        <td>
                          <h6>{product?.quantity}</h6>
                        </td>
                        <td>
                          <h6>{convertCurrency(product?.price * product?.quantity)}</h6>
                        </td>
                      </tr>
                    ))
                    : null}
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
