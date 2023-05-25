import * as React from "react";

import { render, cleanup, waitFor, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import MockAdapter from "axios-mock-adapter";

import Dashboard from "../../../src/components/dashboard";
import { DASHOARD } from "../../fixtures/datatable.fixture";

import { axiosInstance } from "../../../src/shared/api";
import { TEST_BASE_URL } from "../api.test";

describe("dashboard component", () => {
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

  beforeEach(() => {
    const mock = new MockAdapter(axiosInstance);
    mock.onGet(`${TEST_BASE_URL}/api/patient/dashboard`).reply(200, DASHOARD);
  });

  afterEach(() => {
    cleanup;
    jest.resetAllMocks();
  });

  describe("Component as a whole", () => {
    it("should render component properly", function () {
      const { getByTestId } = render(<Dashboard />);
      expect(getByTestId("dashboard-container")).toBeInTheDocument();
    });
  });

  describe("Renders a joke correctly", () => {
    it("should render given text", async () => {
      const { getByTestId } = render(<Dashboard />);
      expect(getByTestId("dashboard-container")).toBeInTheDocument();
    });
  });
});
