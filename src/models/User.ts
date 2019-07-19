export default class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    role: number;
    
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id;
        this.username = obj.username;
        this.password = obj.password;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.role = obj.role;
    }

    static getColumns(): string {
        return 'id, username, password, first_name "firstName", last_name "lastName", email, role';
    }
}