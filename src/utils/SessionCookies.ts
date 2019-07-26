import Cookies from "js-cookie";

export const inFiveMinutes = new Date(new Date().getTime() + 50 * 60 * 1000);

export const parseUserCookie = () => {
    let user;
    try {
        user = Cookies.getJSON('user');
        if (user) user = user.slice(2);
        user = JSON.parse(user);
    } catch (err) {
        user = undefined;
    }
    return user;
}

export const parsePermissionCookie = () => {
    let permissions;
    try {
        permissions = Cookies.getJSON('permissions');
        if (permissions) permissions = permissions.slice(2);
        permissions = JSON.parse(permissions);
    } catch (err) {
        permissions = undefined;
    }
    return permissions;
}

const RefreshCookies = () => {
    let userCookie = Cookies.getJSON('user');
    let permissionsCookie = Cookies.getJSON('permissions');
    if (userCookie && userCookie.id) {
        Cookies.set('user', userCookie, {
            expires: inFiveMinutes
        });
    }
    if (permissionsCookie && permissionsCookie.id) {
        Cookies.set('permissions', permissionsCookie, {
            expires: inFiveMinutes
        });
    }
}

export default RefreshCookies;