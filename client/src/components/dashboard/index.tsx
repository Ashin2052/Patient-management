import React, { useEffect, useState } from "react";

import { Col, Collapse, Row, Table } from "antd";

import { ColumnsType } from "antd/es/table";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import callApi from "../../shared/api";

const { Panel } = Collapse;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const columns: ColumnsType<any> = [
  {
    title: "Patient",
    dataIndex: "patient",
    key: "patient.patientSsn",
    render: (row) => <div>{row?.firstName + row.lastName}</div>,
  },
  {
    title: "Observation",
    dataIndex: "patient",
    key: "patient.patientSsn",
    ellipsis: true,
    render: (row) => {
      return row.observation.remark;
    },
  },
];

const patientListAndLastMedication: ColumnsType<any> = [
  {
    title: "Patient",
    dataIndex: "patient",
    key: "patient.patientSsn",
    render: (row) => <div>{row?.firstName + row.lastName}</div>,
  },
  {
    title: "Medication",
    dataIndex: "lastMedication",
    key: "lastMedicine.medicationId",
    ellipsis: true,
    render: (row) => {
      console.log(row);
      return <span>{row.medication_name}</span>;
    },
  },
];
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>();

  useEffect(() => {
    callApi({
      url: "patient/dashboard",
      method: "get",
    }).then((data) => {
      setDashboardData(data);
    });
  }, []);

  return (
    <>
      {dashboardData && (
        <div>
          <Row gutter={16} className={"dashboard-first-row"}>
            <Col>
              <Row>
                <Col span={3} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of patient</Col>
                    <Col span={8}>{dashboardData?.patientCount}</Col>
                  </Row>
                </Col>
                <Col span={3} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of Practitioner</Col>
                    <Col span={8}>{dashboardData?.practitionerCount}</Col>
                  </Row>
                </Col>
                <Col span={3} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of Nurse</Col>
                    <Col span={8}>{dashboardData?.nurseCount}</Col>
                  </Row>
                </Col>
                <Col span={3} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of Observation</Col>
                    <Col span={8}>{dashboardData?.observation}</Col>
                  </Row>
                </Col>
              </Row>
              <Row></Row>
            </Col>
            <Col span={10} className={"patient-last-observation-table"}>
              <Row>
                <Table
                  dataSource={dashboardData.patientLatestObservation}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={13}>
              <Bar
                data={{
                  labels: dashboardData.medicationPatientChart.map(
                    (row) => row.medicationName
                  ),
                  datasets: [
                    {
                      label: "Medication",
                      data: dashboardData.medicationPatientChart.map(
                        (row) => row.count
                      ),
                      backgroundColor: "rgba(53, 163, 335, 0.5)",
                    },
                  ],
                }}
              />
            </Col>
            <Col span={13}>
              <Table
                scroll={{ y: 500, x: 500 }}
                dataSource={dashboardData.patientAndLastMedicationAssigned}
                columns={patientListAndLastMedication}
                pagination={false}
                size="small"
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Dashboard;
