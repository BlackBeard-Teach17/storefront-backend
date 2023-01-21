import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User, UserStore } from "../models/user.model";
import { verifyAuthToken } from "../middleware/auth.middleware";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    await verifyAuthToken(_req, res, () => {});
    try{
        const users = await store.index();
        if ((_req as any).user.isAdmin === false) 
            res.status(401).send('Unauthorized to view all users.');
        res.json(users);
    }catch(err){
        res.status(400).send(err);
    }
}

const create = async (_req: Request, res: Response) => {
    const user: User = {
        firstname: _req.body.firstname,
        lastname: _req.body.lastname,
        username: _req.body.username,
        is_admin: _req.body.is_admin,
        password: _req.body.password
    }
    try{
        const newUser = await store.create(user);
        const options = {expiresIn: '2h'};
        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign({username: _req.body.username, is_admin: _req.body.is_admin}, secret, options);
        res.json({newUser, token: token});
    }catch(err){
        res.status(400).send(err);
    }
}

const authenticate = async (_req: Request, res: Response) => {
    try{
        const user = await store.authenticate(_req.body.username, _req.body.password);
        const options = {expiresIn: '2h'};
        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign({username: _req.body.username, is_admin: user.is_admin}, secret, options);
        res.json({user: _req.body.username, is_admin: user.is_admin , token: token});
    }catch(err){
        res.status(401).send("Incorrect username or password");
    }
}

const show = async (_req: Request, res: Response) => {
    await verifyAuthToken(_req, res, ()=>{});
    try{ 
        const showUser = await store.show(_req.params.id);
        if (showUser.username !== (_req as any).user.username || (_req as any).user.isAdmin === false)
            res.status(401).send("Unauthorized");
        res.json(showUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const destroy = async (_req: Request, res: Response) => {
    await verifyAuthToken(_req, res, ()=>{});
    try {
        const user = await store.show(_req.params.id);
        if (user.username !== (_req as any).user.username) 
            res.status(401).send("Unauthorized to delete this user");
    } catch (err) {
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }

    try{
        const deletedUser = await store.delete(_req.params.id);
        res.json(deletedUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const updateUsername = async (_req: Request, res: Response) => {
    await verifyAuthToken(_req, res, ()=>{});
    try {
        const user = await store.show(_req.params.id);
        if (user.username !== (_req as any).user.username) 
            res.status(401).send("Unauthorized to update this username");
    } catch (err) {
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
    try{
        const updatedUser = await store.updateUsername(_req.params.id, _req.body.username);
        res.json(updatedUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const updatePassword = async (_req: Request, res: Response) => {
    await verifyAuthToken(_req, res, ()=>{});
    try {
        const user = await store.show(_req.params.id);
        if (user.username !== (_req as any).user.username) 
            res.status(401).send("Unauthorized to update this user password");
    } catch (err) {
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
    try{
        const updatedUser = await store.updateUserPassword(_req.params.id, _req.body.password);
        res.json(updatedUser);
    } catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}



const user_routes = (app: express.Application) => {
    app.get('/users/', verifyAuthToken, index);
    app.post('/users/create', create);
    app.post('/users/authenticate', authenticate);
    app.get('/users/:id', verifyAuthToken, show);
    app.delete('/users/:id', verifyAuthToken, destroy);
    app.put('/users/:id/username', verifyAuthToken, updateUsername);
    app.put('/users/:id/password', verifyAuthToken, updatePassword);
}

export default user_routes;