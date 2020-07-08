import * as actionTypes from './actionTypes';

export const addItem = (
    item_id,
    product_id,
    product_desc,
    price,
    dose_qty,
    dose_form,
    leaflet_url) =>
    ({
        type: actionTypes.ADD_TO_CART,
        item_id: item_id,
        product_id: product_id,
        product_desc: product_desc,
        price: price,
        dose_qty: dose_qty,
        dose_form: dose_form,
        leaflet_url: leaflet_url,
    });

export const removeItem = (item_id) => ({
    type: actionTypes.REMOVE_FROM_CART,
    item_id: item_id,
});

export const setOrdered = (ordered) => ({
    type: actionTypes.SET_ORDERED,
    ordered: ordered,
});

export const clearCart = (ordered) => ({
    type: actionTypes.CLEAR_CART,
    ordered: ordered,
});

export const setOrdersPage = (ordersPage) => ({
    type: actionTypes.SET_ORDERS_PAGE,
    ordersPage: ordersPage,
});

export const setScanned = (scanned) => ({
    type: actionTypes.SET_SCANNED,
    scanned: scanned,
});