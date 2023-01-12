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

const show = async (_req: Request, res: Response) => {
    try{
        const showProduct = await store.show(_req.params.id);
        res.json(showProduct);
    } catch(err)
    {
        throw new Error(`Could not find product ${_req.params.id}. Error: ${err}`);
    }
}
const updateAll = async (_req: Request, res: Response) => {
    const product: Product = {
        id: parseInt(_req.params.id),
        name: _req.body.name,
        price: _req.body.price,
        category: _req.body.category
    }

    try{
        const updatedProduct = await store.updateAll(product);
        res.json(updatedProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const updateName = async (_req: Request, res: Response) => {

    try{
        const updatedProduct = await store.updateProductName(_req.params.id, _req.body.name);
        res.json(updatedProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const updatePrice = async (_req: Request, res: Response) => {
    try{
        const updatedProduct = await store.updateProductPrice(_req.params.id, _req.body.price);
        res.json(updatedProduct);
    } catch(err)
    {
        throw new Error(`Could not update product ${_req.params.id}. Error: ${err}`);
    }
}

const updateProductCategory = async (_req: Request, res: Response) => {
    try{
        const updatedProduct = await store.updateProductCategory(_req.params.id, _req.body.category);
        res.json(updatedProduct);
    } catch(err)
    {
        throw new Error(`Could not update product ${_req.params.id}. Error: ${err}`);
    }
}

const destroy = async (_req: Request, res: Response) => {
    try{
        const deletedProduct = await store.delete(_req.params.id);
        res.json(deletedProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const product_routes = (app: express.Application) => {
    app.get('/products/', index);
    app.post('/products/create', create);
    app.get('/products/:id', show);
    app.put('/products/update/:id', updateAll);
    app.put('/products/update/:id/name', updateName);
    app.put('/products/update/:id/price', updatePrice);
    app.put('/products/update/:id/category', updateProductCategory);
    app.delete('/products/:id', destroy);
}

export default product_routes;

