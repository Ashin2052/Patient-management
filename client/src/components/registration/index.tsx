import React, { useEffect, useRef, useState } from "react";

import { Button, Col, Form, Input, Row } from "antd";

import { useNavigate } from "react-router-dom";

import api from "../../shared/api";
import { login } from "../../shared/reducers/auth-reducer";
import callApi from "../../shared/api";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Registration = () => {
  const navigate = useNavigate();
  const [responseError, setResponseError] = useState("");

  const onFinish = (val) => {
    callApi({
      url: "user/register",
      method: "post",
      payload: val,
    })
      .then((value) => {
        navigate("/login");
      })
      .catch((error) => {
        setResponseError(error.data);
      });
  };

  return (
    <Row justify={"center"} align={"middle"}>
      <Col span={24}>
        <Row justify={"center"} align={"middle"}>
          <h3>Registration</h3>
        </Row>
      </Col>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ width: 600 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "PLease enter your name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: "email", message: "Please enter valid email" },
            { required: true, message: "PLease enter your email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "PLease enter the password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: "Confirm password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div>{responseError && <div>{responseError}</div>}</div>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button className={"mr-16"} type="primary" htmlType="submit">
            Sing Up
          </Button>
          <Button
            type="primary"
            htmlType="reset"
            onClick={() => {
              navigate("/login");
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

export default Registration;
