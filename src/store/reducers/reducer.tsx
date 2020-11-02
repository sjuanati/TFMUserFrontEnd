import { useSelector, TypedUseSelectorHook } from 'react-redux';

export interface RootStateOrderItems {
  item_id: number,
  product_id: number,
  product_desc: string,
  price: number,
  dose_qty: string,
  dose_form: string,
  leaflet_url: string,
  screen: string,
  max_date: Date,
  prescription: boolean
}

export interface RootState {
  modal: {
    isModalProfileOpen: boolean,
  },
  order: {
    items: RootStateOrderItems[],
    ordered: boolean,
    scanned: boolean,
    price: number,
    ordersPage: boolean,
  },
  user: {
    favPharmacyID: number,
    favPharmacyDesc: string,
    favPharmacyEthAddress: string,
    id: number,
    token: string,
    birthday: Date,
    email: string,
    gender: string,
    name: string,
    phone: string,
    address_id: number,
    user_status: number,
    address_status: number,
    street: string,
    locality: string,
    province: string,
    zip_code: string,
    country: string,
    photo: string,
    eth_address: string,
    eth_pk: string,
  },
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
