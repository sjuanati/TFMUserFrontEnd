import * as actionTypes from '../actions/actionTypes';

// - 4 order actions: add item, remove item, clear cart (when the order is confirmed),
//  order cart (true when the order is confirmed)

const initialState = {
    items: [],
    ordered: false,
    scanned: false,
};

// // Add item to the Order
const addItem = (state, action) => {
    const newItem = [{
        item_id_tmp: action.item_id_tmp,
        item_description: action.item_description,
        //itemPhoto: action.itemPhoto
    }];
    state.items = [...state.items, ...newItem];
    return state;
};

// Remove item from the Order
const removeItem = (state, action) => {
    state.items = state.items.filter(item => item.item_id_tmp !== action.item_id_tmp);
    return state;
};

// Clear the Order
const clearCart = (state, action) => {
    state = {
        items: [],
        ordered: action.ordered
    };
    return state;
};

// Order is confirmed
const setOrdered = (state, action) => {
    state.ordered = action.ordered;
    return state;
};

// Set OrdersPage
const setOrdersPage = (state, action) => {
  state.ordersPage = action.ordersPage;
  return state;
};

// Set Scanned
const setScanned = (state, action) => {
    state.scanned = action.scanned;
    return state;
  };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TO_CART: return addItem(state, action);
        case actionTypes.REMOVE_FROM_CART: return removeItem(state, action);
        case actionTypes.CLEAR_CART: return clearCart(state, action);
        case actionTypes.SET_ORDERED: return setOrdered(state, action);
        case actionTypes.SET_ORDERS_PAGE: return setOrdersPage(state, action);
        case actionTypes.SET_SCANNED: return setScanned(state, action);
        default: return state;
    }
};

export default reducer;