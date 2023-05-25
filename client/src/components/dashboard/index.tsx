import React, { useEffect, useState } from "react";

import { Col, Input, Row, Table } from "antd";

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

import { OpenNotification } from "../../shared/notification/notification";
import {
  IDashboard,
  PatientLatestObservation,
} from "../../types/patient.api.types";
import { getDashboardData, uploadCsv } from "../../services/dashboard.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const columns: ColumnsType<PatientLatestObservation> = [
  {
    title: "Patient",
    dataIndex: "observation",
    key: "observation.patient._id",
    render: (row) => (
      <a href={`/patient/${row.patient.patientSsn}`}>
        {row?.patient.firstName + row.patient.lastName}
      </a>
    ),
  },
  {
    title: "Observation",
    dataIndex: "observation",
    key: "observation._id",
    ellipsis: true,
    render: (row) => {
      return row.remark;
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
  const [dashboardData, setDashboardData] = useState<IDashboard>();

  useEffect(() => {
    getDashboardData()
      .then((response) => {
        setDashboardData(response as unknown as IDashboard);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("csv", file);
    uploadCsv(formData)
      .then(() => {
        return getDashboardData();
      })
      .then((response) => {
        OpenNotification({
          message: "Uploaded",
          description: "Uploaded Susccessfully",
          type: "success",
        });
        setDashboardData(response as unknown as IDashboard);
      })
      .catch((e) => {
        OpenNotification({
          message: "Upload Failed",
          description: e.toString(),
          type: "error",
        });
      });
  };

  return (
    <div data-testid="dashboard-container">
      {dashboardData && (
        <div data-testid="data-container">
          <Row justify={"space-between"} align={"middle"}>
            <Col className={"ml-16"}>
              <h1>Patient Management Insights</h1>
            </Col>
            <Col span={7} className={"csv-upload"}>
              <Row justify={"space-around"} align={"middle"}>
                <Col>
                  <h4>Upload Patient Csv</h4>
                </Col>
                <Col>
                  <Input
                    accept={".csv"}
                    type="file"
                    placeholder={"Upload Patient Csv"}
                    required={true}
                    onChange={handleFileUpload}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
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
                    id={"nurse-per-patient"}
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
                          label: "Patient",
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
    </div>
  );
};

export default Dashboard;
