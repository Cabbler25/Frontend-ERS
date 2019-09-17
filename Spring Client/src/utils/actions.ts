export const userActionTypes = {
    UPDATE_USER_SESSION: 'UPDATE_USER_SESSION',
    LOGOUT: 'LOGOUT'
}

export const screenActionTypes = {
    UPDATE_SCREEN: 'UPDATE_SCREEN'
}
/*
 * action creators
 */

export const updateUserSession = (payload?: any) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_SESSION,
        payload: payload
    })
}

export const logout = () => (dispatch: any) => {
    dispatch({
        type: userActionTypes.LOGOUT
    })
}

export const updateScreen = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: screenActionTypes.UPDATE_SCREEN,
        isLargeScreen: val
    })
}
