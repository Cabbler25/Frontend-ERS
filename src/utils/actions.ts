export const userActionTypes = {
    UPDATE_USER_SESSION: 'UPDATE_USER_SESSION'
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