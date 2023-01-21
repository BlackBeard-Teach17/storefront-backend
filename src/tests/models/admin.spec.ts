import supertest from 'supertest';
import app from '../../server';
import { AdminStore } from '../../models/admin.model';

const store = new AdminStore();
describe('Admin Models', () => {
    it('should have an index method', () => {
        expect(store.top5Products).toBeDefined();
    });
    it ('should have a users with orders', () => {
        expect(store.usersWithOrders).toBeDefined();
    });
    it ('should return a list of users with orders', async () => {
        const result = await store.usersWithOrders();
        expect(result).toEqual([]);
    });
    it ('should return a list of top 5 products', async () => {
        const result = await store.top5Products();
        expect(result).toEqual('No products found');
    });
});
let admin_token: string;
describe('Admin Controller', () => {
    beforeAll(async () => {
        const user = await supertest(app).post('/users/create').send({
            firstname: 'Test',
            lastname: 'Test',
            username: 'Test',
            is_admin: true,
            password: 'password'
        });
        admin_token = user.body.token;
    });
    it('[GET] top 5 products should return a list of products', async () => {
        const response = await supertest(app).get('/admin/top5products').set('Authorization', `Bearer ${admin_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual('No products found');
    });
    it('[GET] users with orders should return a list of users', async () => {
        const response = await supertest(app).get('/admin/userswithorders').set('Authorization', `Bearer ${admin_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});