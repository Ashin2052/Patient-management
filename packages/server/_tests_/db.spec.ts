import {applicationConfig} from '../src/configs/config';
import {close, dbConnect} from '../src/configs/dbConnect';

describe('Users', () => {
    beforeAll(() => {
        dbConnect({db: applicationConfig.MONGODB_URI});
    });

    afterAll(() => {
        close();
    });

})