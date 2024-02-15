import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { selectStyles } from '../ui/select/select.styles';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import Label from '@/components/ui/label';
import { useState } from 'react';
import moment from 'moment';
import Select from 'react-select';
import { useEffect } from 'react';
import TextArea from '@/components/ui/text-area';
import Search from '../common/Newearch';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import { useCart } from '@/contexts/quick-cart/cart.context';
import CartItem from '../cart/stock-cart';
import FormData from 'form-data';

import {
  AddingSellFunction,
  AddingFunction,
  GetFunction,
  ShareOrder,
  site_url,
  UpdatingSellFunction,
  AddingStockFunction,
  AddingStockTranfFunction,
} from '@/services/Service';
let form = new FormData();

const defaultValues = {
  shipping_charges: 0,
};
type FormValues = {
  transaction_date: any;
  ref_no: any;
  shipping_charges: any;
  additional_notes: any;
};

export default function CreateOrUpdateTypeForm(initialValues: any) {
  const { items, resetCart, resetPaymentCart } = useCart();
  const [transaction_date, setTransaction_date] = useState();
  const [ref_no, setRef_no] = useState();
  const [shipping_charges, setShipping_charges] = useState();
  const [additional_notes, setAdditional_notes] = useState();
  const [creatingLoading, setCreatingLoading] = useState(false);
  // const[isEnableLot,setIsEnableLot]=useState(false)
  const router = useRouter();
  const { t } = useTranslation();


  
  React.useEffect(() => {
  
    resetCart();
    resetPaymentCart();
  }, []);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });

  React.useEffect(() => {
    if (items.length === 0) {
      setBalance('');
      setNewBalance('');
      resetCart();
      resetPaymentCart();
    }
  }, [items]);

  useEffect(() => {
    GetFunction('/stock-transfer/create').then((result) => {
      let locationsData = Object.entries(result.data.business_locations).map(
        (data, i) => {
          return {
            key: data[0],
            id: data[0],
            value: data[1],
            label: data[1],
          };
        }
      );

      setLocationDataArray(locationsData);

      let statusesData = Object.entries(result.data.statuses).map((data, i) => {
        return {
          key: data[0],
          id: data[0],
          value: data[1],
          label: data[1],
        };
      });

      setStatusesArray(statusesData);
    });
  }, []);

  let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const [LocationDataArray, setLocationDataArray] = React.useState<any[]>([]);
  const [LocationValFrom, setLocationFrom] = useState<any>();
  const [LocationValTo, setLocationTo] = useState<any>([]);
  const [StatusesArray, setStatusesArray] = useState<any>([]);
  const [Status, setStatus] = useState<any>();
  const [openDrawer, setOpenDrawer] = useState<any>(false);
  const [ListDataSearch, setListDataSearch] = useState<any>([]);
  const [newArr, setNewArr] = useState<any>([]);
  const [checked, setChecked] = useState<any>([]);
  const [newBalance, setNewBalance] = useState<any>('');
  const [locationID, setLocationID] = useState<any>();
  const [testArr, setTestArr] = useState<any>([]);
  const [loadingData, setloadingData] = useState(false);
  const [metaDataProduct, setMetaDataProduct] = useState<any>();
  const [OpenProduct, setOpenProduct] = useState<any>();
  const [balance, setBalance] = useState<any>();
  const [shreLoading, setShreLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState<any>([]);
  const [currency, setCurrency] = React.useState<any>();

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  React.useEffect(() => {
    setloadingData(true);
    GetFunction('/product?location_id=' + LocationValFrom?.id).then(
      (result) => {
        setMetaDataProduct(result.meta);
        resetCart();
        resetPaymentCart();
        setloadingData(false);
      }
    );
  }, [LocationValFrom?.id]);
  React.useEffect(() => {
    if (metaDataProduct != undefined) {
      setloadingData(true);
      GetFunction(
        '/product?per_page=' +
          metaDataProduct?.total +
          '&location_id=' +
          LocationValFrom?.id
      ).then((result) => {
        setMetaDataProduct(result.meta);
        let newvariable = result?.data.slice(1);
        setOpenProduct(result?.data[0]);
        let abc: any = [];
        newvariable?.map((data, i) => {
          data?.variation_options.map((res, i) => {
            let variationName = res.name == 'DUMMY' ? '' : '-' + res.name;
            let tax_id = data?.product_tax ? data?.product_tax?.id : '';

            let aaa = data?.product_tax?.amount ? data?.product_tax?.amount : 0;
            let tax_amount =
              res.default_sell_price * (1 + aaa / 100) - res.default_sell_price;

            let newObj = {
              key: i,
              id: res.id,
              productId: data.id,
              variationsId: res.id,
              name: data.name + variationName + ' (' + data.sku + ')',
              image: res.media.length
                ? res.media[0].display_url
                : data.image_url,
              product_tax_id: tax_id,
              product_tax: tax_amount,
              product_tax_calculate: aaa,
              product_tax_percentage: aaa,
              enable_stock: data.enable_stock,
              price: res.sell_price_inc_tax,
              unit_price: res.default_sell_price,
              variation_location_details: res.variation_location_details,
            };
            abc.push(newObj);
            return newObj;
          });
        });

        setNewArr(abc);
        setTestArr(abc);
        setListDataSearch(abc);
      });
    }
  }, [metaDataProduct?.total]);
  const filterBySearch = (event) => {
    setOpenDrawer(true);
    // GetFunction('/product?location_id='+LocationValFrom.id).then((result) => {

    //     console.log("product with location",result);
    //     console.log("location id",LocationValFrom.id);

    //     setMetaDataProduct(result.meta);
    //     setloadingData(false);
    //   });
  };
  const closeFunction = () => {
    setChecked([]);
    setOpenDrawer(false);
    setNewArr(ListDataSearch);
  };
  const locationFromOnChange = (selectedOption) => {
    // Add the previously selected option back to the options array
    if (LocationValFrom) {
      setLocationDataArray((prevState) => [...prevState, LocationValFrom]);
    }
    // Remove the selected option from the options array
    setLocationDataArray((prevState) =>
      prevState.filter((option) => option.id !== selectedOption.id)
    );
    setLocationFrom(selectedOption);
  };
  const locationToOnChange = (selectedOption) => {
    // Add the previously selected option back to the options array
    if (LocationValTo) {
      setLocationDataArray((prevState) => [...prevState, LocationValTo]);
    }
    // Remove the selected option from the options array
    setLocationDataArray((prevState) =>
      prevState.filter((option) => option.id !== selectedOption.id)
    );
    setLocationTo(selectedOption);
  };

  useEffect(() => {
    // Reset the location data array when a new location is selected
    setLocationDataArray(LocationDataArray);
  }, [LocationValFrom, LocationValTo]);
  const StatusOnChange = (e) => {
    setStatus(e.id);
  };

  const onSubmit = () => {
    setCreatingLoading(true);
    let productsArr: any = [];
    items.map((item: any) => {
      productsArr.push({
        product_id: item.productId,
        variation_id: item.variationsId,
        enable_stock: item.enable_stock,
        quantity: item.quantity,
        unit_price: item.unit_price,
        price: item.price,
        lot_no_line_id:item.lotNumber
      });
    });
    // console.log(productsArr);
    // form.append('products', productsArr.length ? JSON.stringify(productsArr) : '');
    // form.append('transaction_date', transaction_date);
    // form.append('additional_notes', additional_notes);
    // form.append('ref_no', ref_no);
    // form.append('shipping_charges', shipping_charges);
    // form.append('status', Status.id ? Status.id : '');
    // form.append('location_id', LocationValFrom ? LocationValFrom.id : '');
    // form.append(
    //   'transfer_location_id',
    //   LocationValTo.id ? LocationValTo.id : ''
    // );
    // form.append('final_total', getTaxableAmount(items).toFixed(2));

    let formData = {
      products: productsArr.length ? productsArr : '',
      transaction_date: currentDate,
      additional_notes: additional_notes,
      ref_no: ref_no,
      shipping_charges: shipping_charges,
      status: Status ? Status : '',
      location_id: LocationValFrom ? LocationValFrom.id : '',
      transfer_location_id: LocationValTo.id ? LocationValTo.id : '',
      final_total: getTaxableAmount(items).toFixed(2),
    };
    AddingStockTranfFunction('/stock-transfer/store', formData).then(
      (result) => {
        if (result.success == 1) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(result?.message);
          setCreatingLoading(false);
        }
      }
    );
  };
  const modalfilterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...ListDataSearch];
    let searchLower = query.toLowerCase();
    let filtered = updatedList.filter((list) => {
      if (list.name.toLowerCase().includes(searchLower)) {
        return true;
      }
    });
    setNewArr(filtered);
  };
  function getTaxableAmount(array) {
    let value: any = 0;
    array.map((re) => {
      let unitValue =
        (Number(re.unit_price) - Number(re.discount)) * re.quantity;

      value = value + unitValue;
    });
    return value;
  }
  const onDecFun = (q) => {
    if (newBalance != '') {
      let newVar = Math.round(balance) - Math.round(q);
      setBalance(newVar);
      setNewBalance(newVar);
    }
  };

  const onIncFun = (q) => {
    if (newBalance != '') {
      let newVar = Math.round(balance) + Math.round(q);
      setBalance(newVar);
      setNewBalance(newVar);
    }
  };
  const {
    addItemToCart,
    addPaymentToCart,
    clearPaymentItemFromCart,
  } = useCart();
  const onAddHandler = () => {
    const array = ListDataSearch;
    checked.map((res) => {
      const object = array.find((obj) => obj.id == res);
      if (object.enable_stock == 1) {
        if (object.variation_location_details.length > 0) {
          object.variation_location_details.map((inner_res) => {
            if (
              inner_res.variation_id == object.variationsId &&
              inner_res.location_id == LocationValFrom.id
            ) {
              if (inner_res.qty_available < 1) {
                toast.error(object.name + t('common:out-of-stock'), {
                  autoClose: 5000,
                });
              } else {
                object.product_qty = inner_res.qty_available;
                object.discount = 0;
                if (newBalance != '') {
                  let newVar =
                    Math.round(newBalance) + Math.round(object?.price);
                  setNewBalance(newVar);
                  setBalance(newVar);
                }
                addItemToCart(object, 1);
              }
            }
            // else {
            //   toast.error(
            //     'No Product was Found Against the Selected Location',
            //     {
            //       autoClose: 5000,
            //     }
            //   );
            // }
          });
        } else {
          toast.error(object.name + t('common:out-of-stock'), {
            autoClose: 5000,
          });
        }
      } else {
        object.discount = 0;
        if (newBalance != '') {
          let newVar = Math.round(newBalance) + Math.round(object?.price);
          setNewBalance(newVar);
          setBalance(newVar);
        }
        addItemToCart(object, 1);
      }
    });
    setOpenDrawer(false);
    setNewArr(testArr);
    setChecked([]);
  };

  const onCrossAmount = (amont) => {
    let newAmount = Math.round(balance) + Math.round(amont);
    setBalance(newAmount);
    setNewBalance(newAmount);
  };
  const handleSelect = (event) => {
    setChecked([]);
    const value = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setChecked([...checked, value]);
    } else {
      const filteredList = checked.filter((item) => item !== value);
      setChecked(filteredList);
    }
  };

  const onChangetransaction_date = (e) => {
    setTransaction_date(e.target.value);
  };
  const onChangesetRef_no = (e) => {
    setRef_no(e.target.value);
  };
  const onChangeShipping_charges = (e) => {
    setShipping_charges(e.target.value);
  };
  const onChangeAdditional_notes = (e) => {
    setAdditional_notes(e.target.value);
  };
  // console.log(items,'item');
  return (
    <div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-date')}
            {...register('transaction_date')}
            variant="outline"
            className="mb-4"
            readOnly
            value={currentDate}
            onChange={onChangetransaction_date}
          />

          <Input
            label={t('form:input-label-reference-no')}
            {...register('ref_no')}
            type="number"
            variant="outline"
            className="mb-4"
            onChange={onChangesetRef_no}
          />
          <Label>{t('form:input-label-location-from')}</Label>
          <Select
            className="mb-4"
            styles={selectStyles}
            name="location_id"
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            options={LocationDataArray}
            value={LocationValFrom}
            onChange={locationFromOnChange}
          />
          <Label>{t('form:input-label-location-to')}</Label>
          <Select
            className="mb-4"
            styles={selectStyles}
            name="transfer_location_id"
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            options={LocationDataArray}
            value={LocationValTo}
            onChange={locationToOnChange}
          />
          <Label>{t('form:input-label-status')}</Label>
          <Select
            className="mb-4"
            styles={selectStyles}
            name="status"
            // getOptionLabel={(option: any) => option.label}
            // getOptionValue={(option: any) => option.id}
            options={StatusesArray}
            // value={Status}
            onChange={StatusOnChange}
          />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:search-product')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Label>{t('form:input-label-products')}</Label>
          <div className="w-full">
            <div onClick={filterBySearch} className="">
              <Search readOnly={true} onChangeearchVal={filterBySearch} />
            </div>
          </div>

          <Drawer open={openDrawer} onClose={closeFunction} variant="right">
            <DrawerWrapper onClose={closeFunction} hideTopBar={false}>
              <div className="m-auto rounded bg-light sm:w-[28rem]">
                <div className="p-4">
                  <Label>{t('form:input-label-all-products')}</Label>
                  <Search
                    onChangeearchVal={modalfilterBySearch}
                    className="pb-3"
                  />
                  <div className="pb-20">
                    {newArr?.map((res: any, index: any) => (
                      <div
                        key={index}
                        className="grid grid-cols-6 gap-4 border-t-2 p-5"
                      >
                        <div className="col-span-5">
                          <div className="flex">
                            <div key={index}>
                              <input
                                className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                                type="checkbox"
                                name={res.name}
                                id={res.id}
                                onChange={handleSelect}
                              />
                            </div>
                            <label htmlFor={res.id}>
                              {res.name}
                              <br />
                              Price:{Math.round(res.price)}
                            </label>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    <button
                      className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                      onClick={onAddHandler}
                    >
                      <div className="flex-1 pt-3 text-center text-light">
                        {t('common:add-product')}
                      </div>
                    </button>
                  </footer>
                </div>
              </div>
            </DrawerWrapper>
          </Drawer>
          <div className="pt-5">
            {items?.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                onCrossIcoDecPress={() => onDecFun(item.price)}
                onCrossIcoIncPress={() => onIncFun(item.price)}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:total-amount')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-3 flex justify-between">
            <div className="text-sm">{t('common:total-amount')}</div>
            <div className="text-sm">
              {getTaxableAmount(items).toFixed(2) + currency?.symbol}
            </div>
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-additional-information')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-shipping-charges')}
            {...register('shipping_charges')}
            type="number"
            variant="outline"
            className="mb-4"
            onChange={onChangeShipping_charges}
          />

          <TextArea
            label={t('form:input-label-additional-note')}
            {...register('additional_notes')}
            variant="outline"
            className="col-span-2"
            onChange={onChangeAdditional_notes}
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        {initialValues.initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        <Button onClick={onSubmit} loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:update-stock-transfer')
            : t('common:add-stock-transfer')}
        </Button>
      </div>
    </div>
  );
}
