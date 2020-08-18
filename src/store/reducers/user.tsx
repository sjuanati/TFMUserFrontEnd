import * as actionTypes from '../actions/actionTypes';
import { RootState } from './reducer';

const initialState = {
    favPharmacyID: 0,
    favPharmacyDesc: '',
    favPharmacyEthAddress: '',
    id: 0,
    token: '',
    birthday: new Date(),  //TBC
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
    type: '',
};

const setFavPharmacy = (state: RootState['user'], action: RootState['user']) => {
    return {
        ...state,
        ...{favPharmacyID: action.favPharmacyID,
            favPharmacyDesc: action.favPharmacyDesc,
            favPharmacyEthAddress: action.favPharmacyEthAddress,
        },
    };
};

const setToken = (state: RootState['user'], action: RootState['user']) => {
    return {
        ...state,
        ...{token: action.token},
    };
};

const setData = (state: RootState['user'], action: RootState['user']) => {
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

const setAddress = (state: RootState['user'], action: RootState['user']) => {
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

const reducer = (state = initialState, action: RootState['user']) => {
    switch (action.type) {
        case actionTypes.SET_FAV_PHARMACY: return setFavPharmacy(state, action);
        case actionTypes.SET_TOKEN: return setToken(state, action);
        case actionTypes.SET_DATA: return setData(state, action);
        case actionTypes.SET_ADDRESS: return setAddress(state, action);
        default: return state;
    }
};

export default reducer;
