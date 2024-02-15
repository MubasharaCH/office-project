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
import { Table } from '@/components/ui/table';
import { useIsRTL } from '@/utils/locals';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { DeleteOutlined } from '@ant-design/icons';
import { unset } from 'lodash';

import {
  AddingSellFunction,
  AddingFunction,
  GetFunction,
  ShareOrder,
  site_url,
  UpdatingSellFunction,
  AddingStockFunction,
  AddingStockTranfFunction,
  AddingUserFunction,
} from '@/services/Service';
import Loader from '../ui/loader/loader';
let form = new FormData();

const defaultValues = {
  shipping_charges: 0,
};
type FormValues = {
  transaction_date: any;
  ref_no: any;
  total_amount_recovered: any;
  reason: any;
  additional_notes: any;
};

export default function CreateOrUpdateTypeForm(initialValues: any) {
  // console.log('initalvalues',initialValues);
  const { items, resetCart, resetPaymentCart } = useCart();
  const [transaction_date, setTransaction_date] = useState();
  const [ref_no, setRef_no] = useState();
  const [shipping_charges, setShipping_charges] = useState();
  const [additional_notes, setAdditional_notes] = useState();
  const [amount_recovered, setAmount_recovered] = useState();
  const [creatingLoading, setCreatingLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const [metaData, setMetaData] = useState<any>();
  const [LotModal, setLotModal] = useState<any>(false);
  const [lotNumberArray, setLotNumberArray] = useState<any>([]);
  const [lotNumber, setLotNumber] = useState<any>([]);
  const [tableArray, setTableArray] = useState<any>([]);
  const [inputValues, setInputsValues] = useState<any>([
    {
      product_id: '',
      variation_id: '',
      location_id: '',
      unit_price: '',
      quantity: '',
    },
  ]);
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
  const adjustmentDefault = [
    {
      label: initialValues.initialValues?.adjustment_type
        ? initialValues.initialValues?.adjustment_type.toUpperCase()
        : initialValues.initialValues?.adjustment_type,
    },
  ];

  React.useEffect(() => {
    const updatedInputValues = tableArray.map((ress, index) => {
      let qty = inputValues[index]?.updated_stock
        ? inputValues[index]?.updated_stock
        : ress?.variation_location_details[0]?.qty_available;

      return {
        ...inputValues[index],
        product_id: ress?.variation_location_details[0]?.product_id,
        variation_id: ress?.variation_location_details[0]?.variation_id,
        location_id: ress?.variation_location_details[0]?.location_id,
        quantity: qty,
        unit_price: ress.price,
      };
    });
    // console.log(updatedInputValues, 'table table');
    setInputsValues(updatedInputValues);
    // setFinalArray(tableArray);
  }, [tableArray]);
  React.useEffect(() => {
    const fetchData = async () => {
      const lotArray: any = [];

      for (const item of tableArray) {
        const obj = {
          product_id: item.productId,
          variation_id: item.variationsId,
        };

        try {
          const result = await AddingUserFunction('/purchase/lot-numbers', obj);
          const ordersData: any = result.data.map((data, i) => ({
            key: i,
            id: data.id,
            value: data.lot_number,
            label: data.lot_number,
          }));

          lotArray.push(ordersData);
        } catch (error) {
          // Handle error if necessary
        }
      }

      setLotNumberArray(lotArray);
    };

    fetchData();
  }, [tableArray]);
  // console.log(lotNumberArray,'lot number');
  useEffect(() => {
    if (initialValues.initialValues?.additional_notes) {
      setAdditional_notes(initialValues.initialValues?.additional_notes);
    }
    if (initialValues.initialValues?.adjustment_type) {
      setAdjustmentType(initialValues.initialValues?.adjustment_type);
    }
    // console.log('adjustment lines',initialValues.initialValues?.stock_adjustment_lines);
    if (initialValues.initialValues?.stock_adjustment_lines) {
      const updatedColumnData = { ...columnData };
      // const tableObject = {};
      let checked_variation = initialValues.initialValues?.stock_adjustment_lines.map(
        (data, i) => {
          // if(tableObject[i]){
          //   tableObject[i]['name'] = data?.variation?.product.name + data.variation.name + '('+ data.variation_id + ')';
          //   tableObject[i]['id'] = data?.variation_id;
          //   tableObject[i]['unit_price'] = data?.unit_price;
          //   tableObject[i]['quantity'] = data?.quantity;
          // }
          if (updatedColumnData[data.variation_id]) {
            updatedColumnData[data.variation_id]['quantity'] = data.quantity;
            updatedColumnData[data.variation_id]['product_id'] =
              data.product_id;
            updatedColumnData[data.variation_id]['variation_id'] =
              data.variation_id;
            updatedColumnData[data.variation_id]['unit_price'] =
              data.unit_price;
          } else {
            updatedColumnData[data.variation_id] = {
              ['quantity']: data.quantity,
              ['product_id']: data.product_id,
              ['variation_id']: data.variation_id,
              ['unit_price']: data.unit_price,
            };
          }
          return `${data.variation_id}`;
        }
      );
      setChecked(checked_variation);
    }
  }, [initialValues]);

  let currentDate = initialValues?.transaction_date
    ? initialValues?.transaction_date
    : moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const [LocationDataArray, setLocationDataArray] = React.useState<any[]>([]);
  const [
    DefaultLocationDataArray,
    setDefaultLocationDataArray,
  ] = React.useState<any[]>([]);
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
  const [loadingData, setloadingData] = useState(true);
  // const [metaDataProduct, setMetaDataProduct] = useState<any>('');
  const [OpenProduct, setOpenProduct] = useState<any>();
  const [balance, setBalance] = useState<any>();
  const [shreLoading, setShreLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState<any>([]);
  const [currency, setCurrency] = React.useState<any>();
  const [adjustmentType, setAdjustmentType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRowIndex, setSelectedRowIndex] = useState<any>(null);
  const [isEnableLot, setIsEnableLot] = useState(false);
  const [columnData, setColumnData] = useState<any>({}); // State to store column data
  const { alignLeft, alignRight, isRTL } = useIsRTL();
  let business_details: any = JSON.parse(
    localStorage.getItem('user_business_details')!
  );

  React.useEffect(() => {
    setIsEnableLot(business_details?.enable_lot_number == 1 ? true : false);
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
    setloadingData(false);
  }, []);

  const filterBySearch = (event) => {
    setOpenDrawer(true);
  };
  const closeFunction = () => {
    setChecked([]);
    setOpenDrawer(false);
  };
  React.useEffect(() => {
    setloadingData(true);

    GetFunction('/business-location').then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
        };
      });
      setLocationDataArray(ordersData);
      setDefaultLocationDataArray(ordersData[0]?.name);
      if (initialValues.initialValues?.location_id) {
        setLocationID(initialValues.initialValues.location_id);
      } else {
        setLocationID(ordersData[0]?.id);
      }
      setLoading(false);
      setloadingData(false);
    });
  }, []);

  const getProductFunction = (locationID) => {
    GetFunction('/product?location_id=' + locationID + '&per_page=-1').then(
      (result) => {
        // setMetaDataProduct(result.meta);
        let newvariable: any = result?.data?.filter(
          (item) => item.sku !== 'IS-OP-SKU'
        );

        let abc: any = [];
        newvariable?.map((data, index) => {
          data?.variation_options.map((res, i) => {
            let variationName = res.name == 'DUMMY' ? '' : '-' + res.name;
            let tax_id = data?.product_tax ? data?.product_tax?.id : '';

            let aaa = data?.product_tax?.amount ? data?.product_tax?.amount : 0;
            let tax_amount =
              res.default_sell_price * (1 + aaa / 100) - res.default_sell_price;
            const final_Variation = res.variation_location_details.filter(
              (item) => {
                return item.location_id == locationID;
              }
            );
            let productLocation = res.variation_location_details.length
              ? ' (' + final_Variation[0]?.location_id + ')'
              : '';
            let newObj = {
              key: index,
              id: res.id,
              productId: data.id,
              variationsId: res.id,
              name: data.name + variationName + productLocation,
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
              variation_location_details: final_Variation,
            };
            abc.push(newObj);
            return newObj;
          });
        });

        setNewArr(abc);
        setListDataSearch(abc);
      }
    );
    // }
  };

  React.useEffect(() => {
    getProductFunction(locationID);
  }, [locationID]);

  const onSubmit = () => {
    setCreatingLoading(true);
    // const finalArray = inputValues.map((item) => {
    //   return {
    //     product_id: item.product_id,
    //     variation_id: item.variation_id,
    //     location_id: item.location_id,
    //     unit_price: item.unit_price,
    //     quantity: item.updated_stock,

    //   }
    // })
    let formData = {
      location_id: locationID ? locationID : '',
      transaction_date: currentDate,
      ref_no: ref_no,
      additional_notes: additional_notes,
      adjustment_type: adjustmentType ? adjustmentType : '',
      total_amount_recovered: amount_recovered ? amount_recovered : 0,
      products: inputValues,
    };
    AddingStockTranfFunction('/stock-adjustments/store', formData).then(
      (result) => {
        if (result.success == true) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else if (result.success == false) {
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
  // function getTaxableAmount(array) {
  //   let value: any = 0;
  //   array.map((re) => {
  //     let unitValue =
  //       (Number(re.unit_price) - Number(re.discount)) * re.quantity;

  //     value = value + unitValue;
  //   });
  //   return value;
  // }
  // const onDecFun = (q) => {
  //   if (newBalance != '') {
  //     let newVar = Math.round(balance) - Math.round(q);
  //     setBalance(newVar);
  //     setNewBalance(newVar);
  //   }
  // };

  // const onIncFun = (q) => {
  //   if (newBalance != '') {
  //     let newVar = Math.round(balance) + Math.round(q);
  //     setBalance(newVar);
  //     setNewBalance(newVar);
  //   }
  // };
  const {
    addItemToCart,
    addPaymentToCart,
    clearPaymentItemFromCart,
  } = useCart();

  // const onCrossAmount = (amont) => {
  //   let newAmount = Math.round(balance) + Math.round(amont);
  //   setBalance(newAmount);
  //   setNewBalance(newAmount);
  // };
  const handleSelect = (event) => {
    setChecked([]);
    const value = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setChecked([...checked, value]);
      // console.log('afterincldue',checked);
    } else {
      const filteredList = checked.filter((item) => item !== value);
      setChecked(filteredList);
    }
  };

  const onChangesetRef_no = (e) => {
    setRef_no(e.target.value);
  };
  const onChangeAdditional_notes = (e) => {
    setAdditional_notes(e.target.value);
  };
  const onChangeTotalAmountRecovered = (e) => {
    setAmount_recovered(e.target.value);
  };
  const OnChangeLocation = (e) => {
    // getProductFunction(e.id);
    setLocationID(e.id);
  };

  const onAddHandler = () => {
    // setTableArray([]);
    const array = ListDataSearch;
    const updatedColumnData = { ...columnData };
    checked.map((res) => {
      const object = array.find((obj) => obj.id == res);
      // console.log('object',)
      if (object.enable_stock == 1) {
        if (object.variation_location_details.length > 0) {
          object.variation_location_details.map((inner_res) => {
            if (inner_res.location_id == locationID) {
              if (inner_res.qty_available < 1) {
                toast.error(object.name + t('common:out-of-stock'), {
                  autoClose: 5000,
                });
              } else {
                if (updatedColumnData[object.id]) {
                  updatedColumnData[object.id]['quantity'] =
                    object?.variation_location_details[0]?.qty_available;
                  updatedColumnData[object.id]['product_id'] = object.productId;
                  updatedColumnData[object.id]['variation_id'] =
                    object?.variation_location_details[0]?.variation_id;
                  updatedColumnData[object.id]['unit_price'] =
                    object.unit_price;
                } else {
                  updatedColumnData[object.id] = {
                    ['quantity']:
                      object?.variation_location_details[0]?.qty_available,
                    ['product_id']: object.productId,
                    ['variation_id']:
                      object?.variation_location_details[0]?.variation_id,
                    ['unit_price']: object.unit_price,
                  };
                }
                // setColumnData(updatedColumnData);
                setTableArray((prevArray) => [...prevArray, object]);
              }
            }
          });
        } else {
          const filteredList = checked.filter((item) => item !== res);
          setChecked(filteredList);
          toast.error(object.name + t('common:out-of-stock'), {
            autoClose: 5000,
          });
        }
      } else {
        const filteredList = checked.filter((item) => item !== res);
        setChecked(filteredList);
        toast.error(object.name + t('common:out-of-stock'), {
          autoClose: 5000,
        });
      }
      setChecked([]);
      setOpenDrawer(false);
    });
    // console.log('columndata',updatedColumnData);
  };

  const handleDelete = (id, index) => {
    const updatedInputValues = inputValues.filter((item, ind) => ind != index);
    setInputsValues(updatedInputValues);
    const updatedItems = tableArray.filter(
      (item) => item.variation_location_details[0]?.id !== id
    );
    setTableArray(updatedItems);
    // setColumnData((prevColumnData) => {
    //   const updatedColumnData = { ...prevColumnData };
    //   unset(updatedColumnData, slug);
    //   return updatedColumnData;
    // });
    // setTableArray((prevArray) => prevArray.filter((item) => item.id !== slug));
    // const filteredList = checked.filter((item) => item != slug);
    // setChecked(filteredList);
  };
  // console.log('checked',checked);
  const adjustment_type = [
    { value: 'normal', label: 'Normal' },
    { value: 'abnormal', label: 'Abnormal' },
  ];
  const handleInputChange = (index: any, event: any, res: any) => {
    //   const { name, value } = event.target;
    const updatedInputs = [...inputValues];
    updatedInputs[index] = {
      product_id: res?.variation_location_details[0]?.product_id,
      variation_id: res?.variation_location_details[0]?.variation_id,
      location_id: res?.variation_location_details[0]?.location_id,
      updated_stock: event.target.value,
      unit_price: res.price,
    };

    //   updatedInputs[index] = { ...updatedInputs[index], [name]: value };
    setInputsValues(updatedInputs);
  };

  // const handleInputChange = (value, row, dataIndex) => {
  //   const updatedColumnData = { ...columnData };
  //   if (updatedColumnData[row.id]) {
  //     updatedColumnData[row.id]['quantity'] = value;
  //     updatedColumnData[row.id]['product_id'] = row.productId;
  //     updatedColumnData[row.id]['variation_id'] =
  //       row?.variation_location_details[0]?.variation_id;
  //     updatedColumnData[row.id]['unit_price'] = row.unit_price;
  //   } else {
  //     updatedColumnData[row.id] = {
  //       ['quantity']: value,
  //       ['product_id']: row.productId,
  //       ['variation_id']: row?.variation_location_details[0]?.variation_id,
  //       ['unit_price']: row.unit_price,
  //     };
  //   }
  //   setColumnData(updatedColumnData);
  // };

  const OnChangeAdjustementType = (selectedOption) => {
    setAdjustmentType(selectedOption.value);
    // Handle your logic or perform actions based on the selected option here
  };
  const onChangeLot = (e) => {
    let variation_Id: any = null;
    tableArray.find((item, index) => {
      if (index == selectedRowIndex) {
        variation_Id = item.variationsId;
      }
    });
    // console.log(variation_Id,'variation Id');
    // console.log(Object.keys(columnData),'data data');

    const updatedColumnData = { ...columnData };

    updatedColumnData[variation_Id]['lot_no_line_id'] = e.id;
    setColumnData(updatedColumnData);
    setLotModal(false);
    // setLotNumber(e.id);
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setLotModal(true);
  };

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 300,
      render: (name: any, row: any, index) => (
        <>
          <div className="flex flex-row w-full justify-between">
            <span className="w-full">{name} </span>
            {isEnableLot && (
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => handleRowClick(index)}
                className="pt-0 flex justify-center items-center"
              >
                {t('Lot Number')}
              </span>
            )}
          </div>
        </>
      ),
    },
    // {
    //   title: t('Current Stock'),
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (name: any, row: any,index:any) => (
    //     <span>
    //       <Input
    //         className="w-20"
    //         type="number"
    //         name="qty_available"
    //         // defaultValue={parseFloat(
    //         //   row?.variation_location_details[0]?.qty_available
    //         // ).toFixed(2)}
    //         value={inputValues[index]?.current_stock}
    //         // onChange={(event) => handleInputChange(index, event, row)}
    //         disabled

    //       />
    //     </span>
    //   ),
    // },
    {
      title: t('Quantity'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      render: (name: any, row: any, index: any) => (
        <span>
          <Input
            className="w-20"
            type="number"
            name="qty_available"
            // defaultValue={parseFloat(
            //   row?.variation_location_details[0]?.qty_available
            // ).toFixed(2)}
            value={inputValues[index]?.quantity}
            onChange={(event) => handleInputChange(index, event, row)}
          />
        </span>
      ),
    },

    {
      title: t('Action'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (slug: string, row: any, index: any) => (
        <span>
          <DeleteOutlined
            className="delete-icon"
            onClick={() =>
              handleDelete(row.variation_location_details[0]?.id, index)
            }
          />
        </span>
      ),
    },

    // {
    //   title: t('Line total'),
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (name: any, row: any) => <span></span>,
    // },
    // {
    //   title: t('Unit selling price total(inc tax)'),
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: alignLeft,
    //   render: (name: any, row: any) => <span></span>,
    // },
  ];

  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <Card>
      <Card className="w-full  mt-3 mb-3">
        <div className="flex justify-end mt-5 ">
          <div className=" w-full">
            <div className="flex w-full ">
              <Label className="w-5/12 ">Business Location</Label>
              <Label className="w-full pl-2 ml-3 ">
                <Select
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.key}
                  styles={selectStyles}
                  options={LocationDataArray}
                  defaultValue={DefaultLocationDataArray}
                  onChange={OnChangeLocation}
                />
              </Label>
            </div>
            <div className="flex w-full ">
              <Label className="w-5/12 ">Date</Label>
              <Label className="w-full pl-2 ml-3 ">
                <input
                  className="px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0  border border-border-base focus:shadow focus:bg-light focus:border-accent"
                  type="text"
                  value={currentDate}
                  readOnly={true}
                />
              </Label>
            </div>
          </div>
          <div className="w-full ml-4">
            <div className="flex w-full">
              <Label className="w-5/12">Reference no</Label>
              <input
                className="px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0  border border-border-base focus:shadow focus:bg-light focus:border-accent"
                type="text"
                {...register('ref_no')}
                onChange={onChangesetRef_no}
              />
            </div>
            <div className="flex w-full mt-4">
              <Label className="w-5/12 ">Adjustment Type</Label>
              <Label className="w-full   ">
                <Select
                  styles={selectStyles}
                  options={adjustment_type}
                  onChange={OnChangeAdjustementType}
                  defaultValue={adjustmentDefault}
                />
              </Label>
            </div>
          </div>
        </div>
      </Card>
      <Card className="w-full ">
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
                              type="checkbox"
                              className="mr-5 h-6 w-6 accent-dark"
                              // className="bg-accent-100 mr-5 h-6 w-6 rounded border-gray-300 text-accent-600 focus:ring-2 focus:ring-accent-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-accent-600"
                              // type="checkbox"
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
      </Card>
      <Card className="w-full  mt-3 mb-3">
        <div className=" mt-5">
          <div className="mb-5">{t('common:text-products')}</div>
          {/* {tableArray?.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                onCrossIcoDecPress={() => onDecFun(item.price)}
                onCrossIcoIncPress={() => onIncFun(item.price)}
              />
            ))} */}
          <Table
            //@ts-ignore
            columns={columns}
            emptyText={t('No data found')}
            data={tableArray}
            rowKey="id"
            scroll={{ x: 300 }}
            handleDelete={handleDelete}
          />

          <Drawer
            open={LotModal}
            onClose={() => setLotModal(false)}
            variant="right"
          >
            <DrawerWrapper
              onClose={() => setLotModal(false)}
              hideTopBar={false}
            >
              <div className="m-auto rounded bg-light sm:w-[28rem]">
                <div className="p-4">
                  <div style={{ textAlign: 'left', width: '100%' }}>
                    <p className="my-2.5  font-semibold text-accent">
                      <p className=" font-bold text-heading">
                        {t('Lot Number')}
                      </p>
                      <Select
                        options={lotNumberArray[selectedRowIndex]}
                        onChange={onChangeLot}
                      />
                    </p>
                  </div>
                  <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                    {/* <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setLotModal(false)}
                  className="rounded-md border p-2"
                >
                  {t('common:text-close')}
                </button>
                <Button
                  onClick={onAddLotButtonCLick}
                  className="rounded-md border p-2"
                >
                  {t('common:text-add')}
                </Button>
              </div> */}
                  </footer>
                </div>
              </div>
            </DrawerWrapper>
          </Drawer>
        </div>
      </Card>

      <Card className="w-full  mt-3 mb-3">
        <Input
          label={t('Total Amount Recovered')}
          {...register('total_amount_recovered')}
          type="number"
          variant="outline"
          className="mb-4"
          onChange={onChangeTotalAmountRecovered}
        />

        <TextArea
          label={t('form:input-label-additional-note')}
          {...register('additional_notes')}
          variant="outline"
          className="col-span-2"
          onChange={onChangeAdditional_notes}
        />
      </Card>
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
            ? t('common:update-stock-adjustment')
            : t('common:add-stock-adjustment')}
        </Button>
      </div>
    </Card>
  );
}
