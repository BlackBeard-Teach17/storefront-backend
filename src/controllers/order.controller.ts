import express, { Request, Response } from "express";
import { Order, OrderStore } from "../models/order.model";

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
    try{
        const orders = await store.index();
        res.json(orders);
    }catch(err){
        res.status(400).send(err);
    }
}

const create = async (_req: Request, res: Response) => {
    const order = {
        user_id: _req.body.user_id,
        status: _req.body.status
    }
    try{
        const newOrder = await store.create(order);
        res.json(newOrder);
    }catch(err){
        res.status(400).send(err);
    }
}

const show = async (_req: Request, res: Response) => {
    try{
        const showOrder = await store.show(_req.params.id);
        res.json(showOrder);
    }catch(err){
        res.status(400).send(`Could not find order ${_req.params.id}. Error: ${err}`);
    }
}

const destroy = async (_req: Request, res: Response) => {
    try{
        const deletedOrder = await store.delete(_req.params.id);
        res.json(deletedOrder);
    }catch(err){
        res.status(400).send(`Could not find order ${_req.params.id}. Error: ${err}`);
    }
}

const addProduct = async (_req: Request, res: Response) => {
    const order = {
        order_id: _req.body.order_id,
        product_id: _req.body.product_id,
        quantity: _req.body.quantity
    }
    try{
        const newOrder = await store.addProduct(order.order_id, order.product_id, order.quantity);
        res.json(newOrder);
    }catch(err){
        res.status(400).send(err);
    }
}

const removeProduct = async (_req: Request, res: Response) => {
    const order = {
        order_id: _req.body.order_id,
        product_id: _req.body.product_id,
        quantity: _req.body.quantity
    }
    try{
        const newOrder = await store.removeProduct(order.order_id, order.product_id);
        res.json(newOrder);
    }catch(err){
        res.status(400).send(err);
    }
}

const updateStatus = async (_req: Request, res: Response) => {
    const order: Order = {
        id : parseInt(_req.body.order_id),
        user_id: _req.body.user_id,
        status: _req.body.status
    }
    try{
        const newOrder = await store.update(order);
        res.json(newOrder);
    }catch(err){
        res.status(400).send(err);
    }
}

const deleteOrder = async (_req: Request, res: Response) => {
    try{
        const deletedOrder = await store.delete(_req.params.id);
        res.json(deletedOrder);
    }catch(err){
        res.status(400).send(`Could not find order ${_req.params.id}. Error: ${err}`);
    }
}

const order_routes = (app: express.Application) => {
    app.get('/orders/', index);
    app.post('/orders/create', create);
    app.get('/orders/:id', show);
    app.delete('/orders/:id', destroy);
    app.post('/orders/addProduct', addProduct);
    app.delete('/orders/removeProduct', removeProduct);
    app.put('/orders/updateStatus', updateStatus);
    app.delete('/orders/deleteOrder', deleteOrder);
}

export default order_routes;