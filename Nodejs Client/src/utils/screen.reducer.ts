import { screenActionTypes } from './actions';

const initialState = {
    isLargeScreen: window.matchMedia('(min-width: 700px)').matches
};

/**
 * Reducers
 */

export const updateScreenReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case screenActionTypes.UPDATE_SCREEN:
            return {
                ...state,
                isLargeScreen: action.isLargeScreen
            }
        default: break;
    }
    return state;
}