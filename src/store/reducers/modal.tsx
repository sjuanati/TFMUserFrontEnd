import * as actionTypes from '../actions/actionTypes';
import { RootState } from './reducer';

const initialState = {
    isModalProfileOpen: false,
    type: '',
};

const setIsModalProfileOpen = (state: RootState['modal'], action: RootState['modal']) => {
    return {
        ...state,
        ...{
            isModalProfileOpen: action.isModalProfileOpen,
        },
    };
};

const reducer = (state = initialState, action: RootState['modal']) => {
    switch (action.type) {
        case actionTypes.SET_MODAL_PROFILE: return setIsModalProfileOpen(state, action);
        default: return state;
    }
};

export default reducer;
