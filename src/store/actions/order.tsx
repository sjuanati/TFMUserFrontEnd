import * as actionTypes from './actionTypes';

export const addItem = (
    item_id: number,
    product_id: number,
    product_desc: string,
    price: number,
    dose_qty: string,
    dose_form: string,
    leaflet_url: string) =>
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

export const removeItem = (item_id: number) => ({
    type: actionTypes.REMOVE_FROM_CART,
    item_id: item_id,
});

export const setOrdered = (ordered: boolean) => ({
    type: actionTypes.SET_ORDERED,
    ordered: ordered,
});

export const clearCart = (ordered: boolean) => ({
    type: actionTypes.CLEAR_CART,
    ordered: ordered,
});

export const setOrdersPage = (ordersPage: boolean) => ({
    type: actionTypes.SET_ORDERS_PAGE,
    ordersPage: ordersPage,
});

export const setScanned = (scanned: boolean) => ({
    type: actionTypes.SET_SCANNED,
    scanned: scanned,
});
