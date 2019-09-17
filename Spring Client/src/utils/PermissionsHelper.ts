const HasPermissions = (role: string, userRole: any): boolean => {
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

    return userRole && userRole.id <= roleNum;
}

export default HasPermissions;
