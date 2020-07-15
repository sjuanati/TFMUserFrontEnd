import * as actionTypes from './actionTypes';

export const setIsModalProfileOpen = (isModalProfileOpen) => ({
    type: actionTypes.SET_MODAL_PROFILE,
    isModalProfileOpen: isModalProfileOpen,
});
