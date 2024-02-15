import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import ProgressBox from '@/components/ui/progress-box/progress-box';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
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
import Input from '@/components/ui/input';
import { useIsRTL } from '@/utils/locals';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { clearCheckoutAtom } from '@/contexts/checkout';
import { useOrderStatusesQuery } from '@/data/order-status';
import { data } from 'jquery';
import { log } from 'console';
import { toast } from 'react-toastify';
import { AddingStockFunction, GetFunction } from '@/services/Service';
import { Routes } from '@/config/routes';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [dataArr, setDataArr] = useState<any>([]);
  const [productData, setProductData] = useState<any>();
  const [stockDetail, setStockDetail] = useState<any>([]);
  const [productDetail, setProductDetail] = useState<any>([]);
  const [purchases, setPurchases] = useState<any>([]);
  const [enableLot, setEnableLot] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<any>([]);
  const [locationKeys, setLocationsKeys] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [qtyValues, setQtyValues] = useState({});
  const [unitCost, setUnitCost] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [enablelot, setEnablelot] = useState({});
  const [enableExpiry, setEnableExpiry] = useState({});
  const router = useRouter();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [qty, setQty] = useState(0);

  let form = new FormData();
  const defaultValues = {
    stocks: [],
  };
  const visitedVariations: any = [];

  type FormValues = {
    stocks?: any;
  };
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: defaultValues,
  });

  useEffect(() => {
    GetFunction('/selling-price-group ').then((result) => {
      if (result.success) {
        setLocationsKeys(result.data);
        setLocations(result.locations);
      }
    });

    GetFunction(('/product/' + query.sellingPriceId) as string).then(
      (result) => {
        setProductDetail(result?.data[0]?.variation_options);
        setProductData(result?.data[0]);
        let opttions = result?.data[0]?.variation_options.map((res) => {
          res.group_prices.map((rres, index) => {
            setInputValues((prevState) => ({
              ...prevState,
              [rres.price_group_id +
              '.' +
              rres.variation_id +
              '.' +
              index]: rres,
            }));
          });
        });
        setLoading(false);
      }
    );
  }, []);

  const handleChange = (e, item, variation_id, index) => {
    const value = e.target.value;

    let obj = {
      variation_id: variation_id,
      price_group_id: item.id,
      price_inc_tax: value,
    };
    setInputValues((prevState) => ({
      ...prevState,
      [item.id + '.' + variation_id + '.' + index]: obj,
    }));
  };

  const handleClick = () => {
    router.push('/catalog/products');
  };

  const onSubmit = (values: FormValues) => {
    setCreatingLoading(true);
    AddingStockFunction(
      '/add-selling-price-group',
      Object.values(inputValues)
    ).then((result) => {
      if (result.success) {
        setCreatingLoading(false);
        toast.success(result.message);
        router.push('/catalog/products');
      } else {
        toast.error(result.message);
        setCreatingLoading(false);
      }
    });
  };
  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            Add Selling Price
          </h1>
        </div>
      </Card>

      <div className="mb-10 mt-10">
        <table id="students">
          <thead>
            <tr>
              <th>Product</th>
              {locationKeys.map((location, i) => (
                <th key={i}>{location.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productDetail.map((product) => (
              <tr key={product.id} className="text-body">
                <td>
                  {productData?.name} {product?.name}
                </td>

                {locationKeys?.map((item, key) => (
                  <>
                    <td className="text-body">
                      {item &&
                        productDetail?.map((variation, index) => {
                          if (product.id == variation.id) {
                            return (
                              <div key={index}>
                                <Input
                                  label="Price"
                                  type="number"
                                  {...register(
                                    `stocks.${item}.${variation.id}.${key}`
                                  )}
                                  variant="outline"
                                  className="mb-5"
                                  // value={inputValues[item.id + variation.id,index]}
                                  value={
                                    inputValues[
                                      item.id + '.' + variation.id + '.' + key
                                    ]?.price_inc_tax
                                  }
                                  onChange={(e) =>
                                    handleChange(e, item, variation.id, key)
                                  }
                                />
                              </div>
                            );
                          }
                        })}
                    </td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-4 mt-3 text-end">
          <Button style={{ marginRight: '10px' }} loading={creatingLoading}>
            {t('Save')}
          </Button>
          <Button
            variant="outline"
            onClick={handleClick}
            className="me-4"
            type="button"
          >
            {t('Back')}
          </Button>
        </div>
      </div>
    </form>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
