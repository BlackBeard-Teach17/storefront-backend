import supertest from 'supertest';
import { ProductStore } from '../../models/product.model';
import app from '../../server';

const store = new ProductStore();

describe('Product Models', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have an updateAll method', () => {
        expect(store.updateAll).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
});

describe('Product Controller', () => {
    it('[GET] before index route should return an empty list', async () => {
        const response = await supertest(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
    it('[POST] create route should add a product', async () => {
        const response = await supertest(app)
            .post('/products/create')
            .send({
                name: 'Test Product',
                price: 100,
                category: 'Test'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] index route should return a list of products', async () => {
        const response = await supertest(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{id: 2,
            name: 'Test Product',
            price: 100,
            category: 'Test'}]);
    });
    it('[GET] show route should return the correct product', async () => {
        const response = await supertest(app).get('/products/2');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 2,
            name: 'Test Product',
            price: 100,
            category: 'Test'
        });
    });
    it('[PUT] update route should update a product', async () => {
        const response = await supertest(app)
            .put('/products/update/2')
            .send({
                name: 'Product Test',
                price: 150,
                category: 'Tester'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] show route should return the updated product', async () => {
        const response = await supertest(app).get('/products/2');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 2,
            name: 'Product Test',
            price: 150,
            category: 'Tester'
        });
    });
    it('[PUT] updateName route should update a product name', async () => {
        const response = await supertest(app)
            .put('/products/update/2/name')
            .send({
                name: 'Test Product'
            });
        expect(response.status).toBe(200);
    });
    it('[PUT] updatePrice route should update a product price', async () => {
        const response = await supertest(app)
            .put('/products/update/2/price')
            .send({
                price: 200
            });
        expect(response.status).toBe(200);
    });
    it('[PUT] updateCategory route should update a product category', async () => {
        const response = await supertest(app)
            .put('/products/update/2/category')
            .send({
                category: 'NewTestCategory'
            });
        expect(response.status).toBe(200);
    });
    it('[DELETE] route should delete a product', async () => {
        const response = await supertest(app).delete('/products/2');
        expect(response.status).toBe(200);
    });
});