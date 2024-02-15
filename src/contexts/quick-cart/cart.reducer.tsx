import {
  Item,
  UpdateItemInput,
  addItemWithQuantity,
  removeItemOrQuantity,
  addItem,
  updateItem,
  removeItem,
  calculateUniqueItems,
  calculateItemTotals,
  calculateTotalItems,
  calculateTotal,
  Name,
  addPaymentItem,
  removePaymentItem,
  Value,
  addDiscountVal,
  Subscription,
  addItemSubscription,
  removeItemSubscription,
  addItemWithQuantitySubscription,
  calculateUniqueItemsSubscription,
  calculateItemTotalsSubscription,
  calculateTotalItemsSubscription,
  calculateTotalSubscription,
  removeItemOrQuantitySubscription,
} from './cart.utils';

interface Metadata {
  [key: string]: any;
}

type Action =
  | { type: 'ADD_ITEM_WITH_QUANTITY'; item: Item; quantity: number }
  | { type: 'ADD_ITEM_WITH_QUANTITY_PAYMENT'; itemPayment: Name }
  |{ type: 'RESET_CART_PAYMENT' }
  | { type: 'ADD_DICOUNT_VALUE'; value: Value }
  | { type: 'REMOVE_ITEM_OR_QUANTITY'; id: Item['id']; quantity?: number }
  | {
      type: 'REMOVE_ITEM_OR_QUANTITY_SUBSCRIPTION';
      id: Subscription['id'];
      quantity?: number;
    }
  | { type: 'ADD_ITEM'; id: Item['id']; item: Item }
  | { type: 'UPDATE_ITEM'; id: Item['id']; item: UpdateItemInput }
  | { type: 'REMOVE_ITEM'; id: Item['id'] }
  | { type: 'REMOVE_ITEM_PAYMENT'; id: Name['id'] }
  | { type: 'RESET_CART' };

export interface State {
  items: Item[];
  name: Name[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  total: number;
  meta?: Metadata | null;
  value: Value[];
  subscription: Subscription[];
}

export interface Namess {
  name: Name[];
}
export interface values {
  value: Value[];
}

export const initialState: State = {
  items: [],
  name: [],
  value: [],
  subscription: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  total: 0,
  meta: null,
};

export const initialState1: Namess = {
  name: [],
};
export const initialState3: Value = {
  value: [],
};

export function cartReducer2(state1: Namess, action: Action): any {
  switch (action.type) {
    case 'ADD_ITEM_WITH_QUANTITY_PAYMENT': {
      const items = addPaymentItem(state1?.name, action.itemPayment);
      return generateFinalState2(state1, items);
    }
    case 'REMOVE_ITEM_PAYMENT': {
      const items = removePaymentItem(state1.name, action.id);
      return generateFinalState2(state1, items);
    }
    case 'RESET_CART_PAYMENT':
      return initialState1;
    default:
      return state1;
  }
}
export function cartReducer3(state1: Value, action: Action): any {
  switch (action.type) {
    case 'ADD_DICOUNT_VALUE': {
      const items = addDiscountVal(state1.value, action.value);
      return generateFinalState3(state1, items);
    }
    case 'RESET_CART':
      return initialState3;
    default:
      return state1;
  }
}

export function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM_WITH_QUANTITY': {
      const items = addItemWithQuantity(
        state.items,
        action.item,
        action.quantity
      );
      return generateFinalState(state, items);
    }

    case 'ADD_ITEM_WITH_QUANTITY_PAYMENT': {
      return generateFinalState(state, []);
    }
    case 'REMOVE_ITEM_OR_QUANTITY': {
      const items = removeItemOrQuantity(
        state.items,
        action.id,
        (action.quantity = 1)
      );
      return generateFinalState(state, items);
    }
    case 'ADD_ITEM': {
      const items = addItem(state.items, action.item);
      return generateFinalState(state, items);
    }
    case 'REMOVE_ITEM': {
      const items = removeItem(state.items, action.id);
      return generateFinalState(state, items);
    }

    case 'UPDATE_ITEM': {
      const items = updateItem(state.items, action.id, action.item);
      return generateFinalState(state, items);
    }
    case 'RESET_CART':
      return initialState;
    default:
      return state;
  }
}
// export function cartReducerSubscription(
//   state: State,
//   action: Action
// ): State {
//   switch (action.type) {

//     case 'REMOVE_ITEM_OR_QUANTITY_SUBSCRIPTION': {
//       const items = removeItemOrQuantitySubscription(
//         state.subscription,
//         action.id,
//         (action.quantity = 1)
//       );
//       return generateFinalStateSubscription(state, items);
//     }

//     case 'ADD_ITEM': {
//       const items = addItemSubscription(state.subscription, action.item);
//       return generateFinalStateSubscription(state, items);
//     }
//     case 'REMOVE_ITEM': {
//       const items = removeItemSubscription(state.subscription, action.id);
//       return generateFinalStateSubscription(state, items);
//     }
//     case 'RESET_CART':
//       return initialState;
//     default:
//       return state;
//   }
// }

const generateFinalState = (state: State, items: Item[]) => {
  const totalUniqueItems = calculateUniqueItems(items);
  return {
    ...state,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    total: calculateTotal(items),
    isEmpty: totalUniqueItems === 0,
  };
};
const generateFinalStateSubscription = (
  state: State,
  items: Subscription[]
) => {
  const totalUniqueItems = calculateUniqueItemsSubscription(items);
  return {
    ...state,
    subscription: calculateItemTotalsSubscription(items),
    totalItems: calculateTotalItemsSubscription(items),
    totalUniqueItems,
    total: calculateTotalSubscription(items),
    isEmpty: totalUniqueItems === 0,
  };
};

const generateFinalState2 = (state: Namess, items: Name[]) => {
  return {
    ...state,
    name: items,
  };
};
const generateFinalState3 = (state: values, val: Value[]) => {
  return {
    ...state,
    value: val,
  };
};
