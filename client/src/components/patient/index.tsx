import React, { useEffect, useState } from "react";

import { useParams } from "react-router";

import { Bar } from "react-chartjs-2";

import callApi from "../../shared/api";

export const PatientComponent = () => {
  const params = useParams();
  const [patientInfo, setPatientInfo] = useState<any>();

  useEffect(() => {
    callApi({
      url: `patient/patientMedicationLevel/${params.id}`,
      method: "get",
    }).then((data: any) => {
      const finalLevel: string[] = [];
      setPatientInfo(data);
    });
  }, [params.id]);

  return (
    <>
      {patientInfo && (
        <div>
          <div>
            <h3>Nurse per patient</h3>
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
                labels: patientInfo.labels,
                datasets: [
                  ...patientInfo.dataSet.map((medication, index) => {
                    return {
                      label: medication.medicationName,
                      data: medication.medicationLevel,
                      backgroundColor: `rgba(${index * 55}, ${index * 16.3},${
                        index * 100
                      }, 0.5)`,
                    };
                  }),
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
