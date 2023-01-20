import express, { Request, Response } from 'express';
import { verifyAuthToken } from '../middleware/auth.middleware';
import { AdminStore } from "../models/admin.model";

const store = new AdminStore();

const top5Products = async (req: Request, res: Response) => {
    await verifyAuthToken(req, res, ()=>{});
    try{
        console.log('top5Products');
        const top5 = await store.top5Products();
        res.json(top5);
    }catch(err){
        res.status(400).send(err);
    }
};

const usersWithOrders = async (req: Request, res: Response) => {
    await verifyAuthToken(req, res, ()=>{});
    try{
        const users = await store.usersWithOrders();
        res.json(users);
    }catch(err){
        res.status(400).send(err);
    }
};

const admin_routes = (app: express.Application) => { 
    app.get('/admin/top5products', verifyAuthToken, top5Products);
    app.get('/admin/userswithorders', verifyAuthToken, usersWithOrders);
}

export default admin_routes;