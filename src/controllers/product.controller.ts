import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product.model";
import { verifyAuthToken } from "../middleware/auth.middleware";

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
        if (!product.name || !product.price || !product.category) {
            res.status(400);
            res.json('Product name, price and category are required');
        }
        if (isNaN(product.price) || product.price < 0) {
            res.status(400);
            res.json('Product price must be a positive number');
        }
        if ((_req as any).user.is_admin === false)
            res.status(401).send('Unauthorized to create product');
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
        res.status(400).send(`Could not find product ${_req.params.id}. Error: ${err}`);
    }
}

const getByCategory = async (_req: Request, res: Response) => {
    try{
        const showProduct = await store.getByCategory(_req.params.category);
        res.json(showProduct);
    } catch(err)
    {
        res.status(400).send(`Could not find product ${_req.params.id}. Error: ${err}`);
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
        if ((_req as any).user.is_admin === false)
            res.status(401).send('Unauthorized to update product');
        const updatedProduct = await store.updateAll(product);
        res.json(updatedProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const updateName = async (_req: Request, res: Response) => {
    try{
        if ((_req as any).user.is_admin === false)
            res.status(401).send('Unauthorized to update product name');
        const updatedProduct = await store.updateProductName(_req.params.id, _req.body.name);
        res.json(updatedProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const updatePrice = async (_req: Request, res: Response) => {
    try{
        if ((_req as any).user.is_admin === false)
            res.status(401).send('Unauthorized to update product price');
        const updatedProduct = await store.updateProductPrice(_req.params.id, _req.body.price);
        res.json(updatedProduct);
    } catch(err)
    {
        res.status(400).send(`Could not update product ${_req.params.id}. Error: ${err}`);
    }
}

const updateProductCategory = async (_req: Request, res: Response) => {
    try{
        if ((_req as any).user.is_admin === false)
            res.status(401).send('Unauthorized to update product category');
        const updatedProduct = await store.updateProductCategory(_req.params.id, _req.body.category);
        res.json(updatedProduct);
    } catch(err)
    {
        res.status(400).send(`Could not update product ${_req.params.id}. Error: ${err}`);
    }
}

const destroy = async (_req: Request, res: Response) => {
    try{
        if ((_req as any).user.is_admin === false)
            res.status(401).send('Unauthorized to delete product');
        const deletedProduct = await store.delete(_req.params.id);
        res.json(deletedProduct);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const product_routes = (app: express.Application) => {
    app.get('/products/', index);
    app.post('/products/create', verifyAuthToken, create);
    app.get('/products/:id', show);
    app.get('/products/:category', getByCategory);
    app.put('/products/update/:id', verifyAuthToken, updateAll);
    app.put('/products/update/:id/name', verifyAuthToken, updateName);
    app.put('/products/update/:id/price', verifyAuthToken, updatePrice);
    app.put('/products/update/:id/category', verifyAuthToken, updateProductCategory);
    app.delete('/products/:id', verifyAuthToken, destroy);
}

export default product_routes;

