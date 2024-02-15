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
export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  const [dataArr, setDataArr] = useState<any>([]);
  const [productData, setProductData] = useState<any>();
  const [stockDetail, setStockDetail] = useState<any>([]);
  const [productDetail, setProductDetail] = useState<any>([]);
  const [purchases, setPurchases] = useState<any>([]);
  const [loading, setLoading] = useState(false);
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
  let businessDetail: any = JSON.parse(
    localStorage.getItem('business_details')!
  );
  let currencySymbol = businessDetail.symbol;
  let subtotal = 0;
  let purchase = purchases;

  useEffect(() => {
    setLoading(true);
    GetFunction(
      ('/reports/stock-report?product_id=' + query.productId) as string
    ).then((result) => {
      setStockDetail(result?.data);
    });

    GetFunction(('/opening-stock/add/' + query.productId) as string).then(
      (result) => {
        if (result.locations) {
          setLocationsKeys(Object.keys(result.locations));
          setLocations(result.locations);
        }

        if (result.product) {
          setProductDetail(result?.product?.variation_options);
        }
        if (result.purchases) {
          setPurchases(result?.purchases);
        }
        setEnablelot(result?.enable_lot);
        setEnableExpiry(result.enable_expiry);
      }
    );
    GetFunction(('/product/' + query.productId) as string).then((result) => {
      setDataArr(result.data[0]?.product_variations[0]?.variations);
      setProductData(result?.data[0]);
      setLoading(false);
    });
  }, []);
  const newInputValues = { ...inputValues };

  useEffect(() => {
    locationKeys.forEach((item) => {
      productDetail.forEach((variation, index) => {
        const newPurchases = { ...purchases };
        if (!purchases[item] || !purchases[item][variation.id]) {
          newPurchases[item] = { ...newPurchases[item] };
          newPurchases[item][variation.id] = [
            {
              quantity: 0,
              purchase_price: variation.default_purchase_price,
              purchase_line_id: null,
              lot_number: null,
            },
          ];
        }
        newPurchases[item][variation.id].forEach((vars, sub_key) => {
          const purchaseLineId = vars.purchase_line_id;
          let productQty = vars.quantity;
          let purchasePrice = vars.purchase_price;
          newInputValues[item + index + 'qty'] = productQty;
          newInputValues[item + index + 'price'] = purchasePrice;
        });
      });
    });
    setInputValues(newInputValues);
  }, [locationKeys, productDetail, purchases]);

  const handleChange = (e, item, sub_key, type) => {
    const value = e.target.value;
    if (value === '') {
      setInputValues((prevState) => {
        const newState = { ...prevState };
        delete newState[item + sub_key + type];
        return newState;
      });
    } else {
      setInputValues((prevState) => ({
        ...prevState,
        [item + sub_key + type]: value,
      }));
    }
  };

  if (loading) return <Loader text={t('common:text-loading')} />;

  const columns = [
    {
      title: t('table:table-item-default-purchase-price-exc'),
      dataIndex: 'default_purchase_price',
      key: 'name',
      align: alignLeft,
      render: (name: any) => <span>{name}</span>,
    },
    {
      title: t('table:table-item-default-purchase-price-inc'),
      dataIndex: 'dpp_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (dpp_inc_tax: any) => <span>{dpp_inc_tax}</span>,
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
      render: (default_sell_price: any) => <span>{default_sell_price}</span>,
    },
    {
      title: t('table:table-item-default-selling-price-inc'),
      dataIndex: 'sell_price_inc_tax',
      key: 'name',
      align: alignLeft,
      render: (sell_price_inc_tax: any) => <span>{sell_price_inc_tax}</span>,
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
        <span>{currencySymbol + unit_price}</span>
      ),
    },
    {
      title: t('table:table-item-current-stock'),
      dataIndex: 'stock',
      key: 'stock',
      align: alignLeft,
      render: (stock: any, stockData: any) => (
        <span>{stock + stockData.unit}</span>
      ),
    },
    {
      title: t('table:table-item-current-stock-value'),
      dataIndex: 'stock',
      key: 'stock',
      align: alignLeft,
      render: (stock: any, stockData: any) => (
        <span>{currencySymbol + stock * stockData?.unit_price}</span>
      ),
    },
    {
      title: t('table:table-item-total-unit-sold'),
      dataIndex: 'total_sold',
      key: 'stock',
      align: alignLeft,
      render: (total_sold: any, stockData: any) =>
        total_sold == null ? (
          <span>{'0.00' + stockData.unit}</span>
        ) : (
          <span>{total_sold + stockData.unit}</span>
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
          <span>{total_transfered + stockData.unit}</span>
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
          <span>{total_adjusted + stockData.unit}</span>
        ),
    },
  ];

  const onSubmit = (values: FormValues) => {
    const stocksData: any = {};
    stocksData['product_id'] = productData?.id;

    stocksData['stocks'] =
      values.stocks &&
      Object.keys(values.stocks).reduce((acc, item) => {
        acc[item] = Object.keys(values.stocks[item]).reduce(
          (innerAcc, variationId) => {
            const keys = Object.keys(values.stocks[item][variationId]);
            innerAcc[variationId] = keys.map((key) => ({
              quantity: values.stocks[item][variationId][key].quantity,
              purchase_price:
                values.stocks[item][variationId][key].purchase_price,
              purchase_line_id:
                values.stocks[item][variationId][key].purchase_line_id,
            }));
            return innerAcc;
          },
          {}
        );
        return acc;
      }, {});

    if (stocksData) {
      setCreatingLoading(true);
      AddingStockFunction('/opening-stock/save', stocksData).then((result) => {
        if (result.success) {
          setCreatingLoading(false);
          toast.success(t('common:successfully-created'));
          router.back();
        } else {
          toast.error(result.message);
          setCreatingLoading(false);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <div className="flex flex-col items-center justify-center lg:flex-row">
          <h3 className="mb-8 w-full  whitespace-nowrap text-center text-2xl font-semibold text-heading lg:mb-10 lg:w-1/3 lg:text-start">
            Add Opening Stock
          </h3>
        </div>
      </Card>

      <div className="mb-10 mt-10">
        <Card>
          <table id="students">
            <thead>
              <tr>
                <th>Product</th>
                {locationKeys.map((location) => (
                  <th key={location}>{locations[location]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productDetail.map((product) => (
                <tr key={product.id} className="text-body">
                  <td>
                    {' '}
                    {productData.name} {product.name}
                  </td>

                  {locationKeys?.map((item, key) => (
                    <>
                      <td className="text-body">
                        {item &&
                          productDetail?.map((variation, index) => {
                            if (product.id == variation.id) {
                              var newPurchases = { ...purchases };
                              // purchase = purchases;
                              if (
                                !purchases[item] ||
                                !purchases[item][variation.id]
                              ) {
                                newPurchases[item] = {
                                  ...newPurchases[item],
                                };
                                newPurchases[item][variation.id] = [
                                  {
                                    quantity: 0,
                                    purchase_price:
                                      variation.default_purchase_price,
                                    purchase_line_id: null,
                                    lot_number: null,
                                  },
                                ];
                              }
                              newPurchases = newPurchases
                                ? newPurchases
                                : purchases;
                              return newPurchases[item][variation.id].map(
                                (vars, sub_key) => {
                                  let purchase_line_id = vars.purchase_line_id;

                                  // let product_qty = inputValues[item + index + 'qty'] || vars.quantity;
                                  // let purcahse_price = inputValues[item + index + 'price'] || vars.purchase_price;

                                  let row_total =
                                    inputValues[item + index + 'qty'] *
                                    inputValues[item + index + 'price'];

                                  subtotal += row_total;
                                  let lot_number = vars['lot_number'];
                                  let variation_name;
                                  if (productData.type == 'variable') {
                                    variation_name = variation?.name;
                                  } else {
                                    variation_name = variation.name;
                                  }
                                  return (
                                    <>
                                      <input
                                        type="hidden"
                                        {...register(
                                          `stocks.${item}.${variation.id}.${sub_key}.purchase_line_id`
                                        )}
                                        // name={'stocks[' +item + '][' + variation.id + '][' + sub_key + '][purchase_line_id]'}
                                        value={purchase_line_id}
                                        // value={initialValues?.variation_options[index]['id']}
                                      />
                                      {/* <input
                   type="hidden"
                   {...register(`stocks.${item}.${variation.id}.${sub_key}.purchase_price`)}
                   value={purcahse_price}
                   // value={initialValues?.variation_options[index]['id']}
                 /> */}
                                      <input
                                        type="hidden"
                                        {...register(
                                          `stocks.${item}.${variation.id}.${sub_key}.exp_date`
                                        )}
                                        value={vars?.exp_date}
                                        // value={initialValues?.variation_options[index]['id']}
                                      />
                                      <Input
                                        type="number"
                                        {...register(
                                          `stocks.${item}.${variation.id}.${sub_key}.quantity`
                                        )}
                                        // name={'stocks[' +item + '][' + variation.id + '][' + sub_key + '][quantity]'}
                                        variant="outline"
                                        className="mb-5"
                                        value={
                                          inputValues[item + index + 'qty']
                                        }
                                        onChange={(e) =>
                                          handleChange(e, item, index, 'qty')
                                        }
                                      />

                                      <Input
                                        {...register(
                                          `stocks.${item}.${variation.id}.${sub_key}.purchase_price`
                                        )}
                                        type="hidden"
                                        // name={'stocks[' +item + '][' + variation.id + '][' + sub_key + '][purchase_price]'}
                                        variant="outline"
                                        className="mb-5"
                                        value={
                                          inputValues[item + index + 'price']
                                        }
                                        onChange={(e) =>
                                          handleChange(e, item, index, 'price')
                                        }
                                      />
                                    </>
                                  );
                                }
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
        </Card>

        <div className="mb-4 mt-3 text-end">
          <Button style={{ marginRight: '10px' }} loading={creatingLoading}>
            {t('Save')}
          </Button>
          <Button
            variant="outline"
            onClick={router.back}
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
