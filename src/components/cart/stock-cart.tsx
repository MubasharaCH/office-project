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
import defaultImg from '@/assets/images/default.png';
import Select from '../ui/select/select';
import { AddingUserFunction } from '@/services/Service';
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
  const [discountModal, setdiscountModal] = useState<any>(false);
  const [discountVal, setDiscountVal] = useState<any>();
  const [percentageValue, setPercentageValue] = useState<any>();
  const [netTotalValue, setNetTotalValue] = useState<any>();
  const [LotModal, setLotModal] = useState<any>(false);
  const [lotNumberArray, setLotNumberArray] = useState<any>([]);
  const [lotNumber, setLotNumber] = useState<any>([]);
  const [isEnableLot, setIsEnableLot] = useState(false);
  let business_details: any = JSON.parse(
    localStorage.getItem('user_business_details')!
  );
  React.useEffect(() => {
    setIsEnableLot(business_details?.enable_lot_number == 1 ? true : false);
    setNetTotalValue(item.price);
  }, []);
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
        };
      });
      setLotNumberArray(ordersData);
    });
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

  function handleIncrement(e: any) {
    let quantity = Math.round(item.product_qty);
    let item_quantity = item.quantity + 1;

    if (item.enable_stock == 0) {
      onCrossIcoIncPress();
      e.stopPropagation();
      addItemToCart(item, 1);
    } else {
      if (item_quantity > quantity) {
        toast.error(item.name + t('common:out-of-stock'), { autoClose: 5000 });
      } else {
        onCrossIcoIncPress();
        e.stopPropagation();
        addItemToCart(item, 1);
      }
    }
  }

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
  };
  const onAddLotButtonCLick = () => {
    let obj: any = item;
    obj.lotNumber = lotNumber;
    addItemToCart(obj, 0);
    setLotModal(false);
  };

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 py-4 px-4 text-sm sm:px-6"
    >
      <div className="flex-shrink-0">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={false}
        />
      </div>

      <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        {/* <Image
          src={item?.image ?? '/'}
          alt="no image"
          layout="fill"
          objectFit="contain"
        /> */}
        {item?.image ? (
          <Image
            src={item?.image}
            alt="img"
            loader={() => item?.image}
            layout="fixed"
            width={42}
            height={42}
            className="overflow-hidden rounded"
          />
        ) : (
          <Image
            src={defaultImg}
            alt="img"
            // loader={()=>cat_image}
            layout="fixed"
            width={42}
            height={42}
            className="overflow-hidden rounded"
          />
        )}
      </div>
      <div>
        <h3 className="font-bold text-heading">{item.name}</h3>
        <div className="flex">
          <p className="my-2.5 mr-4 font-semibold text-accent">
            <span className="font-bold text-heading">
              {t('common:unit-price')}{' '}
            </span>
            {Number(item.unit_price * Number(item.quantity)).toFixed(2) +
              currency?.symbol}
          </p>
          {isEnableLot && (
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setLotModal(true)}
              className="pt-0 flex justify-center items-center"
            >
              {t('Lot Number')}
            </span>
          )}
        </div>
      </div>
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
      <div className="ms-auto" onClick={onCrossIcoDecPress}>
        <button
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
          onClick={() => clearItemFromCart(item.id)}
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </div>
      {/* <Drawer
        open={discountModal}
        onClose={() => setdiscountModal(true)}
        variant="right"
      ></Drawer> */}
    </motion.div>
  );
};

export default CartItem;
