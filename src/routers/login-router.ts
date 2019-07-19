import express, { Request, Response } from 'express';
import * as loginService from '../services/login-service';

// 5 minute timeout
const loginRouter = express.Router();
const bcrypt = require('bcrypt');
const err: string = 'Invalid Credentials';
const timeout: number = 1000 * 60 * 5;

loginRouter.post('', async (req: Request, res: Response) => {
    console.log('\nLogin Router: Handling user sign in...');
    // Get user info
    let username = req.body[0].username;
    let plainText = req.body[0].password;

    try {
        // Find user by username
        const user = await loginService.logIn(username);
        if (!user) throw err;

        // Compare its plain text password to its hash
        const matches: boolean = await bcrypt.compare(plainText, user.password);
        if (!matches) throw err;

        // Get users role
        const role = await loginService.getRole(user.role);

        // Assign cookies and return logged in user
        res.cookie('user', { id: user.id }, { maxAge: timeout });
        res.cookie('permissions', { id: role.id, role: role.role }, { maxAge: timeout });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

export default loginRouter;
