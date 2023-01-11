import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product.model";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    try{
        const products = await store.index();
        if (!products) {
            res.status(400);
            res.json('No products found');
        }
        res.json(products);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
   
}

const create = async (_req: Request, res: Response) => {
    const product: Product = {
        name: _req.body.name,
        price: _req.body.price,
        category: _req.body.category
    }

    try{
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const product_routes = (app: express.Application) => {
    app.get('/products', index);
    app.post('/products/create', create);
}

export default product_routes;

