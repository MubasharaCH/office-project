import Image from 'next/image';
import usePrice from '@/utils/use-price';
import { productPlaceholder } from '@/utils/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useTranslation } from 'next-i18next';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Product, ProductType, Subscription } from '@/types';

interface Props {
  item: Subscription;
}

const ProductCard = ({ item, planData }: any) => {
  const { name, price, sale_price } = item ?? {};
  // console.log(name);
  // console.log(item);

  const { price: currentPrice, basePrice, discount } = usePrice({
    amount: sale_price ? sale_price : price!,
    baseAmount: price ?? 0,
  });

  return (
    <div className="cart-type-neon mt-3  overflow-hidden rounded border-border-200 bg-light">
      <header className="p-3 md:p-6">
        <div className="mb-2 flex justify-between">
          <div className="mb-4 flex  text-xs text-body md:text-sm">{name}</div>
          <div className="text-sm font-semibold text-heading md:text-base">
            {currentPrice}
          </div>
        </div>
        <>
          <AddToCart variant="neon" planData={planData} data={item} />
        </>
      </header>
    </div>
  );
};

export default ProductCard;
