import mongoose, {Types} from 'mongoose';
import {close, dbConnect} from '../../src/configs/dbConnect';
import {applicationConfig} from '../../src/configs/config';
import {app} from '../../index';
import request from 'supertest';
import {userFixture} from '../fixtures/user.fixture';

describe('Server Apis', () => {
    beforeAll(() => {
        dbConnect({db: applicationConfig.MONGODB_URI});
    });
    beforeEach(() => {
        if (mongoose.connection.collection('user').countDocuments()) {
            return mongoose.connection.collection('user').deleteMany({});
        }
    });

    afterAll(() => {
        return close();
    });

    describe('POST /users', () => {
        it('should create a user successfully!!', async () => {
            const response = await request(app).post('/api/user/register').send({...userFixture});
            expect(response.status).toBe(200);
            expect(response.body.email).toBe(userFixture.email);
        });
    })
})