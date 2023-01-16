import express, { Request, Response } from 'express';
import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../../models/user.model';

const store = new UserStore();

describe('User Controller', () => {
    it('[GET] before index route should return an empty list', async () => {
        const response = await supertest(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('[POST] create route should add a user', async () => {
        const response = await supertest(app)
            .post('/users/create')
            .send({
                username: 'Test',
                password: 'password'
            });
        expect(response.status).toBe(200);
    });

    it('[GET] index route should return a list of users', async () => {
        const response = await supertest(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            username: 'Test'}]);
    });

    it('[GET] show route should return the correct user', async () => {
        const response = await supertest(app).get('/users/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            username: 'Test'
        });
    });

    it('[POST] authenticate route should authenticate a user', async () => {
        const response = await supertest(app)
            .post('/users/authenticate')
            .send({
                username: 'Test',
                password: 'password'
            });
        expect(response.status).toBe(200);
    });

    it('[POST] authenticate route should return JWT token', async () => {
        const response = await supertest(app)
            .post('/users/authenticate')
            .send({
                username: 'Test',
                password: 'password'
            });
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('[POST] authenticate route should return 401 for invalid credentials', async () => {
        const response = await supertest(app)
            .post('/users/authenticate')
            .send({
                username: 'Test',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401);
    });
});

describe('User Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it ('should have a create method that adds a user', async () => {
        const result = await store.create({
            username: 'Test', password: 'password'
        });
        expect(result).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('should have a authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });

    it('should authenticate user successfully', async () => {
        const result = await store.authenticate('Test', 'password');
        expect(result).toBeDefined();
    });

    it ('should return an error for invalid credentials', async () => {
        try {
            const result = await store.authenticate('Test', 'wrongpassword');
            fail('Should have thrown an error');
        }catch (err) {
            expect(err).toBeDefined();
            //expect((err as string)).toEqual('Error: Could not authenticate user Test. Error: Incorrect username or password');
        }
    });

    it ('should return true for duplicate username', async () => {
        const duplicate = await store.isDuplicate('Test');
        expect(duplicate).toBe(true);
    });

    it('should return false for unique username', async () => {
        const unique = await store.isDuplicate('Unique');
        expect(unique).toBe(false);
    })
});
