import * as actionTypes from '../actions/actionTypes';

const initialState = {
    favPharmacyID: null,
    favPharmacyDesc: null,
    id: null,
    token: null,
    birthday: null,
    email: null,
    gender: null,
    name: null,
    phone: null,
    address_id: null,
    status: null,
    street: null,
    locality: null,
    province: null,
    zip_code: null,
    country: null
};

const setFavPharmacy = (state, action) => {
    return {
        ...state, 
        ...{favPharmacyID: action.favPharmacyID,
            favPharmacyDesc: action.favPharmacyDesc
        }
    }
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
            phone: action.phone
        }
    }
}

const setAddress = (state, action) => {
    return {
        ...state,
        ...{address_id: action.address_id,
            status: action.status,
            street: action.street,
            locality: action.locality,
            province: action.province,
            zip_code: action.zip_code,
            country: action.country
        }
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_FAV_PHARMACY: return setFavPharmacy(state, action);
        case actionTypes.SET_DATA: return setData(state, action);
        case actionTypes.SET_ADDRESS: return setAddress(state, action);
        default: return state;
    }
};

export default reducer;
