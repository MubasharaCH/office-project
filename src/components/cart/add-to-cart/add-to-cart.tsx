import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/cart/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/utils/cart-animation';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { generateCartItem } from '@/contexts/quick-cart/generate-cart-item';

interface Props {
  data: any;
  planData: any;
  variant?: 'helium' | 'neon' | 'argon' | 'oganesson' | 'single' | 'big';
  counterVariant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export const AddToCart = ({
  data,
  planData,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const {
    addSubscriptionToCart,
    removeItemFromCartSubscription,
    getItemFromCartSubscription,
    isInCartSubscription,
  } = useCart();
  const item = generateCartItem(data, planData, variation);

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addSubscriptionToCart(item, 1);
    // if (!isInCart(item.id)) {
    //   cartAnimation(e);
    // }
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCartSubscription(item.id);
  };

  return !isInCartSubscription(item?.id) ? (
    <AddToCartBtn
      disabled={disabled}
      variant={variant}
      onClick={handleAddClick}
    />
  ) : (
    <>
      <Counter
        value={getItemFromCartSubscription(item.id).quantity}
        onDecrement={handleRemoveClick}
        onIncrement={handleAddClick}
        variant={counterVariant || variant}
        className={counterClass}
      />
    </>
  );
};
