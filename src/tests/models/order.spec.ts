import express, {Request, Response} from 'express';
import supertest from 'supertest';
import app from '../../server';
import { OrderStore } from '../../models/order.model';
import { UserStore } from '../../models/user.model';
import { ProductStore } from '../../models/product.model';

const store = new OrderStore();

describe('Order Controller', () => {
    beforeAll(async () => {
        const userStore = new UserStore();
        await userStore.create({
            firstname: 'Test_FirstName',
            lastname: 'Test_LastName',
            username: 'Test',
            password: 'password'
        });
        const productStore = new ProductStore();
        await productStore.create({
            name: 'Test',
            price: 1,
            category: 'Test'
        });
    });
    afterAll(async() => {
        const userStore = new UserStore();
        await userStore.delete('1');
        const productStore = new ProductStore();
        await productStore.delete('1');
    });
    it('[GET] before index route should return an empty list', async () => {
        const response = await supertest(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('[POST] create route should add an order', async () => {
        const response = await supertest(app)
            .post('/orders/create')
            .send({
                user_id: 1,
                status: 'active'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] should get the list of orders', async () => {
        const response = await supertest(app).get('/orders');
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{id: 1, status: 'active', user_id: '1'}]);
    });
    it('[GET] should get order with id 1', async () => {
        const response = await supertest(app).get('/orders/1');
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({id: 1, status: 'active', user_id: '1'});
    });

    it ('[POST] should add a product to an order', async () => {
        const response = await supertest(app)
            .post('/orders/1/addProduct')
            .send({
                product_id: 1,
                order_id: 1,
                quantity: 1
            });
        expect(response.status).toBe(200);
    });
});