import Image from 'next/image';
import usePrice from '@/utils/use-price';
import { productPlaceholder } from '@/utils/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { AddToCartAddons } from '@/components/cart/add-to-cart/add-to-cart-addons';
import { useTranslation } from 'next-i18next';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Product, ProductType, Subscription } from '@/types';

interface Props {
  item: Subscription;
}

const AddonsCard = ({ item, planData }: any) => {
  const { name, price } = item ?? {};
  console.log(item);

  const { price: currentPrice, basePrice, discount } = usePrice({
    amount: price,
    baseAmount: price,
  });
  console.log(currentPrice);

  return (
    <div className="cart-type-neon mt-3  overflow-hidden rounded border-border-200 bg-light">
      <header className="p-3 md:p-6">
        <div className="mb-2 flex justify-between">
          <div className="mb-4 flex  text-xs text-body md:text-sm">{name}</div>
          <div className="text-sm font-semibold text-heading md:text-base">
            {Number(price).toFixed()}
            {item?.currency?.code}
          </div>
        </div>
        <>
          <AddToCartAddons variant="neon" planData={item} data={item} />
        </>
      </header>
    </div>
  );
};

export default AddonsCard;
