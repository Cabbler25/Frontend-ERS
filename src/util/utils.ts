import { roles } from "../models/Role";

export function hasPermission(req, res, requiredRole, requiredId?): boolean {
    if (!req.cookies.user) {
        console.log('Login required.');
        res.status(401).send({ message: 'User not logged in!' });
        return false;
    }
    if (requiredRole == roles.ALL) return true;

    const userId = req.cookies.user.id;
    const userRole = req.cookies.permissions.role;

    let result = userId == requiredId || userRole == requiredRole;
    if (!result) {
        console.log('Bad permissions.');
        res.status(401).send({ message: 'You are not authorized for this operation' });
        return false;
    }
    return true;
}

export function logQuery(query: string, values?: any) {
    const queryColor: string = '\x1b[32m%s\x1b[0m';
    console.log(queryColor, `${query}`);
    if (values) {
        console.log(`Values: [ ${values} ]`);
    }
}