import {faker} from '@faker-js/faker';
import {IUser} from '../../src/models/user.schema';

export const userFixture: IUser = {
    name: faker.datatype.string(),
    email: faker.datatype.string(),
    refreshToken: 'covid',
    password: '12345',
    role: 'USER',
    confPassword: '12345'
}