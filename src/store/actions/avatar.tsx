import * as actionTypes from './actionTypes';

export const setAvatar = (photo: boolean) => ({
    type: actionTypes.SET_AVATAR,
    photo: photo,
});

