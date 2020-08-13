import { useSelector, TypedUseSelectorHook } from 'react-redux';

interface RootState {
  avatar: {
      photo: string,
  },
  modal: {
    isModalProfileOpen: boolean,
  },
  order: {
    items: string[], // ***** NOT SURE
    ordered: boolean,
    scanned: boolean,
    price: number,
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
    address_id: string[],
    user_status: number,
    address_satus: number,
    street: string,
    locality: string,
    province: string,
    zip_code: string,
    country: string,
    photo: string,
    eth_address: string,
  }
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
