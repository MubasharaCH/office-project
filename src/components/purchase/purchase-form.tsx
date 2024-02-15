import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import Label from '../ui/label';
import {
  AddingFunction,
  AddingUserFunction,
  GetFunction,
} from '@/services/Service';
import { useRouter } from 'next/router';
import Loader from '../ui/loader/loader';
import Image from 'next/image';
import Input from '../ui/input';
import Card from '../common/card';
import Select from '../ui/select/select';
import { selectStyles } from '../ui/select/select.styles';
import { Table } from '@/components/ui/table';
import { useIsRTL } from '@/utils/locals';
import Search from '../common/Newearch';
import Drawer from '../ui/drawer';
import DrawerWrapper from '../ui/drawer-wrapper';
import { motion } from 'framer-motion';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { CloseIcon } from '../icons/close-icon';
import Counter from '../ui/counter';
import ReactSelect from 'react-select';
import Button from '../ui/button';
import { toast } from 'react-toastify';
import defaulImage from '../../assets/images/default.png';

export default function CreateOrUpdateTypeForm(initialValue: any) {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const [loading, setLoading] = useState(true);
  const [ceateLoading, setCreateLoading] = useState(false);
  const [CustomerArray, setCustomerArray] = React.useState<any>([]);
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);
  const [metaDataProduct, setMetaDataProduct] = useState<any>();
  const [metaData, setMetaData] = useState<any>();
  const [customerID, setCustomerID] = useState<any>();
  const [locationID, setLocationID] = useState<any>();
  const [purchaseStatus, setPurchaseStatus] = useState<any>();
  const [tax, setTax] = useState<any>();
  //drawer states
  const [openDrawer, setOpenDrawer] = useState<any>(false);
  const [ListDataSearch, setListDataSearch] = useState<any>([]);
  const [newArr, setNewArr] = useState<any>([]);
  const [checked, setChecked] = useState<any>([]);
  const [tableArray, setTableArray] = useState<any>([]);
  const [finalArray, setFinalArrray] = useState<any>([]);
  const router = useRouter();
  const [defaultSelect, setDefaultSelect] = useState<any>([]);
  const [cardItemDiv, setCardItemDiv] = useState<any>(false);
  const [productNameText, setProductNameText] = useState<any>('');
  const [inputValues, setInputsValues] = useState<any>([
    {
      unitPrice: '',
      netCost: '',
      marginValue: '',
      sellingPrice: '',
      productId: '',
      taxAmount: '',
      quantity: 1,
      lotNumber: '',
    },
  ]);
  let getValue: any = localStorage.getItem('user_business_details');
  let businessDetail: any = JSON.parse(getValue);

  React.useEffect(() => {
    GetFunction('/contactapi?type=supplier').then((result) => {
      setMetaData(result.meta);
    });
    GetFunction('/product').then((result) => {
      setMetaDataProduct(result.meta);
    });
    GetFunction('/tax').then((result) => {
      // console.log(result);

      let taxes = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
          amount: data.amount,
        };
      });
      setTax(taxes);
    });
  }, []);

  React.useEffect(() => {
    if (metaData != undefined) {
      GetFunction('/contactapi?type=supplier&per_page=' + metaData?.total).then(
        (result) => {
   
          let ordersData = result.data.map((data, i) => {
            return {
              key: i,
              id: data.id,
              value: data.name,
              label: data.name,
            };
          });
          // console.log(ordersData);
          setCustomerArray(ordersData);
        }
      );
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
        setLocationID(ordersData[0]?.id);
        setLoading(false);
      });
    }
  }, [metaData != undefined]);

  const getProductFunction = (locationID) => {
    if (metaDataProduct != undefined) {
      GetFunction(
        '/product?per_page=' +
          metaDataProduct.total +
          '&location_id=' +
          locationID
      ).then((result) => {
        setMetaDataProduct(result.meta);
        let newvariable: any = result?.data.filter(
          (item) => item.sku !== 'IS-OP-SKU'
        );

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
              unitId: data?.unit?.id,
            };
            abc.push(newObj);
            return newObj;
          });
        });

        // setNewArr(abc);
        setListDataSearch(abc);
      });
    }
  };

  React.useEffect(() => {
    getProductFunction(locationID);
  }, [locationID]);

  React.useEffect(() => {
    const updatedInputValues = tableArray.map((ress, index) => {
      let calVal =
        Number(inputValues[index]?.netCost) +
        (Number(inputValues[index]?.netCost) *
          inputValues[index]?.marginValue) /
          100;
      // let newVal = inputValues[index]?.marginValue ? calVal : ress.price;
      let newVal = inputValues[index]?.sellingPrice ? calVal : ress.price;

      let ddd =
        inputValues[index]?.unitPrice * (inputValues[index]?.taxAmount / 100);
      let roundedValue = Number(ddd) + Number(inputValues[index]?.unitPrice);
      let finalTax = inputValues[index]?.taxAmount ? roundedValue : 0;

      // let netValCal =
      //   finalTax != 0 && finalTax != undefined
      //     ? inputValues[index]?.unitPrice + ddd
      //     : ress.price;

      let margin = inputValues[index]?.marginValue
        ? inputValues[index]?.marginValue
        : 0;
      let tax = inputValues[index]?.taxAmount
        ? inputValues[index]?.taxAmount
        : 0;
      let qty = inputValues[index]?.quantity ? inputValues[index]?.quantity : 1;
      let uPrice = inputValues[index]?.unitPrice
        ? inputValues[index]?.unitPrice
        : ress.price;
      let netValCal = inputValues[index]?.netCost
        ? inputValues[index]?.netCost
        : ress.price;

      return {
        ...inputValues[index],
        id: ress.id,
        marginValue: margin,
        unitPrice: uPrice,
        netCost: netValCal,
        sellingPrice: newVal,
        productId: ress.productId,
        variationsId: ress.variationsId,
        unitId: ress.unitId,
        taxAmount: tax,
        quantity: qty,
      };
    });

    setInputsValues(updatedInputValues);
    setFinalArrray(tableArray);
  }, [tableArray]);

  const OnChangeCustomers = (e) => {
    setCustomerID(e.id);
  };
  const OnChangeLocation = (e) => {
    setLocationID(e.id);
  };
  const onChangePurchase = (e) => {
    setPurchaseStatus(e.name);
  };
  const purchaseOprioin = [
    { name: 'ordered', label: 'Ordered' },
    { name: 'pending', label: 'Pending' },
    { name: 'received', label: 'Received' },
  ];

  const filterBySearch = (event) => {
    setOpenDrawer(true);
  };

  const closeFunction = () => {
    setOpenDrawer(false);
  };

  const modalfilterBySearch = (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      var updatedList = [...ListDataSearch];
      let searchLower = query.toLowerCase();
      let filtered = updatedList.filter((list) => {
        if (list.name.toLowerCase().includes(searchLower)) {
          return true;
        }
      });
      setNewArr(filtered);
      setProductNameText(query);
    } else {
      setNewArr([]);
      setProductNameText(query);
    }
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
  // let newArrr: any = [];
  const onAddHandler = (id) => {
    const array = ListDataSearch;
    const object: any = array.find((obj) => obj.id == id);
    setTableArray((prevArray) => [...prevArray, object]);
    setOpenDrawer(false);
    setProductNameText('');
    setCardItemDiv(false);
    setNewArr([]);
  };
  const onAddNewItemClick = () => {
    setCardItemDiv(true);
  };
  const handleRemoveClick = (index) => {
    // const updatedInputs = [...inputValues];
    // const quantity = updatedInputs[index].quantity - 1;
    // let tax =
    //   Number(inputValues[index].unitPrice) *
    //   (Number(inputValues[index]?.taxAmount) / 100);
    // const netCostCal =
    //   updatedInputs[index].netCost -
    //   (Number(updatedInputs[index].unitPrice) + tax);
    // updatedInputs[index] = { ...updatedInputs[index], quantity };
    // updatedInputs[index] = { ...updatedInputs[index], netCost: netCostCal };
    // const updatedPrice =
    //   (Number(netCostCal) * inputValues[index].marginValue) / 100;
    // const sellingValue =
    //   inputValues[index].marginValue != 0
    //     ? netCostCal + updatedPrice
    //     : netCostCal;
    // updatedInputs[index] = {
    //   ...updatedInputs[index],
    //   sellingPrice: sellingValue,
    // };

    // setInputsValues(updatedInputs);
    const updatedInputs = [...inputValues];
    const quantity = updatedInputs[index].quantity - 1;

    // Make sure quantity is not less than one
    const updatedQuantity = quantity >= 1 ? quantity : 1;

    let tax =
      Number(inputValues[index].unitPrice) *
      (Number(inputValues[index]?.taxAmount) / 100);
    const netCostCal =
      updatedQuantity * (Number(updatedInputs[index].unitPrice) + tax);

    updatedInputs[index] = {
      ...updatedInputs[index],
      quantity: updatedQuantity,
    };
    updatedInputs[index] = { ...updatedInputs[index], netCost: netCostCal };
    const updatedPrice =
      (Number(netCostCal) * inputValues[index].marginValue) / 100;
    const sellingValue =
      inputValues[index].marginValue !== 0
        ? netCostCal + updatedPrice
        : netCostCal;
    updatedInputs[index] = {
      ...updatedInputs[index],
      sellingPrice: sellingValue,
    };

    setInputsValues(updatedInputs);
  };
  function handleIncrement(index) {
    let tax =
      Number(inputValues[index].unitPrice) *
      (Number(inputValues[index]?.taxAmount) / 100);
    const updatedInputs = [...inputValues];
    const quantity = updatedInputs[index].quantity + 1;
    const netCostCal =
      (Number(updatedInputs[index].unitPrice) + tax) * quantity;
    const updatedPrice =
      (Number(netCostCal) * inputValues[index].marginValue) / 100;

    const sellingValue =
      inputValues[index].marginValue != 0
        ? netCostCal + updatedPrice
        : netCostCal;
    updatedInputs[index] = { ...updatedInputs[index], quantity };
    updatedInputs[index] = { ...updatedInputs[index], netCost: netCostCal };
    updatedInputs[index] = {
      ...updatedInputs[index],
      sellingPrice: sellingValue,
    };

    setInputsValues(updatedInputs);
  }

  const removeHalder = (id, index) => {
    const updatedItems = tableArray.filter((item) => item.id !== id);
    const updatedInputValues = inputValues.filter((item) => item.id != id);
    setInputsValues(updatedInputValues);
    setTableArray(updatedItems);

    defaultSelect.splice(index, 1);
  };

  const onChangeTaxArr = (e, price, index) => {
    const updatedDefault = [...defaultSelect];
    updatedDefault[index] = e;
    setDefaultSelect(updatedDefault);
    let ddd = price * (e.amount / 100);
    let roundedValue =
      (Number(ddd) + Number(price)) * inputValues[index].quantity;
    const updatedInputs = [...inputValues];
    const sellPrice = roundedValue + Number(inputValues[index].marginValue);
    updatedInputs[index] = { ...updatedInputs[index], netCost: roundedValue };
    updatedInputs[index] = { ...updatedInputs[index], taxAmount: e.amount };
    updatedInputs[index] = { ...updatedInputs[index], sellingPrice: sellPrice };
    setInputsValues(updatedInputs);
  };

  const onMarginChannge = (index, e) => {
    const updatedPrice =
      Number(inputValues[index].netCost) +
      (Number(inputValues[index].netCost) * e.target.value) / 100;
    const updatedInputs = [...inputValues];
    updatedInputs[index] = {
      ...updatedInputs[index],
      sellingPrice: updatedPrice,
      marginValue: e.target.value,
    };

    setInputsValues(updatedInputs);
  };
  const onLotChange = (e, index) => {
    const updatedInputs = [...inputValues];
    updatedInputs[index] = {
      ...updatedInputs[index],
      lotNumber: e.target.value,
    };
    setInputsValues(updatedInputs);
  };
  const handleUnitCost = (index: any, event: any) => {
    let tax =
      inputValues[index]?.taxAmount &&
      event.target.value * (Number(inputValues[index]?.taxAmount) / 100);

    const unitPrice = event.target.value;
    const netCost = inputValues[index]?.taxAmount
      ? (Number(unitPrice) + tax) * inputValues[index].quantity
      : Number(unitPrice) * inputValues[index].quantity;
    const updatedPrice =
      (Number(netCost) * inputValues[index].marginValue) / 100;

    const sellingValue =
      inputValues[index].marginValue != 0 ? netCost + updatedPrice : netCost;
    // const { name, value } = event.target;
    const updatedInputs = [...inputValues];
    updatedInputs[index] = {
      ...updatedInputs[index],
      unitPrice: unitPrice,
      netCost: netCost,
      sellingPrice: sellingValue,
    };
    setInputsValues(updatedInputs);
  };

  const onSaveClick = () => {
    setCreateLoading(true);
    let purchaseDetail = inputValues.map((res) => {
      return {
        product_id: res.productId,
        variation_id: res.variationsId,
        quantity: res.quantity,
        product_unit_id: res.unitId,
        lot_number: res.lotNumber,
        pp_without_discount: res.unitPrice,
        discount_percent: res.marginValue,
        purchase_price: res.unitPrice,
        item_tax: res.taxAmount,
        purchase_price_inc_tax: res.netCost,
        profit_percent: res.marginValue,
      };
    });

    let obj = {
      contact_id: customerID,
      transaction_date: '2023-05-23 18:26:30',
      status: purchaseStatus,
      location_id: locationID,
      purchases: purchaseDetail,
      total_before_tax: inputValues.reduce(
        (total, item) => total + Number(item.unitPrice),
        0
      ),
      final_total: inputValues.reduce(
        (total, item) => total + Number(item.sellingPrice),
        0
      ),
      payment: [
        {
          amount: '1725',
          paid_on: '2023-05-15 18:26:10',
          method: 'cash',
        },
      ],
    };

    AddingUserFunction('/purchases', obj).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-created'));
        setCreateLoading(false);
        router.back();
      } else {
        toast.error(t(result.msg));
        setCreateLoading(false);
      }
    });
  };
  const validateInput = () => {
    // Get the input element
    var input: any = document.getElementById('numberInput');

    if (input.value === '') {
      input.value = '';
    } else {
      input.value = input.value.replace(/[^0-9]/g, '');
    }
  };

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <div>
      <Card>
        <div className="lg:flex xl:flex 2xl:flex justify-end mt-5 ">
          <div className=" w-full">
            <div className="flex flex-col w-full">
              <div className="flex">
                <Label className=" flex items-center justify-center h-full">
                  {t('form:input-label-supplier')}
                </Label>
              </div>
              <div className="flex">
                <Label className="w-full">
                  <Select
                    getOptionLabel={(option: any) => option.label}
                    getOptionValue={(option: any) => option.key}
                    styles={selectStyles}
                    options={CustomerArray}
                    onChange={OnChangeCustomers}
                  />
                </Label>
              </div>
            </div>
            <div className="flex flex-col w-full ">
              <div className="flex">
                <Label className="w-5/12 flex  items-center">
                  {t('form:input-label-business-location')}
                </Label>
              </div>
              <div className="flex">
                <Label className="w-full ">
                  <Select
                    getOptionLabel={(option: any) => option.label}
                    getOptionValue={(option: any) => option.key}
                    styles={selectStyles}
                    options={locationDataArray}
                    onChange={OnChangeLocation}
                    defaultValue={locationDataArray[0]}
                  />
                </Label>
              </div>
            </div>
          </div>
          <div className="w-full lg:ml-4 xl:ml-4 2xl:ml-4">
            <div className="flex flex-col w-full ">
              <div className="flex">
                <Label className="flex  items-center">
                  {t('form:input-label-purchase-status')}
                </Label>
              </div>
              <div className="flex">
                <Label className="w-full ">
                  <Select
                    options={purchaseOprioin}
                    onChange={onChangePurchase}
                  />
                </Label>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="mt-5 ">
        <Label>{t('form:input-label-products')}</Label>
        {/* <div className="w-full ">
          <div onClick={filterBySearch} className="">
            <Search readOnly={true} onChangeearchVal={filterBySearch} />
          </div>
        </div> */}
        {finalArray.map((res, index) => (
          <div key={index} className="mt-2">
            <motion.div
              layout
              initial="from"
              animate="to"
              exit="from"
              variants={fadeInOut(0.25)}
              className="  border-b rounded border-solid border-border-200 border-opacity-75 "
            >
              <div className="font-bold text-heading pl-6">{res.name}</div>
              <div className="flex py-2 px-2 text-sm items-center">
                <div className="flex-shrink-0">
                  <Counter
                    value={inputValues[index]?.quantity}
                    onDecrement={() => handleRemoveClick(index)}
                    onIncrement={() => handleIncrement(index)}
                    variant="pillVertical"
                    disabled={false}
                  />
                </div>
                <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
                  <Image
                    layout="fill"
                    loader={() => res.image}
                    src={res.image}
                    alt="product Img"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  <div className="flex my-1">
                    <Input
                      label={t('form:input-label-unit-cost')}
                      className="w-32 "
                      defaultValue={res.price}
                      name="unitPrice"
                      value={Math.round(inputValues[index]?.unitPrice)}
                      onChange={(event) => handleUnitCost(index, event)}
                      id="numberInput"
                      onInput={validateInput}
                    />
                  </div>

                  <div className="w-32 flex flex-col my-1">
                    <Label className="pl-3">
                      {t('form:input-label-product-tax')}{' '}
                    </Label>
                    <Select
                      options={tax}
                      value={defaultSelect[index]}
                      onChange={(e) =>
                        onChangeTaxArr(e, inputValues[index]?.unitPrice, index)
                      }
                      className=" w-32"
                    />
                  </div>
                  <div className="flex my-1">
                    <Input
                      label={t('form:input-label-net-cost')}
                      className=" w-32"
                      name="netCost"
                      value={Math.round(inputValues[index]?.netCost)}
                      disabled

                      // onChange={(event) => handleInputChange(index, event)}
                    />
                  </div>
                  <div className="flex my-1">
                    <Input
                      label={t('form:input-label-margin')}
                      className=" w-32"
                      name="marginValue"
                      value={inputValues[index]?.marginValue}
                      onChange={(event) => onMarginChannge(index, event)}
                    />
                  </div>

                  {businessDetail.enable_lot_number == 1 && (
                    <div className="flex my-1">
                      <Input
                        label="lot Number"
                        className=" w-32"
                        name="lotNumber"
                        onChange={(e) => onLotChange(e, index)}
                      />
                    </div>
                  )}

                  <div className="flex my-1">
                    <Input
                      label={t('form:input-label-selling-price')}
                      className="w-32 "
                      name="sellingPrice"
                      value={Math.round(inputValues[index]?.sellingPrice)}
                      disabled
                      // onChange={(event) => handleInputChange(index, event)}
                    />
                  </div>
                </div>
                <div className="pt-5 flex  ms-auto">
                  <button
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
                    onClick={() => removeHalder(res.id, index)}
                  >
                    <span className="sr-only">{t('text-close')}</span>
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
        {cardItemDiv && (
          <div className=" mt-5">
            <div>
              <motion.div
                layout
                initial="from"
                animate="to"
                exit="from"
                variants={fadeInOut(0.25)}
                className="  border-b rounded border-solid border-border-200 border-opacity-75 "
              >
                <input
                  onChange={modalfilterBySearch}
                  className="pb-3 border-2 w-72 rounded p-2 h-9 ml-2"
                  value={productNameText}
                />
                <div className="dropdown-wrapper ">
                  {newArr.length > 0 ? (
                    <div className="absolute w-72 dropdown-list bg-gray-100 max-h-80 overflow-y-auto z-10 ml-2">
                      {newArr?.map((res: any, index: any) => (
                        <div
                          onClick={() => onAddHandler(res.id)}
                          key={index}
                          className="dropdown-item grid grid-cols-6 gap-4 border-t-2 p-5 cursor-pointer"
                        >
                          <div className="col-span-5">
                            <div className="flex">
                              <div>
                                {res.name}
                                <br />
                                Price: {Math.round(res.price)}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="flex py-2 px-2 text-sm items-center">
                  <div className="flex-shrink-0">
                    <Counter
                      value={0}
                      onDecrement={() => console.log('')}
                      onIncrement={() => console.log('')}
                      variant="pillVertical"
                      disabled={true}
                    />
                  </div>
                  <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
                    <Image
                      src={defaulImage}
                      alt="no image"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <div className="flex my-1">
                      <Input
                        label={t('form:input-label-unit-cost')}
                        className="w-32 "
                        defaultValue="00:00"
                        name="unitPrice"
                        value="00:00"
                        id="numberInput"
                        onInput={validateInput}
                      />
                    </div>

                    <div className="w-32 flex flex-col my-1">
                      <Label className="pl-3">
                        {t('form:input-label-product-tax')}{' '}
                      </Label>
                      <Select options={tax} className=" w-32" />
                    </div>
                    <div className="flex my-1">
                      <Input
                        label={t('form:input-label-net-cost')}
                        className=" w-32"
                        name="netCost"
                        value="00:00"
                        disabled

                        // onChange={(event) => handleInputChange(index, event)}
                      />
                    </div>
                    <div className="flex my-1">
                      <Input
                        label={t('form:input-label-margin')}
                        className=" w-32"
                        name="marginValue"
                        value="00:00"
                      />
                    </div>

                    {businessDetail.enable_lot_number == 1 && (
                      <div className="flex my-1">
                        <Input
                          label="lot Number"
                          className=" w-32"
                          name="lotNumber"
                        />
                      </div>
                    )}

                    <div className="flex my-1">
                      <Input
                        label={t('form:input-label-selling-price')}
                        className="w-32 "
                        name="sellingPrice"
                        value="00:00"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="pt-5 flex  ms-auto">
                    <button
                      onClick={() => setCardItemDiv(false)}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
                    >
                      <span className="sr-only">{t('text-close')}</span>
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
        <div className="flex justify-between">
          <div
            onClick={onAddNewItemClick}
            className="p-3 rounded w-full border-2 border-black border-dashed text-black hover:bg-white hover:text-black text-center text-sm mt-3 cursor-pointer mr-2"
          >
            {/* {t('form:label-total-invoice')} */}
            Add new purchase item
          </div>
        </div>

        {/* <div className="flex justify-end mt-5">
          <div>{t('form:label-total-beforeTax')}:</div>
          <div className="ml-5">
            {inputValues.reduce(
              (total, item) => Math.round(total + Number(item.unitPrice)),
              0
            )}
          </div>
        </div> */}
        <div className="flex justify-end mt-5">
          <div>{t('form:label-final-total')}:</div>
          <div className="ml-5">
            {inputValues.reduce(
              (total, item) =>
                item?.sellingPrice
                  ? Math.round(total + Number(item?.sellingPrice))
                  : 0,
              0
            )}
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button
            loading={ceateLoading}
            disabled={ceateLoading}
            onClick={onSaveClick}
          >
            {t('form:button-label-save')}
          </Button>
        </div>
      </Card>
      {/* <Drawer open={openDrawer} onClose={closeFunction} variant="right">
        <DrawerWrapper onClose={closeFunction} hideTopBar={false}>
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <Label>{t('form:input-label-all-products')}</Label>
              <Search onChangeearchVal={modalfilterBySearch} className="pb-3" />
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
      </Drawer> */}
    </div>
  );
}
