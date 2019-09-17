export const userActionTypes = {
    UPDATE_USER_SESSION: 'UPDATE_USER_SESSION'
}

export const screenActionTypes = {
    UPDATE_SCREEN: 'UPDATE_SCREEN'
}
/*
 * action creators
 */

export const updateUserSession = (val: boolean, name: string) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_SESSION,
        loggedIn: val,
        name: name
    })
}

export const updateScreen = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: screenActionTypes.UPDATE_SCREEN,
        isLargeScreen: val
    })
}