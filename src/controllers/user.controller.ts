import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserStore } from "../models/user.model";
import { verifyAuthToken } from "../middleware/auth.middleware";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try{
        const users = await store.index();
        res.json(users);
    }catch(err){
        res.status(400).send(err);
    }
}

const create = async (_req: Request, res: Response) => {
    const user = {
        username: _req.body.username,
        password: _req.body.password
    }
    try{
        const newUser = await store.create(user);
        res.json(newUser);
    }catch(err){
        res.status(400).send(err);
    }
}

const authenticate = async (_req: Request, res: Response) => {
    try{
        const user = await store.authenticate(_req.body.username, _req.body.password);
        const options = {expiresIn: '2h'};
        const token = jwt.sign({user}, process.env.JWT_SECRET as string, options);
        res.set('Authorization', 'Bearer ${token}');
        res.json(token);
    }catch(err){
        res.status(401).send("Incorrect username or password");
    }
}

const show = async (_req: Request, res: Response) => {
    try{
        const showUser = await store.show(_req.params.id);
        res.json(showUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const destroy = async (_req: Request, res: Response) => {
    try{
        const deletedUser = await store.delete(_req.params.id);
        res.json(deletedUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const updateUsername = async (_req: Request, res: Response) => {
    try{
        verifyAuthToken(_req, res, ()=>{});
        const updatedUser = await store.updateUsername(_req.params.id, _req.body.username);
        res.json(updatedUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const updatePassword = async (_req: Request, res: Response) => {
    try{
        const updatedUser = await store.updateUserPassword(_req.params.id, _req.body.password);
        res.json(updatedUser);
    }catch(err){
        res.status(400).send(`Could not find user ${_req.params.id}. Error: ${err}`);
    }
}

const user_routes = (app: express.Application) => {
    app.get('/users/', index);
    app.post('/users/create', create);
    app.post('/users/authenticate', authenticate);
    app.get('/users/:id', show);
    app.delete('/users/:id', destroy);
    app.put('/users/:id/username', updateUsername);
    app.put('/users/:id/password', updatePassword);
}

export default user_routes;