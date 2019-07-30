import { userActionTypes } from './actions';
import { ParseUserCookie } from './SessionCookies';

const initialState = {
    loggedIn: ParseUserCookie(),
    name: ParseUserCookie ? ParseUserCookie().firstName : ''
};

/**
 * Reducers
 */

export const updateUserSessionReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case userActionTypes.UPDATE_USER_SESSION:
            return {
                ...state,
                loggedIn: action.loggedIn,
                name: action.name
            }
        default: break;
    }
    return state;
}