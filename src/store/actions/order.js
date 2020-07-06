import * as actionTypes from './actionTypes';

export const addItem = (item_id_tmp, item_description, itemPhoto) => ({
    type: actionTypes.ADD_TO_CART,
    item_id_tmp: item_id_tmp,
    item_description: item_description,
    //itemPhoto: itemPhoto,
});

export const removeItem = (item_id_tmp) => ({
    type: actionTypes.REMOVE_FROM_CART,
    item_id_tmp: item_id_tmp,
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