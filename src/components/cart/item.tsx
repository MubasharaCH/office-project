import Image from 'next/image';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import usePrice from '@/utils/use-price';
import React, { useState } from 'react';
import Input from '../ui/input';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Drawer from '@/components/ui/drawer';
import Button from '@/components/ui/button';
import { log } from 'console';
import { resetPaymentCart } from '@/contexts/quick-cart/cart.utils';
import { toast } from 'react-toastify';
import Select from '../ui/select/select';
import { TiTick } from 'react-icons/ti';
import {
  AddingFunction,
  AddingUserFunction,
  GetFunction,
} from '@/services/Service';
import Label from '../ui/label';
import { Switch } from '@headlessui/react';
import { selectStyles } from '../ui/select/select.styles';
import Loader from '../ui/loader/loader';

interface CartItemProps {
  item: any;
  onCrossIcoIncPress?: any;
  onCrossIcoDecPress?: any;
}

const CartItem = ({
  item,
  onCrossIcoIncPress,
  onCrossIcoDecPress,
}: CartItemProps) => {
  const [currency, setCurrency] = React.useState<any>();
  const { t } = useTranslation('common');
  const {
    isInStock,
    clearItemFromCart,
    addItemToCart,
    removeItemFromCart,
  } = useCart();
  const businessDetail = JSON.parse(
    localStorage.getItem('user_business_details')!
  );

  const [discountModal, setdiscountModal] = useState<any>(false);
  const [LotModal, setLotModal] = useState<any>(false);
  const [customFieldModal, setCustomFieldModal] = useState<any>(
    item?.custom_fields?.length > 0 && item.custom_fields_subscription == 1
  );
  const [discountVal, setDiscountVal] = useState<any>();
  const [percentageValue, setPercentageValue] = useState<any>();
  const [netTotalValue, setNetTotalValue] = useState<any>();
  const [lotNumberArray, setLotNumberArrray] = useState<any>([]);
  const [lotNumber, setLotNumber] = useState<any>([]);
  const [lotQuantity, setLotQuantity] = useState<any>();
  const [lotName, setLotName] = useState<any>('');
  const [incSwitch, setincSwitch] = useState<any>(false);

  const [taxValID, setTaxValID] = useState<any>();
  const [TaxAmount, setTaxAmount] = useState<any>(item.product_tax_calculate);
  const [defaultUnitPrise, setDefaultUnitPrise] = React.useState<any>(
    item.unit_price
  );
  const [defaultIncPrise, setDefaultIncPrise] = React.useState<any>(0);
  const [taxArray, setTaxDataArray] = useState<any>([]);
  const [inputValues, setInputValues] = useState<any>({});
  const [customDropSelect, setCustomDropSelect] = useState<any>({});
  const [newObj, setNewObj] = useState<any>({});
  const [showCusDiv, setShowCusDiv] = useState<any>(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptionsDetail, setSubscriptionsDetail] = useState<any>({});
  React.useEffect(() => {
    let obj = {
      product_id: item.productId,
      variation_id: item.variationsId,
    };
    AddingUserFunction('/purchase/lot-numbers', obj).then((result) => {
      let ordersData = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.lot_number,
          label: data.lot_number,
          quantity: data.quantity,
        };
      });
      setLotNumberArrray(ordersData);
    });
    GetFunction('/tax').then((result) => {
      let datas = result.data.map((data, i) => {
        return {
          id: data.id,
          value: data.amount,
          label: data.name,
        };
      });
      datas.unshift({});
      setTaxDataArray(datas);
    });

    let initialVall =
      item?.new_custom_fields != undefined &&
      JSON.parse(item?.new_custom_fields);

    setNewObj(initialVall);

    item?.custom_fields?.map((res: any) => {
      if (
        initialVall &&
        res &&
        res.title &&
        typeof initialVall === 'object' &&
        Object.keys(initialVall).includes(res.title)
      ) {
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [res.title]: initialVall[res.title], // Set the value corresponding to the title
        }));
        const updatedObj = {
          ...customDropSelect,
          [res.title]: initialVall[res.title],
        }; // Set the value corresponding to the title
        setCustomDropSelect(updatedObj);
      }
    });

    setLoading(false);
  }, []);

  const { price } = usePrice({
    amount: item?.price,
  });
  const { price: itemPrice } = usePrice({
    amount: item.itemTotal,
  });
  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('business_details');
    setCurrency(JSON.parse(businessDetails));
  }, []);

  React.useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setSubscriptionsDetail(businessDetail?.subscriptions[0]); //
    }
  }, []);
  function handleIncrement(e: any) {
    let quantity = Math.round(item.product_qty);
    let item_quantity = item.quantity + 1;
    if (item.enable_stock == 0) {
      onCrossIcoIncPress();
      e.stopPropagation();
      addItemToCart(item, 1);
    } else {
      if (item_quantity > lotQuantity) {
        toast.error(
          t('Only ' + lotQuantity + ' pieces is available in the selected lot'),
          {
            autoClose: 5000,
          }
        );
      } else {
        if (item_quantity > quantity) {
          toast.error(item.name + t('common:out-of-stock'), {
            autoClose: 5000,
          });
        } else {
          onCrossIcoIncPress();
          e.stopPropagation();
          addItemToCart(item, 1);
        }
      }
    }
  }
  const onChangeSwitch = () => {
    setincSwitch((value: any) => !value);
  };

  const TaxOnChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target[selectedIndex];
    const selectedId = Number(selectedOption.id);

    setTaxAmount(e.target.value);
    setTaxValID(selectedId);
    let incPrice = defaultUnitPrise * (1 + e.target.value / 100);
    let obj: any = item;
    obj.price = Number(incPrice).toFixed(2);
    obj.product_tax_percentage = e.target.value;
    obj.product_tax_calculate = e.target.value;
    obj.product_tax_id = selectedId;
    addItemToCart(obj, 0);
  };

  const onChangeUnitPrise = (e) => {
    let val = e.target.value;
    let incPrice = val * (1 + TaxAmount / 100);
    setDefaultUnitPrise(val);
    let obj: any = item;
    obj.unit_price = Number(val);
    obj.price = Number(incPrice).toFixed(2);
    obj.product_tax_id = taxValID;
    obj.product_tax_percentage = TaxAmount;
    obj.product_tax_calculate = TaxAmount;
    addItemToCart(obj, 0);
  };

  const onChangeIncPrise = (e) => {
    let obj: any = item;
    let val = e.target.value;
    let incPrice = val / (1 + TaxAmount / 100);
    setDefaultIncPrise(val);
    obj.price = Number(val);
    obj.unit_price = Number(incPrice).toFixed(2);
    obj.product_tax_id = taxValID;
    obj.product_tax_percentage = TaxAmount;
    obj.product_tax_calculate = TaxAmount;
    addItemToCart(obj, 0);
  };

  const handleRemoveClick = (e: any) => {
    onCrossIcoDecPress();
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  const onValueDiscountChange = (e) => {
    setDiscountVal(e.target.value);
    let netValue = item.unit_price;
    let percentageVal: any = (e.target.value / netValue) * 100;
    setPercentageValue(percentageVal.toFixed(2));

    let netTotal =
      (item.unit_price - e.target.value) *
      (1 + item.product_tax_calculate / 100);
    setNetTotalValue(netTotal.toFixed(2));
  };

  const onPercentageDiscountChange = (e) => {
    setPercentageValue(e.target.value);
    let netValue = item.unit_price;
    let percentageVal: any = (netValue / 100) * e.target.value;
    setDiscountVal(percentageVal);

    let netTotal =
      (item.unit_price - percentageVal) * (1 + item.product_tax / 100);
    setNetTotalValue(netTotal.toFixed(2));
  };

  const onNetTotalChange = (e) => {
    setNetTotalValue(e.target.value);

    let netValue = item.price;
    let percentageVal: any = 100 - (e.target.value / netValue) * 100;
    setPercentageValue(percentageVal.toFixed(2));

    let newwwwwv = (item.unit_price * percentageVal) / 100;
    setDiscountVal(newwwwwv.toFixed(2));

    if (e.target.value.length == 0) {
      setDiscountVal('');
      setPercentageValue('');
    }
  };
  const { discountValue } = useCart();

  const onAddButtonCLick = () => {
    let obj: any = item;

    obj.discount = discountVal;
    obj.quantity = item.quantity;
    addItemToCart(obj, 0);
    setdiscountModal(false);
  };
  const onChangeLot = (e) => {
    setLotNumber(e.id);
    setLotQuantity(e.quantity);
    setLotName(e.value);
  };
  const onAddLotButtonCLick = () => {
    let obj: any = item;
    obj.lotNumber = lotNumber;
    addItemToCart(obj, 0);
    setLotModal(false);
  };

  const onCustomDropSelect = (e, title, req) => {
    const updatedObj = { ...customDropSelect, [title]: e.name };
    setCustomDropSelect(updatedObj);
  };

  const onChnageCustonInput = (e, title, req) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [title]: e.target.value,
    }));
  };

  let priceValue = item.unit_price * Number(item.quantity);
  let incPriceValue = item.price * Number(item.quantity);

  const onAddCustomFiledHandle = () => {
    let isInputValue = true;
    let isDropValue = true;
    let inVal = Object.keys(inputValues);
    let dropVal = Object.keys(customDropSelect);
    item?.custom_fields?.map((res, i) => {
      if (res?.data_type == 'text') {
        if (res.is_mandatory == 1) {
          if (!inVal.includes(res.title)) {
            isInputValue = false;
          }
        }
      }
    });
    item?.custom_fields?.map((res, i) => {
      if (res?.data_type == 'dropdown') {
        if (res.is_mandatory == 1) {
          if (!dropVal.includes(res.title)) {
            isDropValue = false;
          }
        }
      }
    });

    if (isInputValue && isDropValue) {
      let obj1 = inputValues;
      let obj2 = customDropSelect;
      let mergedObj = {
        ...obj1,
        ...obj2,
      };
      let obj: any = item;
      obj.new_custom_fields = mergedObj;
      addItemToCart(obj, 0);

      setNewObj(mergedObj);
      setShowCusDiv(true);
      setCustomFieldModal(false);
    } else {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  const renderObjectValues = (object) => {
    if (object && typeof object === 'object') {
      return Object.entries(object).map((value: any, key) => {
        return (
          <div key={key}>
            <span className=" font-bold text-heading">{value[0]}:</span>{' '}
            <span style={{ color: 'blue' }}>{value[1]}</span>{' '}
          </div>
        );
      });
    }
  };
  const onClearItem = () => {
    clearItemFromCart(item.id);
  };


  const handleDiscountModal = () => {
      const { discounts } = subscriptionsDetail?.package;
      if (discounts === 1) {
        if (subscriptionsDetail?.discounts === 1) {
          setdiscountModal(true)
        } else {
          toast.error(t('common:enable_addon_desc'));
          return;
        }
      } else {
        toast.error(t('common:enable_addon'));
        return;
      }
  };
  // if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <tbody className="w-full bg-white">
        <tr className="w-full">
          <td className="w-10 whitespace-nowrap px-3 py-4">
            <div className="flex-shrink-0">
              <Counter
                value={item.quantity}
                onDecrement={handleRemoveClick}
                onIncrement={handleIncrement}
                variant="pillVertical"
                disabled={false}
              />
            </div>
          </td>
          <td className=" whitespace-nowrap px-3 py-4">
            <div className="">
              <span className="whitespace-normal">{item.name}</span>
              <span>
                <span
                  className="flex cursor-pointer pt-1"
                  onClick={() => setCustomFieldModal(true)}
                >
                  {newObj && renderObjectValues(newObj)}
                </span>
              </span>
              <span className="flex pt-1">
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={handleDiscountModal}
                  className="pt-0 "
                >
                  {t('common:add-discount')}
                </span>
                <span className="pl-2 font-semibold text-accent">
                  {Number(item.discount) * Number(item.quantity) +
                    currency?.symbol}
                </span>
              </span>
            </div>
          </td>
          <td className=" whitespace-nowrap px-3 py-4">
            <div className="">
              {/* {Number(item.unit_price * Number(item.quantity)).toFixed(2) +
                currency?.symbol} */}
              <input
                className="h-9 w-20  rounded border-2 p-2 pb-3 pt-3 text-center focus:outline-black"
                onChange={onChangeUnitPrise}
                value={Number(defaultUnitPrise).toFixed(2)}
                type="number"
              />
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <div className="">
              {Number(item.product_tax * Number(item.quantity)).toFixed(2) +
                currency?.symbol}
            </div>
          </td>
          <td className="whitespace-nowrap pt-8 px-3 py-4">
            <span className="block">{itemPrice}</span>
            <div className="flex">
              <button
                onClick={onClearItem}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
              >
                <span className="sr-only">{t('text-close')}</span>
                <CloseIcon className="h-3 w-3" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      {/* <div className="flex-shrink-0">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={false}
        />
      </div> */}

      {/* <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={item?.image ?? '/'}
          loader={() => item?.image}
          alt="no image"
          layout="fill"
          objectFit="contain"
        />
      </div> */}
      {/* <div className="pl-3">
        <h3 className="font-bold text-heading">{item.name}</h3>
        <span>
          <div
            className="flex cursor-pointer"
            onClick={() => setCustomFieldModal(true)}
          >
            {renderObjectValues(newObj)}{' '}
          </div>
        </span>
        <div className="flex">
          {item.type != 'CustomProduct' && (
            <p className="my-2.5 mr-2 font-semibold text-accent">
              <span className="font-bold text-heading">
                {t('Taxable Price:')}{' '}
              </span>
              {Number(item.unit_price * Number(item.quantity)).toFixed(2) +
                currency?.symbol}
            </p>
          )}
          {item.type != 'CustomProduct' && (
            <p className="my-2.5 font-semibold text-accent">
              <span className="pr-1 font-bold text-heading">
                {t('common:text-tax')}
              </span>
              {Number(item.product_tax * Number(item.quantity)).toFixed(2) +
                currency?.symbol}
            </p>
          )}
          {item.type == 'CustomProduct' && (
            <>
              <div className="my-2.5 font-semibold text-accent">
                <span className="font-bold text-heading">{t(' Price:')}</span>
                <input
                  onChange={onChangeUnitPrise}
                  value={priceValue || defaultUnitPrise}
                  className=" h-8 w-20 rounded border-2 p-2"
                  disabled={item.quantity > 1}
                />
              </div>
            </>
          )}
          {item.type == 'CustomProduct' && (
            <>
              <div className="my-2.5 font-semibold text-accent">
                <span className="font-bold text-heading">Tax:</span>
                <select
                  disabled={item.quantity > 1}
                  onChange={TaxOnChange}
                  className=" h-8 w-20 rounded border-2 "
                >
                  {taxArray.map((res, index) => (
                    <option id={res.id} value={res.value} key={index}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-2.5 ml-3 font-semibold text-accent">
                <span className="font-bold text-heading">{t('Inc Tax:')}</span>
                <input
                  onChange={onChangeIncPrise}
                  value={incPriceValue || defaultIncPrise}
                  className=" h-8 w-20 rounded border-2 p-2"
                  disabled={item.quantity > 1}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex">
          {item.type != 'CustomProduct' && (
            <>
              <p
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => setdiscountModal(true)}
                className="pt-0 "
              >
                {t('common:add-discount')}
              </p>
              <span className="pl-2 font-semibold text-accent">
                {Number(item.discount) * Number(item.quantity) +
                  currency?.symbol}
              </span>
            </>
          )}
          {item.type == 'CustomProduct' && (
            <div className="flex justify-end">
              <p className="pt-0 font-semibold text-accent">Total Price:</p>
              <span className="pl-2 font-semibold text-accent">
                {incPriceValue + currency?.symbol}
              </span>
            </div>
          )}

          {businessDetail.enable_lot_number == 1 &&
            item.type != 'CustomProduct' && (
              <>
                <p
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => setLotModal(true)}
                  className="ml-4 pt-0"
                >
                  {t('Lot Number  ')}
                </p>
                <span className="pl-2 font-semibold text-accent">
                  {lotName}
                </span>
              </>
            )}
        </div>
      </div>
      {item.type != 'CustomProduct' && (
        <span className="font-bold text-heading ms-auto">{itemPrice}</span>
      )}

      <div onClick={onCrossIcoDecPress}>
        <button
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
          onClick={() => clearItemFromCart(item.id)}
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </div> */}
      <Drawer
        open={discountModal}
        onClose={() => setdiscountModal(true)}
        variant="right"
      >
        <DrawerWrapper
          onClose={() => setdiscountModal(false)}
          hideTopBar={false}
        >
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div style={{ textAlign: 'left', width: '100%' }}>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:unit-price')}{' '}
                  </p>
                  <Input
                    disabled
                    value={Number(item.unit_price).toFixed(2)}
                    className="w-auto"
                    name=""
                  />
                </p>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:value-discount')}{' '}
                  </p>
                  <Input
                    value={discountVal}
                    onChange={onValueDiscountChange}
                    className="w-auto"
                    name=""
                  />
                </p>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:percentage-discount')}
                  </p>
                  <Input
                    value={percentageValue}
                    onChange={onPercentageDiscountChange}
                    className="w-auto"
                    name=""
                  />
                </p>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">
                    {t('common:net-Value')}
                  </p>
                  <Input
                    value={Number(netTotalValue).toFixed(2)}
                    onChange={onNetTotalChange}
                    className="w-auto"
                    name=""
                  />
                </p>
              </div>
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setdiscountModal(false)}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-close')}
                  </button>
                  <Button
                    onClick={onAddButtonCLick}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-add')}
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
      <Drawer open={LotModal} onClose={() => setLotModal(true)} variant="right">
        <DrawerWrapper onClose={() => setLotModal(false)} hideTopBar={false}>
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div style={{ textAlign: 'left', width: '100%' }}>
                <p className="my-2.5  font-semibold text-accent">
                  <p className=" font-bold text-heading">{t('Lot Number')}</p>
                  <Select options={lotNumberArray} onChange={onChangeLot} />
                </p>
              </div>
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <div className="mt-8 flex justify-between">
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
                </div>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
      <Drawer
        open={customFieldModal}
        onClose={() => setCustomFieldModal(true)}
        variant="right"
      >
        <DrawerWrapper
          onClose={() => setCustomFieldModal(false)}
          hideTopBar={false}
        >
          <div className="m-auto h-screen rounded bg-light sm:w-[28rem]">
            <div className="px-4">
              {item?.custom_fields?.map((res, i) => {
                if (res?.data_type == 'text') {
                  return (
                    <div key={i} className="mt-3 flex">
                      <Input
                        label={
                          res.is_mandatory == 1 ? res.title + ' *' : res.title
                        }
                        className="w-full"
                        name="ds"
                        value={inputValues[res.title] || ''}
                        onChange={(e) =>
                          onChnageCustonInput(e, res.title, res.is_mandatory)
                        }
                      />
                    </div>
                  );
                }
                if (res?.data_type == 'dropdown') {
                  let values: any = res.values;
                  let valueArray = values
                    .split(',')
                    .map((name, i) => ({ name, label: name }));

                  return (
                    <div key={i} className="mt-3">
                      <Label>
                        {res.is_mandatory == 1 ? res.title + ' *' : res.title}
                      </Label>
                      <Select
                        options={valueArray}
                        onChange={(e) =>
                          onCustomDropSelect(e, res.title, res.is_mandatory)
                        }
                        defaultValue={{ label: customDropSelect[res.title] }}
                      />
                    </div>
                  );
                }
              })}
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <div className=" flex justify-between">
                  <button
                    onClick={() => setCustomFieldModal(false)}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-close')}
                  </button>
                  {showMessage && (
                    <p className="pt-3 text-rose-800">
                      Requried field is missing
                    </p>
                  )}
                  <Button
                    onClick={onAddCustomFiledHandle}
                    className="rounded-md border p-2"
                  >
                    {t('common:text-add')}
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
    </>
  );
};

export default CartItem;
