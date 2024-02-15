import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ProgressBox from '@/components/ui/progress-box/progress-box';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import Loader from '@/components/ui/loader/loader';
import ValidationError from '@/components/ui/form-validation-error';
import { Attachment } from '@/types';
import { useDownloadInvoiceMutation, useOrderQuery } from '@/data/order';
import { useUpdateOrderMutation } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SelectInput from '@/components/ui/select-input';
import { useIsRTL } from '@/utils/locals';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useOrderStatusesQuery } from '@/data/order-status';
import { GetFunction } from '@/services/Service';
import { data } from 'jquery';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [dataArr, setDataArr] = useState<any>([]);
  const [productData, setProductData] = useState<any>({});
  const [stockDetail, setStockDetail] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  let businessDetail: any = JSON.parse(
    localStorage.getItem('business_details')!
  );
  let userBusinessDetail: any = JSON.parse(
    localStorage.getItem('user_business_details')!
  );

  let currencySymbol = businessDetail.symbol;
  useEffect(() => {
    setLoading(true);
    GetFunction(
      ('/reports/stock-report?product_id=' + query.productId) as string
    ).then((result) => {
      setStockDetail(result?.data);
    });
    GetFunction(('/product/' + query.productId) as string).then((result) => {
      setDataArr(result.data[0]?.variation_options);
      setProductData(result?.data[0]);

      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: t('table:table-item-variation-name'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span>{name}</span>,
    },
    {
      title: t('table:table-item-default-purchase-price-exc'),
      dataIndex: 'default_purchase_price',
      key: 'name',
      align: alignLeft,
      render: (default_purchase_price: any) => (
        <span>
          {currencySymbol + Number(default_purchase_price)?.toFixed(2)}
        </span>
      ),
    },
    {
      title: t('table:table-item-default-purchase-price-inc'),
      dataIndex: 'dpp_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (dpp_inc_tax: any) => (
        <span>{currencySymbol + Number(dpp_inc_tax)?.toFixed(2)}</span>
      ),
    },
    {
      title: t('table:table-item-x-margin'),
      dataIndex: 'profit_percent',
      key: 'name',
      align: alignLeft,
      render: (profit_percent: any) => <span>{profit_percent}</span>,
    },
    {
      title: t('table:table-item-default-selling-price-exc'),
      dataIndex: 'default_sell_price',
      key: 'name',
      align: alignLeft,
      render: (default_sell_price: any) => (
        <span>{currencySymbol + Number(default_sell_price)?.toFixed(2)}</span>
      ),
    },
    {
      title: t('table:table-item-default-selling-price-inc'),
      dataIndex: 'sell_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (sell_price_inc_tax: any) => (
        <span>{currencySymbol + Number(sell_price_inc_tax)?.toFixed(2)}</span>
      ),
    },
    {
      title: t('table:table-item-variation-img'),
      dataIndex: 'media',
      key: 'name',
      align: alignLeft,
      render: (media: any) => (
        <span className="grid grid-cols-3 ">
          {media?.map((img, index) => (
            <img
              key={index}
              className="h-10 w-10 p-1"
              src={img?.display_url}
              alt="img"
            />
          ))}
          {/* <img className="h-10 w-10" src={media[0]?.display_url} alt="img" /> */}
        </span>
      ),
    },
    /*     {
      title: 'Subtotal',
      dataIndex: 'unit_price_inc_tax',
      key: 'price',
      align: alignRight,
      render: (unit_price_inc_tax: any) => <span>{unit_price_inc_tax}</span>,
    }, */
  ];

  const stockColumns = [
    {
      title: t('table:sku'),
      dataIndex: 'sku',
      key: 'stock',
      align: alignLeft,
      render: (sku: any, stock: any) => <span>{sku}</span>,
    },
    {
      title: t('table:table-item-item'),
      dataIndex: 'product_variation',
      key: 'stock',
      align: alignLeft,
      render: (sku: any, row: any) => (
        <span>{row.product_variation + '(' + row.variation_name + ')'}</span>
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'product',
      key: 'stock',
      align: alignLeft,
      render: (product: any, stock: any) => <span>{product}</span>,
    },
    {
      title: t('table:table-item-location'),
      dataIndex: 'location_name',
      key: 'stock',
      align: alignLeft,
      render: (location_name: any, stock: any) => <span>{location_name}</span>,
    },
    {
      title: t('table:table-item-unit-price'),
      dataIndex: 'unit_price',
      key: 'stock',
      align: alignLeft,

      render: (unit_price: any, stock: any) => (
        <span>{currencySymbol + Number(unit_price)?.toFixed(2)}</span>
      ),
    },
    {
      title: t('table:table-item-current-stock'),
      dataIndex: 'stock',
      key: 'stock',
      align: alignLeft,
      render: (stock: any, stockData: any) => (
        <span>{stock ? stock : '' + Number(stockData?.unit)?.toFixed(2)}</span>
      ),
    },
    {
      title: t('table:table-item-current-stock-value'),
      dataIndex: 'stock',
      key: 'stock',
      align: alignLeft,
      render: (stock: any, stockData: any) => (
        <span>{currencySymbol + stock * Number(stockData?.unit_price)}</span>
      ),
    },
    {
      title: t('table:table-item-total-unit-sold'),
      dataIndex: 'total_sold',
      key: 'stock',
      padding: '0px',
      // align: alignLeft,
      render: (total_sold: any, stockData: any) =>
        total_sold == null ? (
          <span>{'0.00' + stockData.unit}</span>
        ) : (
          <span>{total_sold + Number(stockData?.unit)}</span>
        ),
    },
    {
      title: t('table:table-item-total-unit-transferred'),
      dataIndex: 'total_transfered',
      key: 'stock',
      align: alignLeft,
      render: (total_transfered: any, stockData: any) =>
        total_transfered == null ? (
          <span>{'0.00' + stockData.unit}</span>
        ) : (
          <span>{total_transfered + Number(stockData?.unit)}</span>
        ),
    },
    {
      title: t('table:table-item-total-unit-adjusted'),
      dataIndex: 'total_adjusted',
      key: 'stock',
      align: alignLeft,
      render: (total_adjusted: any, stockData: any) =>
        total_adjusted == null ? (
          <span>{'0.00' + stockData.unit}</span>
        ) : (
          <span>{total_adjusted + Number(stockData?.unit)}</span>
        ),
    },
  ];
  if (loading) return <Loader text={t('common:text-loading')} />;
  // Your columns configuration
  const columnsRackRowPostion = [
    {
      title: t('table:table-item-rack'),
      dataIndex: 'rack', // Match the key to your data
      key: 'rack',
      align: alignLeft,
      render: (rack: any) => <span>{rack}</span>,
    },
    {
      title: t('table:table-item-row'),
      dataIndex: 'row', // Match the key to your data
      key: 'row',
      align: alignLeft,
      render: (row: any) => <span>{row}</span>,
    },
    {
      title: t('table:table-item-postion'),
      dataIndex: 'position', // Match the key to your data
      key: 'position',
      align: alignLeft,
      render: (position: any) => <span>{position}</span>,
    },
  ];
  return (
    <Card>
      <div className="flex flex-col items-center justify-center lg:flex-row">
        <h3 className="mb-8 w-full  whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-10 lg:w-1/3 lg:text-start">
          {t('form:open-product')}
        </h3>
      </div>
      <div className="container m-auto grid gap-4 text-sm lg:grid-cols-4">
        <div>
          <div>
            <span className="font-bold">SKU:</span> {productData?.sku}
          </div>
          <div>
            <span className="font-bold">{t('table:table-item-brand')}:</span>{' '}
            {productData?.brand?.name}{' '}
          </div>
          <div>
            <span className="font-bold">{t('common:unit')}:</span>{' '}
            {productData?.unit?.actual_name}
          </div>
          <div>
            <span className="font-bold">{t('common:barcode-type')}:</span>{' '}
            {productData?.barcode_type}
          </div>
          <div>
            <span className="font-bold">{t('common:available-location')}:</span>{' '}
            {productData?.product_locations[0]?.name}
          </div>
        </div>
        <div>
          <div>
            <span className="font-bold">{t('table:table-item-category')}:</span>{' '}
            {productData?.category?.name}
          </div>
          <div>
            <span className="font-bold">
              {t('table:table-item-sub-category')}:
            </span>{' '}
            {productData?.sub_category?.name}
          </div>
          <div>
            <span className="font-bold">
              {t('table:table-item-manage-stock')}:
            </span>{' '}
            {productData?.enable_stock == 1 ? 'Yes' : 'No'}
          </div>
          {userBusinessDetail?.enable_weight == 1 && (
            <div>
              <span className="font-bold">{t('form:input-label-weight')}:</span>{' '}
              {productData?.weight}
            </div>
          )}
        </div>
        <div>
          <div>
            <span className="font-bold">{t('common:expire-in')}:</span>{' '}
            {productData?.expiry_period}
          </div>
          <div>
            <span className="font-bold">{t('common:application-tax')}:</span>{' '}
            {productData?.product_tax?.name}
          </div>
          <div>
            <span className="font-bold">
              {t('common:selling-price-tax-type')}:
            </span>{' '}
            {productData?.tax_type}
          </div>
          <div>
            <span className="font-bold">{t('common:product-type')}:</span>{' '}
            {productData?.type}
          </div>
        </div>
        <div>
          <img src={productData?.image_url} alt="img" />
        </div>
      </div>
 
      <div className="mb-10 mt-10">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={dataArr}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      </div>
      {userBusinessDetail?.subscriptions[0]?.enable_product_position && (
        <div className="mb-10 mt-10">
          <Table
            //@ts-ignore
            columns={columnsRackRowPostion}
            emptyText={t('table:empty-table-data')}
            data={productData?.rack_details}
            rowKey="id"
            scroll={{ x: 300 }}
          />
        </div>
      )}
      {productData?.enable_stock === 1 ? (
        <div className=" ">
          <span className="p-4 font-semibold ">
            {t('table:item-product-stock-detail')}
          </span>
          <div className="mb-10 mt-10">
            <Table
              //@ts-ignore
              columns={stockColumns}
              emptyText={t('table:empty-table-data')}
              data={stockDetail}
              rowKey="id"
              scroll={{ x: 300 }}
            />
          </div>
        </div>
      ) : null}
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
