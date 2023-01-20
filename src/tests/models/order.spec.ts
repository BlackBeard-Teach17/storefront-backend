import express, {Request, Response} from 'express';
import supertest from 'supertest';
import app from '../../server';
import client from '../../configs/database.config';
import { Order, OrderStore } from '../../models/order.model';
import { ProductStore } from '../../models/product.model';
import { UserStore } from '../../models/user.model';

const order = new OrderStore();
const user = new UserStore();
let order_token;

describe('Order Controller', () => {
    beforeAll(async () => {
        const user = await supertest(app).post('/users/create').send({
            firstname: 'Test',
            lastname: 'Test',
            username: 'Test',
            is_admin: true,
            password: 'password'
        });
        const productStore = new ProductStore();
        await productStore.create({
            name: 'Test',
            price: 1,
            category: 'Test'
        });
        order_token = user.body.token;
  
    });
    afterAll(async() => {
        const user = new UserStore();
        await user.delete('1');
        const productStore = new ProductStore();
        await productStore.delete('1');
    });
    it('[GET] before index route should return message', async () => {
        const response = await supertest(app).get('/orders').set('Authorization', `Bearer ${order_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual('No orders found');
    });

    it('[POST] create route should add an order', async () => {
        const response = await supertest(app)
            .post('/orders/create').set('Authorization', `Bearer ${order_token}`)
            .send({
                user_id: 1,
                status: 'active'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] should get the list of orders', async () => {
        const response = await supertest(app).get('/orders').set('Authorization', `Bearer ${order_token}`);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{id: 1, status: 'active', user_id: '1'}]);
    });
    it('[GET] should get order with id 1', async () => {
        const response = await supertest(app).get('/orders/1').set('Authorization', `Bearer ${order_token}`);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body)
        .toEqual(
            {id: 1, status: 'active',
            user_id: '1'});
    });

    it ('[POST] should add a product to an order', async () => {
        const response = await supertest(app)
            .post('/orders/1/addProduct').set('Authorization', `Bearer ${order_token}`)
            .send({
                product_id: 1,
                order_id: 1,
                quantity: 1
            });
        expect(response.status).toBe(200);
    });
    it ('[POST] should update the product quantity', async () => {
        const response = await supertest(app)
            .post('/orders/1/addProduct').set('Authorization', `Bearer ${order_token}`)
            .send({
                product_id: 1,
                order_id: 1,
                quantity: 1
            });
        expect(response.status).toBe(200);
        expect(response.body).toEqual('Product quantity updated');
    });
    it('[GET] should get the list of products in an order', async () => {
        const response = await supertest(app).get('/orders/1/getOrderItems').set('Authorization', `Bearer ${order_token}`);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{product_name: 'Test', price: 1,quantity: 1, total: 1}]);
    });
    it('[DELETE] should delete an item from order order', async () => {
        const response = await supertest(app).delete('/orders/1/removeProduct').set('Authorization', `Bearer ${order_token}`)
            .send({
                product_id: 1,
            });
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
    });
    it('[GET] should get the list of products in an order', async () => {
        const response = await supertest(app).get('/orders/1/getOrderItems').set('Authorization', `Bearer ${order_token}`);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
    it ('[POST] should add a product to an order', async () => {
        const response = await supertest(app)
            .post('/orders/1/addProduct').set('Authorization', `Bearer ${order_token}`)
            .send({
                product_id: 1,
                order_id: 1,
                quantity: 1
            });
        expect(response.status).toBe(200);
    });
    
    it ('[PUT] should update the status of an order to completed', async () => {
        const response = await supertest(app)
            .put('/orders/1/updateStatus').set('Authorization', `Bearer ${order_token}`)
            .send({
                status: 'completed'
            });
        expect(response.status).toBe(200);
    });
    it('[GET] completed orders', async () => {
        const response = await supertest(app).get('/orders/1/getCompletedOrders').set('Authorization', `Bearer ${order_token}`);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{id: 1, status: 'completed', user_id: '1'}]);
    });

    it('[DELETE] should delete an order', async () => {
        const response = await supertest(app).delete('/orders/1').set('Authorization', `Bearer ${order_token}`);
        expect(response).toBeDefined();
        expect(response.status).toBe(200);
    });

});

describe('Order model', () => {
    beforeAll(async () => {
        const user = await supertest(app).post('/users/create').send({
            firstname: 'Test',
            lastname: 'Test',
            username: 'Test',
            is_admin: true,
            password: 'password'
        });
        const productStore = new ProductStore();
        await productStore.create({
            name: 'Test',
            price: 1,
            category: 'Test'
        });
    });
    afterAll(async () => {
        const conn = await client.connect();
        const sql = 'TRUNCATE users, products, orders, order_products RESTART IDENTITY CASCADE';
        await conn.query(sql);
    });
    it('should have an index method that returns message', async () => {
        const response = await order.index();
        expect(response).toEqual('No orders found');
    });
    it('should have a show that returns message', async () => {
        const response = await order.showOrder('1');
        expect(response).toEqual('No order with that id found');
    });
    it ('should have a create method to create', async () => {
        await user.create({firstname: 'Test', lastname: 'Test', username: 'Test', password: 'password'});
        const response = await order.create({user_id: 2, status: 'active'});
        expect(response).toBeUndefined();
    });
    it('should have a delete method', () => {
        expect(order.delete).toBeDefined();
    });
    it('should have a addProduct method', () => {
        expect(order.addProduct).toBeDefined();
    });
    it('should have a removeProduct method', () => {
        expect(order.removeProduct).toBeDefined();
    });
    it('should have a getOrderItems method', () => {
        expect(order.getCartItems).toBeDefined();
    });
    it('should have a updateStatus method', () => {
        expect(order.update).toBeDefined();
    });
    it('should have a getCompletedOrders method', () => {
        expect(order.getCompletedOrders).toBeDefined();
    });
});

