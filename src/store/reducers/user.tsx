import * as actionTypes from '../actions/actionTypes';
import { RootState } from './reducer';

type User = RootState['user'];

interface State extends User {}
interface Action extends User {
    type: string,
}

const initialState = {
    favPharmacyID: 0,
    favPharmacyDesc: '',
    favPharmacyEthAddress: '',
    id: 0,
    token: '',
    birthday: new Date(),
    email: '',
    gender: '',
    name: '',
    phone: '',
    address_id: 0,
    user_status: 0,
    address_status: 0,
    street: '',
    locality: '',
    province: '',
    zip_code: '',
    country: '',
    photo: '',
    eth_address: '',
};

const setFavPharmacy = (state: State, action: Action) => {
    return {
        ...state,
        ...{favPharmacyID: action.favPharmacyID,
            favPharmacyDesc: action.favPharmacyDesc,
            favPharmacyEthAddress: action.favPharmacyEthAddress,
        },
    };
};

const setToken = (state: State, action: Action) => {
    return {
        ...state,
        ...{token: action.token},
    };
};

const setData = (state: State, action: Action) => {
    return {
        ...state,
        ...{id: action.id,
            token: action.token,
            birthday: action.birthday,
            email: action.email,
            gender: action.gender,
            name: action.name,
            phone: action.phone,
            photo: action.photo,
            user_status: action.user_status,
            eth_address: action.eth_address,
        },
    };
};

const setAddress = (state: State, action: Action) => {
    return {
        ...state,
        ...{address_id: action.address_id,
            address_status: action.address_status,
            street: action.street,
            locality: action.locality,
            province: action.province,
            zip_code: action.zip_code,
            country: action.country,
        },
    };
};

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_FAV_PHARMACY: return setFavPharmacy(state, action);
        case actionTypes.SET_TOKEN: return setToken(state, action);
        case actionTypes.SET_DATA: return setData(state, action);
        case actionTypes.SET_ADDRESS: return setAddress(state, action);
        default: return state;
    }
};

export default reducer;
