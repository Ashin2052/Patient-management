import React, { useState } from "react";
import "./login.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Input } from "antd/lib";

import { Button, Form } from "antd";

import api from "../../shared/api";
import { login } from "../../shared/reducers/auth-reducer";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const onFinish = (formValues: any) => {
    api({
      url: "user/login",
      method: "post",
      payload: formValues,
    })
      .then((value) => {
        dispatch(login(value));
        setError(false);
        navigate("/home");
      })
      .catch(() => {
        setError(true);
      });
  };

  return (
    <div className="login-form-container">
      <span>
        <h1>Login in to continue</h1>
      </span>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="form-row">
          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
        </div>
        {error && (
          <div className={"error-msg"}>please check your credentials.</div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
          <a>Dont have a account? Sign Up</a>
        </div>
      </Form>
    </div>
  );
};
