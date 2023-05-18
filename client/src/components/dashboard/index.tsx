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
    render: (row) => (
      <a href={`/patient/${row.patientSsn}`}>{row?.firstName + row.lastName}</a>
    ),
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
    key: "patientSsn",
    render: (row) => (
      <a href={`/patient/${row.patientId}`}>{row?.firstName + row.lastName}</a>
    ),
  },
  {
    title: "Medication",
    dataIndex: "medicationName",
    key: "medicationId",
    ellipsis: true,
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
          <Row justify={"space-around"} className={"dashboard-first-row"}>
            <Col span={14}>
              <Row justify={"space-around"}>
                <Col span={5} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of patient</Col>
                    <Col span={8}>{dashboardData?.patientCount}</Col>
                  </Row>
                </Col>
                <Col span={5} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of Practitioner</Col>
                    <Col span={8}>{dashboardData?.practitionerCount}</Col>
                  </Row>
                </Col>
                <Col span={5} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of Nurse</Col>
                    <Col span={8}>{dashboardData?.nurseCount}</Col>
                  </Row>
                </Col>
                <Col span={5} className={"count-box"}>
                  <Row>
                    <Col span={16}>No. of Observation</Col>
                    <Col span={8}>{dashboardData?.observation}</Col>
                  </Row>
                </Col>
              </Row>
              <Row className={"graph-container"}>
                <Col span={12} className={"boz-shadow pd-8"}>
                  <h3>Practitioner By patient</h3>
                  <Bar
                    data={{
                      labels: dashboardData.practitionerPerPatient.map(
                        (row) => row.firstName
                      ),
                      datasets: [
                        {
                          label: "No of patient",
                          data: dashboardData.practitionerPerPatient.map(
                            (row) => row.count
                          ),
                          backgroundColor: "rgba(53, 163, 335, 0.5)",
                        },
                      ],
                    }}
                  />
                </Col>
                <Col span={12} className={"boz-shadow ml-4 pd-8"}>
                  <h3>Nurse per patient</h3>
                  <Bar
                    data={{
                      labels: dashboardData.nursePerPatient.map(
                        (row) => row.firstName
                      ),
                      datasets: [
                        {
                          label: "No of patient",
                          data: dashboardData.nursePerPatient.map(
                            (row) => row.count
                          ),
                          backgroundColor: "rgba(53, 163, 335, 0.5)",
                        },
                      ],
                    }}
                  />
                </Col>

                {/*</Row>*/}
                {/*<Row className={"graph-container"}>*/}
              </Row>{" "}
              <Row className={"graph-container"}>
                <Col span={24} className={"boz-shadow  pd-8"}>
                  <h3>Medicine per patient</h3>
                  <Bar
                    data={{
                      labels: dashboardData.medicationPatientChart.map(
                        (row) => row.medicationName
                      ),
                      datasets: [
                        {
                          label: "No of patient",
                          data: dashboardData.medicationPatientChart.map(
                            (row) => row.count
                          ),
                          backgroundColor: "rgba(53, 163, 335, 0.5)",
                        },
                      ],
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={10}>
              <div className={"dashboard-table"}>
                <h3>Patient and last observation</h3>
                <Table
                  scroll={{ y: 500 }}
                  dataSource={dashboardData.patientLatestObservation}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              </div>

              <div className={"dashboard-table"}>
                <h3>Patient and last medication Assigned</h3>
                <Table
                  scroll={{ y: 500 }}
                  dataSource={dashboardData.patientAndLastMedicationAssigned}
                  columns={patientListAndLastMedication}
                  pagination={false}
                  size="small"
                />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Dashboard;
