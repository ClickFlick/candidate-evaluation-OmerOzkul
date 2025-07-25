export const userDataReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART": {
      return { ...state, cartProducts: [...action.payload] };
    }

    case "SET_ADDRESS": {
      return { ...state, addressList: [...action.payload] };
    }

    case "SET_WISHLIST": {
      return { ...state, wishlistProducts: [...action.payload] };
    }

    case "SET_ORDER": {
      return {
        ...state,
        orderDetails: {
          ...state.orderDetails,
          ...action.payload,
        },
      };
    }

    case "SET_ORDERS": {
      return { ...state, orders: [...state.orders, { ...action.payload }] };
    }

    case "SET_BALANCE": {
      return { ...state, balance: Number(action.payload) };
    }

    default:
      return state;
  }
};

export const initialUserData = {
  cartProducts: [],
  wishlistProducts: [],
  addressList: [],
  isOwner: false,
  balance: 100, // default balance for users can be anything
  orders: [],
  orderDetails: {
    cartItemsTotal: "",
    cartItemsDiscountTotal: "",
    couponDiscountTotal: "",
    orderAddress: "",
    orderId: "",
  },
};
