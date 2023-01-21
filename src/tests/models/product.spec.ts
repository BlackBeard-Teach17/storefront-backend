import supertest from 'supertest';
import { ProductStore } from '../../models/product.model';
import client from '../../configs/database.config';
import app from '../../server';

const store = new ProductStore();
let product_token: string;
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
    beforeAll(async () => {
        const user = await supertest(app).post('/users/create').send({
            firstname: 'Test',
            lastname: 'Test',
            username: 'Test',
            is_admin: true,
            password: 'password'
        });
    product_token = user.body.token;
    });
    afterAll(async() => {
        const conn = await client.connect();
        const sql = 'TRUNCATE users, products, orders, order_products RESTART IDENTITY CASCADE';
        await conn.query(sql);
    });
    it('[GET] before index route should return an empty list', async () => {
        const response = await supertest(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
    it('[POST] create route should add a product', async () => {
        const response = await supertest(app)
            .post('/products/create').set('Authorization', `Bearer ${product_token}`)
            .send({
                name: 'Test Product',
                price: 100,
                category: 'Test'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] index route should return a list of products', async () => {
        const response = await supertest(app).get('/products').set('Authorization', `Bearer ${product_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{id: 1,
            name: 'Test Product',
            price: 100,
            category: 'Test'}]);
    });
    it('[GET] show route should return the correct product', async () => {
        const response = await supertest(app).get('/products/1').set('Authorization', `Bearer ${product_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Test Product',
            price: 100,
            category: 'Test'
        });
    });
    it('[PUT] update route should update a product', async () => {
        const response = await supertest(app)
            .put('/products/update/1').set('Authorization', `Bearer ${product_token}`)
            .send({
                name: 'Product Test',
                price: 150,
                category: 'Tester'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] show route should return the updated product', async () => {
        const response = await supertest(app).get('/products/1').set('Authorization', `Bearer ${product_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Product Test',
            price: 150,
            category: 'Tester'
        });
    });
    it('[PUT] updateName route should update a product name', async () => {
        const response = await supertest(app)
            .put('/products/update/2/name').set('Authorization', `Bearer ${product_token}`)
            .send({
                name: 'Test Product'
            });
        expect(response.status).toBe(200);
    });
    it('[PUT] updatePrice route should update a product price', async () => {
        const response = await supertest(app)
            .put('/products/update/2/price').set('Authorization', `Bearer ${product_token}`)
            .send({
                price: 200
            });
        expect(response.status).toBe(200);
    });
    it('[PUT] updateCategory route should update a product category', async () => {
        const response = await supertest(app)
            .put('/products/update/2/category').set('Authorization', `Bearer ${product_token}`)
            .send({
                category: 'NewTestCategory'
            });
        expect(response.status).toBe(200);
    });
    it('[DELETE] route should delete a product', async () => {
        const response = await supertest(app).delete('/products/2').set('Authorization', `Bearer ${product_token}`);
        expect(response.status).toBe(200);
    });
});