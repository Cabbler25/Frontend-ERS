export const roles = {
    ADMIN: 'admin',
    FINANCE_MANAGER: 'finance-manager',
    EMPLOYEE: 'employee',
    ALL: 'all'
}

export default class Role {
    id: number;
    role: string;

    constructor(obj) {
        this.id = obj.id;
        this.role = obj.role;
    }

    static getColumns(): string {
        return 'id, role';
    }
}