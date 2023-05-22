import React, { FC } from "react";
import { notification } from "antd";
import { IconType } from "antd/es/notification/interface";

export type notificationProp = {
  message: string;
  description: string;
  type: IconType;
  onClick?: () => void;
};
export const OpenNotification = (notificationProp: notificationProp) => {
  const { message, description, type, onClick } = notificationProp;
  notification.open({
    message: message,
    description: description,
    type: type,
    onClick: () => onClick,
  });
};
