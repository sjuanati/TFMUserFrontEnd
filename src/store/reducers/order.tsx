import * as actionTypes from '../actions/actionTypes';
import { RootState, RootStateOrderItems } from './reducer';

// - 4 order actions: add item, remove item, clear cart (when the order is confirmed),
//  order cart (true when the order is confirmed)

const initialState = {
    items: [],
    ordered: false,
    scanned: false,
    price: 0,
    ordersPage: true,
    type: '', //TBC
};

//interface RootStates extends Array<RootState['order']['items']>{}

// // Add item to the Order. Price is rounded to two decimals
const addItem = (state: RootState['order'], action: RootState['order'] & RootStateOrderItems) => {
    const newItem = [{
        item_id: action.item_id,
        product_id: action.product_id,
        product_desc: action.product_desc,
        price: action.price,
        dose_qty: action.dose_qty,
        dose_form: action.dose_form,
        leaflet_url: action.leaflet_url,
    }];
    state.items = [...state.items, ...newItem];

    let totalPrice = 0;
    state.items.forEach(elem => { totalPrice += elem.price; });
    state.price = Math.round((totalPrice + Number.EPSILON) * 100) / 100;

    return state;
};

// Remove item from the Order
const removeItem = (state: RootState['order'], action: RootStateOrderItems) => {
    state.items = state.items.filter(item => item.item_id !== action.item_id);

    let totalPrice = 0;
    state.items.forEach(elem => { totalPrice += elem.price; });
    state.price = totalPrice;

    return state;
};

// Clear the Order
const clearCart = (state: RootState['order'], action: RootState['order']) => {
    state = {
        items: [],
        ordered: action.ordered,
        scanned: false,
        price: 0,
        ordersPage: true,
        type: '', //TBC
    };
    return state;
};

// Order is confirmed
const setOrdered = (state: RootState['order'], action: RootState['order']) => {
    state.ordered = action.ordered;
    return state;
};

// Set OrdersPage
const setOrdersPage = (state: RootState['order'], action: RootState['order']) => {
    state.ordersPage = action.ordersPage;
    return state;
};

// Set Scanned
const setScanned = (state: RootState['order'], action: RootState['order']) => {
    state.scanned = action.scanned;
    return state;
};

const reducer = (state = initialState, action: RootState['order'] & RootStateOrderItems) => {
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
