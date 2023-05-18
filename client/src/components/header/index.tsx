import React from "react";
import { Button, Row } from "antd";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";

import { logout } from "../../shared/reducers/auth-reducer";
import api from "../../shared/api";

export const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    api({
      url: "user/logout",
      method: "post",
    })
      .then((value) => {
        dispatch(logout());
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Row justify={"space-between"} align={"middle"} className={"pb-24"}>
        <Link to={"/home"} color={"white"}>
          Home
        </Link>
        <Button
          style={{ float: "right" }}
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={onLogout}
        />
      </Row>
    </div>
  );
};
