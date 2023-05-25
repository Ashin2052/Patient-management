import MockAdapter from "axios-mock-adapter";

import callApi2, { axiosInstance } from "../../src/shared/api";
import { DASHOARD } from "../fixtures/datatable.fixture";

export const TEST_BASE_URL = "http://localhost:8000";
describe("", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("when API call is successful", () => {
    it("should return dashboard data list", async () => {
      mock.onGet(`${TEST_BASE_URL}/api/patient/dashboard`).reply(200, DASHOARD);

      // when
      let result;
      await callApi2({
        method: "get",
        url: "patient/dashboard",
      }).then((data) => {
        result = data;
      });

      // then
      expect(mock.history.get[0].url).toEqual(
        `${TEST_BASE_URL}/api/patient/dashboard`
      );
      expect(result).toEqual(DASHOARD);
    });
  });
});
