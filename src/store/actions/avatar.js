import * as actionTypes from './actionTypes';

export const setAvatar = (photo) => ({
    type: actionTypes.SET_AVATAR,
    photo: photo,
})
