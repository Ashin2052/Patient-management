import React from "react";
import { Table } from "antd";
import { Itable } from "../../../types/shared.types";

export const TableComponent = (props: Itable) => {
  return (
    <div className={"width-100"}>
      <Table dataSource={props.dataSource} columns={props.columns} />;
    </div>
  );
};
export default TableComponent;
