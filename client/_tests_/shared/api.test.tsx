import MockAdapter from "axios-mock-adapter";
import callApi2, {axiosInstance} from "../../src/shared/api";
import {allergiesFixture} from "../fixtures/allergies";

export const TEST_BASE_URL = 'http://localhost:8000'
describe("", () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.reset();
    });

    describe("when API call is successful", () => {
        it("should return allergy list", async () => {

            mock.onGet(`${TEST_BASE_URL}/api/allergy`).reply(200, allergiesFixture);

            // when
            let result;
            await callApi2({
                method: "get", url: `allergy`,
            }).then((data) => {
                result = data;
            });

            // then
            expect(mock.history.get[0].url).toEqual(`${TEST_BASE_URL}/api/allergy`);
            expect(result).toEqual(allergiesFixture);
        });
    });
});