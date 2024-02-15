import { useRouter } from 'next/router';
import { motion, AnimateSharedLayout } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/item';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { formatString } from '@/utils/format-string';
import { useTranslation } from 'next-i18next';
import { useUI } from '@/contexts/ui.context';
import { Routes } from '@/config/routes';
import usePrice from '@/utils/use-price';
import { useCart } from '@/contexts/quick-cart/cart.context';
import CartItemSubscription from './addons-cart-items';
import { AddSubscriptionFunction } from '@/services/Service';
import { toast } from 'react-toastify';
import Button from '../ui/button';
import { useEffect, useState } from 'react';
// import { drawerAtom } from '@store/drawer-atom';

const AddonsCart = (data) => {
  const { t } = useTranslation('common');
  const {
    items,
    totalUniqueItems,
    total,
    resetCart,
    resetPaymentCart,
  } = useCart();
  const { closeCartSidebar } = useUI();
  const [loadingBtn, setloadingBtn] = useState<any>(false);
  const router = useRouter();

  function handleCheckout() {
    setloadingBtn(true);

    let formData = {
      plan_id: items[0].planData.pabbly_product_id,
    };

    AddSubscriptionFunction('/pabbly/create-subscription', formData).then(
      (result) => {
        if (result.success) {
          toast.success(result.message);
          setloadingBtn(false);
          if (result.data.invoice_link) {
            window.open(result.data.invoice_link, '_blank');
          }
          setTimeout(() => {
            resetPaymentCart();
            resetCart();
            router.push('/');
          }, 1000);
        } else {
          toast.error(result.message);
          setloadingBtn(false);
        }
      }
    );
  }

  const { price: totalPrice } = usePrice({
    amount: total,
  });

  const regex = /(\d+)/g;
  let planPrice = items[0]?.planData?.price ? items[0]?.planData?.price : 0;
  const itemValue = parseFloat(planPrice);
  const totalValue = parseFloat(totalPrice?.match(regex));
  const sum = itemValue + totalValue;

  return (
    <section className="relative flex h-full flex-col bg-white">
      <header className="fixed top-0 z-10 flex h-16 w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light px-6">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="flex-shrink-0" width={24} height={22} />
          <span className="flex ms-2">
            {formatString(totalUniqueItems, t('Addon'))}
          </span>
        </div>
        <button
          onClick={closeCartSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 -me-2 ms-3 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      {/* End of cart header */}

      <AnimateSharedLayout>
        <motion.div layout className="flex-grow pb-20">
          {items.length > 0 ? (
            items?.map((item) => (
              <CartItemSubscription item={item} key={item.id} />
            ))
          ) : (
            <motion.div
              layout
              initial="from"
              animate="to"
              exit="from"
              variants={fadeInOut(0.25)}
              className="flex h-full flex-col items-center justify-center"
            >
              <EmptyCartIcon width={140} height={176} />
              <h4 className="mt-6 text-base font-semibold">
                {t('No addons found')}
              </h4>
            </motion.div>
          )}
        </motion.div>
      </AnimateSharedLayout>

      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
        <Button
          loading={loadingBtn}
          className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
          onClick={handleCheckout}
        >
          <span className="flex h-full flex-1 justify-center items-center px-5 text-light">
            Subscribe
          </span>
          <span className="flex h-full flex-shrink-0 items-center rounded-full bg-light px-5 text-accent">
            {totalPrice}
          </span>
        </Button>
      </footer>
    </section>
  );
};

export default AddonsCart;
