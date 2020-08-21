import * as actionTypes from '../actions/actionTypes';
import { RootState } from './reducer';

type Modal = RootState['modal'];

interface State extends Modal {}
interface Action extends Modal {
    type: string
}

const initialState = {
    isModalProfileOpen: false,
};

const setIsModalProfileOpen = (state: State, action: Action) => {
    return {
        ...state,
        ...{
            isModalProfileOpen: action.isModalProfileOpen,
        },
    };
};

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_MODAL_PROFILE: return setIsModalProfileOpen(state, action);
        default: return state;
    }
};

export default reducer;
