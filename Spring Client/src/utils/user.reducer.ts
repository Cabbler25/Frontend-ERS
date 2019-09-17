import { userActionTypes } from './actions';

const initialState = {
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: {},
    token: ''
};

/**
 * Reducers
 */

export const updateUserSessionReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case userActionTypes.UPDATE_USER_SESSION:
            return {
                ...state,
                ...action.payload
            }
        case userActionTypes.LOGOUT:
            return {
                initialState
            }
        default: break;
    }
    return state;
}
