import React, { useEffect, useState } from "react";

import { useParams } from "react-router";

import { Bar } from "react-chartjs-2";

import { Col, Row } from "antd";

import callApi from "../../shared/api";

export const PatientComponent = () => {
  const params = useParams();
  const [patientInfo, setPatientInfo] = useState<any>();

  useEffect(() => {
    callApi({
      url: `patient/patientMedicationLevel/${params.id}`,
      method: "get",
    }).then((data: any) => {
      setPatientInfo(data);
    });
  }, [params.id]);

  return (
    <>
      {patientInfo && (
        <div className={"dashboard-table"}>
          <div>
            <section>
              <Row align={"middle"}>
                <Col>
                  <h4>Name:&nbsp;</h4>
                </Col>
                <Col>{patientInfo.info.name}</Col>
              </Row>
              <Row align={"middle"}>
                <Col>
                  <h4>Email:&nbsp;</h4>
                </Col>
                <Col>{patientInfo.info.email}</Col>
              </Row>
            </section>
          </div>
          <div>
            <h3>Patient Medication Level</h3>
            <Bar
              options={{
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
              data={{
                labels: patientInfo.medicationLevel.labels,
                datasets: [
                  ...patientInfo.medicationLevel.dataSet.map(
                    (medication, index) => {
                      return {
                        label: medication.medicationName,
                        data: medication.medicationLevel,
                        backgroundColor: `rgba(${index * 55}, ${index * 16.3},${
                          index * 100
                        }, 0.5)`,
                      };
                    }
                  ),
                ],
              }}
            />
          </div>
        </div>
      )}
      ,
    </>
  );
};
