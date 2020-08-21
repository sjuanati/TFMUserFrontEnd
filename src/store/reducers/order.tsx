import * as actionTypes from '../actions/actionTypes';
import { RootState, RootStateOrderItems } from './reducer';

type Order = RootState['order'];

interface State extends Order {}
interface Action extends Order, RootStateOrderItems {
    type: string,
}

const initialState = {
    items: [],
    ordered: false,
    scanned: false,
    price: 0,
    ordersPage: true,
};

// - 4 order actions: add item, remove item, clear cart (when the order is confirmed),
//  order cart (true when the order is confirmed)

// // Add item to the Order. Price is rounded to two decimals
const addItem = (state: State, action: Action) => {
    const newItem = [{
        item_id: action.item_id,
        product_id: action.product_id,
        product_desc: action.product_desc,
        price: action.price,
        dose_qty: action.dose_qty,
        dose_form: action.dose_form,
        leaflet_url: action.leaflet_url,
        screen: '',
        max_date: new Date(),
        prescription: false,
    }];
    state.items = [...state.items, ...newItem];

    let totalPrice = 0;
    state.items.forEach(elem => { totalPrice += elem.price; });
    state.price = Math.round((totalPrice + Number.EPSILON) * 100) / 100;

    return state;
};

// Remove item from the Order
const removeItem = (state: State, action: Action) => {
    state.items = state.items.filter(item => item.item_id !== action.item_id);

    let totalPrice = 0;
    state.items.forEach(elem => { totalPrice += elem.price; });
    state.price = totalPrice;

    return state;
};

// Clear the Order
const clearCart = (state: State, action: Action) => {
    state = {
        items: [],
        ordered: action.ordered,
        scanned: false,
        price: 0,
        ordersPage: true,
    };
    return state;
};

// Order is confirmed
const setOrdered = (state: State, action: Action) => {
    state.ordered = action.ordered;
    return state;
};

// Set OrdersPage
const setOrdersPage = (state: State, action: Action) => {
    state.ordersPage = action.ordersPage;
    return state;
};

// Set Scanned
const setScanned = (state: State, action: Action) => {
    state.scanned = action.scanned;
    return state;
};

const reducer = (state = initialState, action: Action) => {
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
