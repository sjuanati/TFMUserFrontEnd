import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isModalProfileOpen: false,
};

const setIsModalProfileOpen = (state, action) => {
    return {
        ...state,
        ...{
            isModalProfileOpen: action.isModalProfileOpen
        }
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_MODAL_PROFILE: return setIsModalProfileOpen(state, action);
        default: return state;
    }
};

export default reducer;
