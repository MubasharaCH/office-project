import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import React from 'react';
import Loader from '@/components/ui/loader/loader';
import { GetFunction } from '@/services/Service';
import { Table } from '@/components/ui/table';
import { useIsRTL } from '@/utils/locals';
import Card from '@/components/common/card';
import Select from '@/components/ui/select/select';
import cn from 'classnames';
import Label from '@/components/ui/label';
import { selectStyles } from '@/components/ui/select/select.styles';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const query = router.query;
  const [loader, setLoader] = useState(false);
  const [TableLoader, setTableLoader] = useState(false);
  const [data, setData] = useState([]);
  const [StockDetails, setStockDetails] = useState<any>();
  const [locationList, setLocationList] = useState<any>([]);
  const [variationList, setVariationList] = useState<any>([]);

  React.useEffect(() => {
    setLoader(true);
    GetFunction(('/product/' + query.stockHistoryId) as string).then(
      (result) => {
        let locationList = result.data[0].product_locations.map((data, i) => {
          return {
            key: i,
            id: data.id,
            value: data.name,
            label: data.name,
          };
        });
        setLocationList(locationList);
        let variationList = result.data[0].variation_options.map((data, i) => {
          return {
            key: i,
            id: data.id,
            value: data.name,
            label: data.name,
          };
        });
        setVariationList(variationList);

        GetFunction(
          ('/products/stock-history/' +
            query.stockHistoryId +
            '?location_id=' +
            locationList[0].id +
            '&&variation_id=' +
            variationList[0].id) as string
        ).then((result) => {
          if (result.success) {
            setLoader(false);

            setStockDetails(result.data.stock_details);
            setData(result.data.stock_history);
          }
        });
      }
    );
  }, []);
  const { alignLeft, alignRight } = useIsRTL();

  const stockColumns = [
    {
      title: t('form:input-label-type'),
      dataIndex: 'type',
      key: 'stock',
      align: alignLeft,
      render: (type: any, stock: any) => <span>{type}</span>,
    },
    {
      title: t('form:quantity-change'),
      dataIndex: 'quantity_change',
      key: 'stock',
      align: alignLeft,
      render: (product: any, stock: any) => <span>{product}</span>,
    },
    {
      title: t('form:new-quantity'),
      dataIndex: 'stock',
      key: 'stock',
      align: alignLeft,
      render: (stock: any) => <span>{stock}</span>,
    },
    {
      title: t('form:form-title-date'),
      dataIndex: 'date',
      key: 'stock',
      align: alignLeft,
      render: (date: any, stock: any) => <span>{date}</span>,
    },
    {
      title: t('form:refence-no'),
      dataIndex: 'ref_no',
      key: 'ref_no',
      align: alignLeft,
      render: (ref_no: any, stockData: any) => <span>{ref_no}</span>,
    },
  ];
  const onChangeLocationFilter = (e) => {
    setTableLoader(true);
    GetFunction(
      '/products/stock-history/' +
        query.stockHistoryId +
        '?location_id=' +
        e.id +
        '&&variation_id=' +
        variationList[0].id
    ).then((result) => {
      if (result.success) {
        setTableLoader(false);
        setStockDetails(result.data.stock_details);
        setData(result.data.stock_history);
      }
    });
  };
  const onChangeVariationFilter = (e) => {
    setTableLoader(true);
    GetFunction(
      '/products/stock-history/' +
        query.stockHistoryId +
        '?location_id=' +
        locationList[0].id +
        '&&variation_id=' +
        e.id
    ).then((result) => {
      if (result.success) {
        setTableLoader(false);
        setStockDetails(result.data.stock_details);
        setData(result.data.stock_history);
      }
    });
  };
  if (loader) return <Loader text={t('common:text-loading')} />;

  return (
    <div>
      <Card className="mb-8 flex flex-col">
        <div className="mt-5 flex w-full flex-col md:flex-row md:items-center">
          <div
            className={cn(
              'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0'
            )}
          >
            <div className="w-1/2">
              <Label>{t('common:select-business-location')}</Label>
              <Select
                styles={selectStyles}
                options={locationList}
                onChange={onChangeLocationFilter}
                defaultValue={locationList[0]}
              />
            </div>
            {variationList.length > 1 && (
              <div className="w-1/2">
                <Label>{t('Select Veriation')}</Label>
                <Select
                  styles={selectStyles}
                  options={variationList}
                  onChange={onChangeVariationFilter}
                  defaultValue={variationList[0]}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
      <Card className="mb-8 flex flex-col">
        <div className="flex justify-between">
          <Label>
            {t('common:stock')}:
            <span className="text-slate-500">
              {' '}
              {StockDetails?.total_opening_stock}
            </span>
          </Label>
          <Label>
            {t('common:current-stock')}:
            <span className="text-slate-500">
              {' '}
              {StockDetails?.current_stock}
            </span>
          </Label>
        </div>
        <div className="flex mt-5 justify-between">
          <Label>
            {t('common:total-sold')}:
            <span className="text-slate-500"> {StockDetails?.total_sold}</span>
          </Label>
        </div>
      </Card>

      {TableLoader ? (
        <Loader text={t('common:text-loading')} />
      ) : (
        <div className="mb-8 overflow-hidden rounded shadow">
          <Table
            //@ts-ignore
            columns={stockColumns}
            
            emptyText={t('table:empty-table-data')}
            data={data}
            rowKey="id"
            scroll={{ x: 380 }}
          />
        </div>
      )}
    </div>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
