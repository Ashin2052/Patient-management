import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Login } from "./components/login/login";
import { PrivateRoute } from "./shared/auth";
import { HeaderComponent } from "./components/header";
import Registration from "./components/registration";
import Dashboard from "./components/dashboard";
import { PatientComponent } from "./components/patient";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <PrivateRoute>
              <PatientComponent />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
