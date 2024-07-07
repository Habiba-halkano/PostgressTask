const request = require('supertest');
const app = require('../server');
const { User, Organisation } = require('../models');

describe('Auth Endpoints', () => {
    beforeEach(async () => {
        await User.destroy({ where: {} });
        await Organisation.destroy({ where: {} });
    });

    it('should register a user successfully with a default organisation', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.user.firstName).toBe('John');
    });

    it('should login a user successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890',
            });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.user.firstName).toBe('John');
    });

    it('should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(422);
        expect(res.body.errors[0].field).toBe('firstName');
    });

    it('should fail if email is duplicate', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890',
            });

        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '0987654321',
            });
        expect(res.statusCode).toEqual(400);
    });
});
