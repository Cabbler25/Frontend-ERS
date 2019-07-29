import Cookies from "js-cookie";

export const ParseUserCookie = () => {
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

export const HasPermissions = (role: string): boolean => {
    let roleNum;
    switch (role) {
        case 'admin':
            roleNum = 1;
            break;
        case 'finance-manager':
            roleNum = 2;
            break;
        case 'user':
            roleNum = 3;
            break;
        default:
            roleNum = 4;
    }

    let permissions = ParsePermissionCookie();
    return permissions && permissions.id <= roleNum;
}

export const ParsePermissionCookie = () => {
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

export const UpdateCookies = (newUser: any) => {
    // Behold, the ugliness of deciding to set a fucking j:
    // in front of the fucking cookie
    Cookies.set('user', `j:${JSON.stringify(newUser)}`);
    let roleId = newUser.role;
    let role = '';
    switch (roleId) {
        case 1:
            role = 'admin';
            break;
        case 2:
            role = 'finance-manager';
            break;
        case 3:
            role = 'user';
            break;
        default:
            role = 'user';
            break;
    }
    const cookie = { id: roleId, role: role };
    Cookies.set('permissions', `j:${JSON.stringify(cookie)}`);
}

const RefreshCookies = () => {
    let userCookie = Cookies.getJSON('user');
    let permissionsCookie = Cookies.getJSON('permissions');
    if (userCookie && userCookie.id) {
        Cookies.set('user', userCookie);
    }
    if (permissionsCookie && permissionsCookie.id) {
        Cookies.set('permissions', permissionsCookie);
    }
}

export default RefreshCookies;