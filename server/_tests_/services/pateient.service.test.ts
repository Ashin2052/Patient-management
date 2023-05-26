// @ts-ignore
import {
  getPatientListAndLastObservation,
  uploadPatientsINfo,
} from "../../src/services/patient.service";

const mongoose = require("mongoose");
const db = require("../db.spec");

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

/**
 * User model
 */
describe("User model", () => {
  it("Should return expected data", () => {
    let data = [];

    getPatientListAndLastObservation().then((result) => {
      data = result;
    });
  });
});
