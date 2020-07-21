import * as actionTypes from './actionTypes';

export const setFavPharmacy = (favPharmacyID, favPharmacyDesc) => ({
    type: actionTypes.SET_FAV_PHARMACY,
    favPharmacyID: favPharmacyID,
    favPharmacyDesc: favPharmacyDesc
});

export const setData = (id, token, birthday, email, gender, name, phone, photo, user_status, eth_address) => ({
    type: actionTypes.SET_DATA,
    id: id,
    token: token,
    birthday: birthday,
    email: email,
    gender: gender,
    name: name,
    phone: phone,
    photo: photo,
    user_status: user_status,
    eth_address: eth_address,
})

export const setAddress = (address_id, address_status, street, locality, province, zip_code, country) => ({
    type: actionTypes.SET_ADDRESS,
    address_id: address_id,
    address_status: address_status,
    street: street,
    locality: locality,
    province: province,
    zip_code: zip_code,
    country: country
})
