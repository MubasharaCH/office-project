import React, { useCallback } from 'react';
import {
  cartReducer,
  State,
  initialState,
  initialState1,
  initialState3,
  cartReducer2,
  cartReducer3,
} from './cart.reducer';
import {
  Item,
  getItem,
  inStock,
  Name,
  Value,
  Subscription,
  getItemSubscripton,
} from './cart.utils';
import { useLocalStorage } from '@/utils/use-local-storage';
import {
  CART_KEY,
  CART_KEY_PAYMENT,
  DICOUNT_VALUE,
  SUBCRIPTION_CART_KEY,
} from '@/utils/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/contexts/checkout';
interface CartProviderState extends State {
  addItemToCart: (item: Item, quantity: number) => void;
  addSubscriptionToCart: (item: Item, quantity: number) => void;
  discountValue: (value: Value) => void;
  addPaymentToCart: (name: Name) => void;
  removeItemFromCart: (id: Item['id']) => void;
  removeItemFromCartSubscription: (id: Item['id']) => void;
  clearItemFromCart: (id: Item['id']) => void;
  clearPaymentItemFromCart: (id: Name['id']) => void;
  getItemFromCart: (id: Item['id']) => any | undefined;
  getItemFromCartSubscription: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInCartSubscription: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
  resetPaymentCart: () => void;
  resetDiscountValue: () => void;
}

export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
};

export const CartProvider: React.FC = (props) => {
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const [savedSubCart, saveSubCart] = useLocalStorage(
    SUBCRIPTION_CART_KEY,
    JSON.stringify(initialState)
  );
  const [savedCart1, saveCart1] = useLocalStorage(
    CART_KEY_PAYMENT,
    JSON.stringify(initialState1)
  );
  const [savedCart3, saveCart3] = useLocalStorage(
    DICOUNT_VALUE,
    JSON.stringify(initialState3)
  );

  const [state, dispatch] = React.useReducer(
    cartReducer,
    JSON.parse(savedCart!)
  );

  const [state1, dispatch1] = React.useReducer(
    cartReducer2,
    JSON.parse(savedCart1!)
  );
  const [state3, dispatch3] = React.useReducer(
    cartReducer3,
    JSON.parse(savedCart3!)
  );

  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  React.useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
    saveCart1(JSON.stringify(state1));
    saveCart3(JSON.stringify(state3));
  }, [state, state1, state3, saveCart, saveCart1, saveCart3]);

  const addItemToCart = (item: Item, quantity: number) =>
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });

  const addSubscriptionToCart = (item: Item, quantity: number) =>
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });

  const addPaymentToCart = (itemPayment: Name) =>
    dispatch1({ type: 'ADD_ITEM_WITH_QUANTITY_PAYMENT', itemPayment });

  const discountValue = (value: Value) =>
    dispatch3({ type: 'ADD_DICOUNT_VALUE', value });

  const removeItemFromCart = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });

  const removeItemFromCartSubscription = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });

  const clearItemFromCart = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM', id });

  const clearPaymentItemFromCart = (id: Name['id']) =>
    dispatch1({ type: 'REMOVE_ITEM_PAYMENT', id });

  const isInCart = useCallback((id: Item['id']) => !!getItem(state.items, id), [
    state.items,
  ]);
  const isInCartSubscription = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items]
  );
  const getItemFromCart = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );
  const getItemFromCartSubscription = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );
  const isInStock = useCallback((id: Item['id']) => inStock(state.items, id), [
    state.items,
  ]);
  const resetCart = () => dispatch({ type: 'RESET_CART' });
  const resetPaymentCart = () => dispatch1({ type: 'RESET_CART_PAYMENT' });
  const resetDiscountValue = () => dispatch3({ type: 'RESET_CART' });
  const value = React.useMemo(
    () => ({
      ...state,
      ...state1,
      ...state3,
      addItemToCart,
      discountValue,
      addPaymentToCart,
      removeItemFromCart,
      removeItemFromCartSubscription,
      clearItemFromCart,
      clearPaymentItemFromCart,
      getItemFromCart,
      getItemFromCartSubscription,
      isInCart,
      isInCartSubscription,
      isInStock,
      resetCart,
      resetPaymentCart,
      resetDiscountValue,
      addSubscriptionToCart,
    }),
    [
      getItemFromCart,
      getItemFromCartSubscription,
      isInCart,
      isInCartSubscription,
      isInStock,
      state,
      state1,
      state3,
    ]
  );
  return <cartContext.Provider value={value} {...props} />;
};
