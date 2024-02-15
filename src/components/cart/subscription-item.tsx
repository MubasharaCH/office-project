import Image from 'next/image';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import usePrice from '@/utils/use-price';

interface CartItemProps {
  item: any;
  data: any;
}

const CartItemSubscription = ({ item, data }: CartItemProps) => {
  const { t } = useTranslation('common');
  const {
    isInStock,
    clearItemFromCart,
    addSubscriptionToCart,
    removeItemFromCartSubscription,
  } = useCart();
  const { price } = usePrice({
    amount: item?.price,
  });
  const { price: itemPrice } = usePrice({
    amount: item?.itemTotal,
  });

  function handleIncrement(e: any) {
    e.stopPropagation();
    addSubscriptionToCart(item, 1);
  }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCartSubscription(item?.id);
  };

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className=" items-center border-b border-solid border-border-200 border-opacity-75 py-4 px-4 text-sm sm:px-6"
    >
      {data != 'Update Subscription' && (
        <div className="border-b-2 mb-3 pb-3 flex justify-between">
          <div>{item.name}</div>
          <div className="flex">
            {item?.price}
            {item?.planData?.currency_code}
          </div>
        </div>
      )}
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Counter
            value={item?.quantity}
            onDecrement={handleRemoveClick}
            onIncrement={handleIncrement}
            variant="pillVertical"
          />
        </div>
        <div className="pl-5">
          <h3 className="font-bold text-heading">{item?.name}</h3>
          <p className="my-2.5 font-semibold text-accent">{price}</p>
        </div>
        <span className="ms-auto font-bold text-heading">{itemPrice}</span>
        <button
          className="ms-3 -me-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
          onClick={() => clearItemFromCart(item?.id)}
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItemSubscription;
