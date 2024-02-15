export interface Item {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}
export interface Subscription {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}

export interface Value {
  value: any;
}

export interface Name {
  id?: any;
  name?: any;
  balance?: any;
  amount?: any;
}

export interface UpdateItemInput extends Partial<Omit<Item, 'id'>> {}

export function addItemWithQuantity(
  items: Item[],
  item: Item,
  quantity: number
) {
  // if (quantity <= 0)
  //   throw new Error("cartQuantity can't be zero or less than zero");
  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id
  );
  if (existingItemIndex > -1) {
    const newItems = [...items];
    newItems[existingItemIndex].quantity! += quantity;
    return newItems;
  }
  return [...items, { ...item, quantity }];
}
export function addItemWithQuantitySubscription(
  items: Subscription[],
  item: Subscription,
  quantity: number
) {
  // if (quantity <= 0)
  //   throw new Error("cartQuantity can't be zero or less than zero");
  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id
  );

  if (existingItemIndex > -1) {
    const newItems = [...items];
    newItems[existingItemIndex].quantity! += quantity;
    return newItems;
  }
  return [...items, { ...item, quantity }];
}

export function removeItemOrQuantity(
  items: Item[],
  id: Item['id'],
  quantity: number
) {
  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}
export function removeItemOrQuantitySubscription(
  items: Subscription[],
  id: Subscription['id'],
  quantity: number
) {
  return items.reduce((acc: Subscription[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}
// Simple CRUD for Item
export function addItem(items: Item[], item: Item) {
  return [...items, item];
}
export function addItemSubscription(items: Subscription[], item: Subscription) {
  return [...items, item];
}
export function addDiscountVal(items: Value[], item: Value) {
  if (items != undefined) {
    return [...items, item];
  } else {
    return [item];
  }
}

export function addPaymentItem(items: Name[], item: Name) {
  if (items != undefined) {
    return [...items, item];
  } else {
    return [item];
  }
}

export function getItem(items: Item[], id: Item['id']) {
  return items.find((item) => item.id === id);
}
export function getItemSubscripton(
  items: Subscription[],
  id: Subscription['id']
) {
  return items.find((item) => item.id === id);
}

export function updateItem(
  items: Item[],
  id: Item['id'],
  item: UpdateItemInput
) {
  return items.map((existingItem) =>
    existingItem.id === id ? { ...existingItem, ...item } : existingItem
  );
}

export function removeItem(items: Item[], id: Item['id']) {
  return items.filter((existingItem) => existingItem.id !== id);
}
export function removeItemSubscription(
  items: Subscription[],
  id: Subscription['id']
) {
  return items.filter((existingItem) => existingItem.id !== id);
}
export function removePaymentItem(items: Name[], id: Name['id']) {
  return items.filter((existingItem) => existingItem.id !== id);
}
export function inStock(items: Item[], id: Item['id']) {
  const item = getItem(items, id);
  if (item) return item['quantity']! < item['stock']!;
  return false;
}

export const calculateItemTotals = (items: Item[]) =>
  items.map((item) => ({
    ...item,
    itemTotal:
      Math.round(
        item?.selling_price && item?.selling_price.length > 0
          ? item?.selling_price[0]?.price_inc_tax
          : item?.price
      ) * item?.quantity!,
  }));

export const calculateItemTotalsSubscription = (items: Subscription[]) =>
  items.map((item) => ({
    ...item,
    itemTotal: Math.round(item?.price) * item.quantity!,
  }));

export const calculateTotal = (items: Item[]) =>
  items.reduce(
    (total, item) => total + item.quantity! * Math.round(item?.price),
    0
  );
export const calculateTotalSubscription = (items: Subscription[]) =>
  items.reduce(
    (total, item) => total + item.quantity! * Math.round(item?.price),
    0
  );

export const calculateTotalItems = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.quantity!, 0);
export const calculateTotalItemsSubscription = (items: Subscription[]) =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

export const calculateUniqueItems = (items: Item[]) => items.length;
export const calculateUniqueItemsSubscription = (items: Subscription[]) =>
  items.length;

interface PriceValues {
  totalAmount: number;
  tax: number;
  shipping_charge: number;
}
export const calculatePaidTotal = (
  { totalAmount, tax, shipping_charge }: PriceValues,
  discount?: number
) => {
  let paidTotal = totalAmount + tax + shipping_charge;
  if (discount) {
    paidTotal = paidTotal - discount;
  }
  return paidTotal;
};
export const resetCart = () => [{}];
export const resetPaymentCart = () => [{}];
export const resetDiscountValue = () => [{}];
