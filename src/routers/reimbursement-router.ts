import * as reimbursementService from "../services/reimbursement-service";
import express, { Request, Response } from 'express';
import Reimbursement from "../models/Reimbursement";
import { hasPermission } from '../util/utils';
import { roles } from '../models/Role';

const reimbursementRouter = express.Router();

// Gets reimbursement by user ID
reimbursementRouter.get('/author/userId/:userId', async (req: Request, res: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by user...');
    const id = parseInt(req.params.userId);
    if (!hasPermission(req, res, roles.FINANCE_MANAGER, id)) return;

    const rmbmnt = await reimbursementService.getReimbursementByUser(id);
    if (rmbmnt && rmbmnt.length > 0) {
        res.status(200).json(rmbmnt);
    } else {
        res.sendStatus(404);
    }
});

// Gets reimbursement by status ID
reimbursementRouter.get('/status/:statusId', async (req: Request, res: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by status...');
    const id = parseInt(req.params.statusId);
    if (!hasPermission(req, res, roles.FINANCE_MANAGER)) return;

    const rmbmnt = await reimbursementService.getReimbursementByStatus(id);
    if (rmbmnt && rmbmnt.length > 0) {
        res.status(200).json(rmbmnt);
    } else {
        res.sendStatus(404);
    }
});

// Update reimbursement
reimbursementRouter.patch('', async (req: Request, res: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement patch...');
    if (!hasPermission(req, res, roles.FINANCE_MANAGER)) return;

    const err = 'Reimbursement not found';
    try {
        const rmbmnt = new Reimbursement(req.body[0]);
        if (!rmbmnt) throw err;

        const patchedRmbmnt = await reimbursementService.updateReimbursement(rmbmnt);
        if (!patchedRmbmnt) throw err;
        res.status(201).json(patchedRmbmnt);
    } catch (err) {
        res.sendStatus(400);
    }
});

// Submit reimbursement
reimbursementRouter.post('', async (req: Request, res: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement submit...');
    if (!hasPermission(req, res, roles.ALL)) return;

    const err = 'Reimbursement not valid';
    try {
        const rmbmnt = new Reimbursement(req.body[0]);
        if (!rmbmnt) throw err;

        const completedRmbmnt = await reimbursementService.submitReimbursement(rmbmnt, req.cookies.user.id);
        if (!completedRmbmnt) throw err;
        res.status(200).json(completedRmbmnt);
    } catch (err) {
        res.sendStatus(400);
    }
});

export default reimbursementRouter; 