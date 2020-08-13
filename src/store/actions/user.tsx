import * as actionTypes from './actionTypes';

export const setFavPharmacy = (
    favPharmacyID: number,
    favPharmacyDesc: string,
    favPharmacyEthAddress: string) =>
    ({
    type: actionTypes.SET_FAV_PHARMACY,
    favPharmacyID: favPharmacyID,
    favPharmacyDesc: favPharmacyDesc,
    favPharmacyEthAddress: favPharmacyEthAddress,
});

export const setToken = (token: string) => ({
    type: actionTypes.SET_TOKEN,
    token: token,
});

export const setData = (
    id: number,
    token: string,
    birthday: Date,
    email: string,
    gender: string,
    name: string,
    phone: string,
    photo: string,
    user_status: number,
    eth_address: string) =>
    ({
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
});

export const setAddress = (
    address_id: string,
    address_status: number,
    street: string,
    locality: string,
    province: string,
    zip_code: string,
    country: string) =>
    ({
    type: actionTypes.SET_ADDRESS,
    address_id: address_id,
    address_status: address_status,
    street: street,
    locality: locality,
    province: province,
    zip_code: zip_code,
    country: country,
});
