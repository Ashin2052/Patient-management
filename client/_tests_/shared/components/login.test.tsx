import * as React from "react";

import { render, cleanup, waitFor, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import MockAdapter from "axios-mock-adapter";
import * as router from "react-router-dom";
import * as redux from "react-redux";

import { DASHOARD } from "../../fixtures/datatable.fixture";

import { axiosInstance } from "../../../src/shared/api";
import { TEST_BASE_URL } from "../api.test";
import { Login } from "../../../src/components/login/login";

describe("dashboard component", () => {
  const navigate = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    jest.spyOn(redux, "useDispatch").mockImplementation(() => dispatch);

    const mock = new MockAdapter(axiosInstance);
    mock.onGet(`${TEST_BASE_URL}/api/patient/dashboard`).reply(200, DASHOARD);
  });

  afterEach(() => {
    cleanup;
    jest.resetAllMocks();
  });

  describe("Renders a joke correctly", () => {
    it("should render given text", async () => {
      render(<Login />);
      await waitFor(() => {
        screen.getByText("Upload Patient Csv");
      });
    });
  });
});
