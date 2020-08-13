import * as actionTypes from '../actions/actionTypes';

const initialState = {
    favPharmacyID: null,
    favPharmacyDesc: null,
    favPharmacyEthAddress: null,
    id: null,
    token: null,
    birthday: null,
    email: null,
    gender: null,
    name: null,
    phone: null,
    address_id: null,
    user_status: null,
    address_satus: null,
    street: null,
    locality: null,
    province: null,
    zip_code: null,
    country: null,
    photo: null,
    eth_address: null,
};

const setFavPharmacy = (state, action) => {
    return {
        ...state,
        ...{favPharmacyID: action.favPharmacyID,
            favPharmacyDesc: action.favPharmacyDesc,
            favPharmacyEthAddress: action.favPharmacyEthAddress,
        },
    };
};

const setToken = (state, action) => {
    return {
        ...state,
        ...{token: action.token},
    };
};

const setData = (state, action) => {
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

const setAddress = (state, action) => {
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

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_FAV_PHARMACY: return setFavPharmacy(state, action);
        case actionTypes.SET_TOKEN: return setToken(state, action);
        case actionTypes.SET_DATA: return setData(state, action);
        case actionTypes.SET_ADDRESS: return setAddress(state, action);
        default: return state;
    }
};

export default reducer;
