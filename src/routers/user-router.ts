import * as userService from '../services/user-service';
import express, { Request, Response } from 'express';
import User from '../models/User';
import { hasPermission } from '../util/utils';
import { roles } from '../models/Role';

const userRouter = express.Router();

// Gets all users
userRouter.get('', async (request: Request, response: Response) => {
    console.log('\nUser Router: Handling get all users...');
    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    const users = await userService.getAllUsers();
    if (users && users.length > 0) {
        response.status(200).json(users);
    } else {
        response.sendStatus(404);
    }
});

// Gets specific user by ID
userRouter.get('/:id', async (req: Request, res: Response) => {
    console.log('\nUser Router: Handling get user by ID...');
    const id = parseInt(req.params.id);
    if (!hasPermission(req, res, roles.FINANCE_MANAGER, id)) return;

    const user = await userService.getUserById(id);
    user ? res.status(200).json(user) : res.sendStatus(404);
});

// Update user
userRouter.patch('', async (req: Request, res: Response) => {
    console.log('\nUser Router: Handling user patch...');
    if (!hasPermission(req, res, roles.ADMIN)) return;

    const err = 'User not found';
    try {
        const user = new User(req.body[0]);
        if (!user) throw err;

        const patchedUser = await userService.updateUser(user);
        if (!patchedUser) throw err;
        res.status(200).json(patchedUser);
    } catch (err) {
        res.sendStatus(400);
    }
});

export default userRouter;