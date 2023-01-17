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
        res.status(400).send('Could not create order. Error: ${err}');
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
        order_id: _req.params.id,
        product_id: _req.body.product_id,
        quantity: _req.body.quantity
    }
    try{
        const newOrder = await store.addToCart(order.order_id, order.product_id, order.quantity);
        res.json(newOrder);
    }catch(err){
        res.status(400).send(err);
    }
}

const removeProduct = async (_req: Request, res: Response) => {
    const order = {
        order_id: _req.params.id,
        product_id: _req.body.product_id,
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
        id : parseInt(_req.params.id),
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

const getOrderItems = async (_req: Request, res: Response) => {
    try{
        const getOrderItem = await store.getCartItems(parseInt(_req.params.id));
        res.json(getOrderItem);
    } catch(err){
        res.status(400).send(`Could not find order ${_req.params.id}. Error: ${err}`);
    }
}

const order_routes = (app: express.Application) => {
    app.get('/orders/', index);
    app.post('/orders/create', create);
    app.get('/orders/:id', show);
    app.delete('/orders/:id', destroy);
    app.post('/orders/:id/addProduct', addProduct);
    app.delete('/orders/:id/removeProduct', removeProduct);
    app.put('/orders/:id/updateStatus', updateStatus);
    app.delete('/orders/:id', deleteOrder);
    app.get('/orders/:id/getOrderItems', getOrderItems);
}

export default order_routes;