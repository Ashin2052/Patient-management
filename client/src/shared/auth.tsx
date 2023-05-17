import React from "react";
import { Navigate } from "react-router-dom";

import { Space } from "antd";

import Layout, { Content, Footer, Header } from "antd/es/layout/layout";

import { useAppSelector } from "./hooks/redux.hooks";
import { HeaderComponent } from "../components/header";

export const PrivateRoute = ({ children }: any) => {
  const authState = useAppSelector((state) => state.authSlice);
  if (!authState.isLoggedIn) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }
  // authorized so return child components
  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout>
        <Header>{<HeaderComponent />}</Header>
        <Content style={{ margin: "16px", padding: "16px", height: "100%" }}>
          <div>{children}</div>
        </Content>
      </Layout>
    </Space>
  );
};
