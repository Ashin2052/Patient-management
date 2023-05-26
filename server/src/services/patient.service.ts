import transformCsvToSchema from "../DTO/observation";
import ObservationModel from "../models/observation.schema";
import { PatientModel } from "../models/patient.schemas";
import { PractitionerModel } from "../models/practitioner.schema";
import { NurseModel } from "../models/nurse.schema";
import { HospitalModel } from "../models/hospital.schema";
import { MedicationModel } from "../models/medicine.schema";
import mongoose from "mongoose";
import { MedicationLevelQueryResponse } from "../types/pateint.service.types";

const csv = require("@fast-csv/parse");
const streamifier = require("streamifier");

/**
 * Bulk upload csv file
 * */
export const uploadPatientsINfo = async (req, res) => {
  const { buffer } = req;
  let ignoredROws = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    streamifier
      .createReadStream(buffer)
      .pipe(csv.parse({ headers: true, ignoreEmpty: true })) // <== this is @fast-csv/parse!!
      .on("data", async (row) => {
        if (
          row.patient_ssn &&
          row.practitioner_id &&
          row.observation_id &&
          row.nurse_id
        ) {
          let transformedValue = transformCsvToSchema(row);
          let hospital, medication, patient, nurse, practitioner;
          await HospitalModel.findOneAndUpdate(
            {
              hospitalId: transformedValue.hospital.hospitalId,
            },
            transformedValue.hospital,
            {
              upsert: true,
            }
          ).then((value) => {
            hospital = value;
          });

          if (transformedValue.medication.medicationId) {
            await MedicationModel.findOneAndUpdate(
              {
                medicationId: transformedValue.medication.medicationId,
              },
              transformedValue.medication,
              {
                upsert: true,
              }
            ).then((val) => {
              medication = val;
            });
          }

          await PatientModel.findOneAndUpdate(
            {
              patientSsn: transformedValue.patient.patientSsn,
            },
            transformedValue.patient,
            {
              upsert: true,
            }
          ).then((value) => {
            patient = value;
          });

          await NurseModel.findOneAndUpdate(
            {
              nurseId: transformedValue.nurse.nurseId,
            },
            {
              ...transformedValue.nurse,
              hasOvertime:
                transformedValue.observation.time <
                transformedValue.nurse.checkOut,
            },
            {
              upsert: true,
            }
          ).then((value) => {
            nurse = value;
          });

          await PractitionerModel.findOneAndUpdate(
            {
              practitionerId: transformedValue.practitioner.practitionerId,
            },
            {
              ...transformedValue.practitioner,
              hasOvertime:
                transformedValue.observation.time <
                transformedValue.practitioner.checkOut,
            },
            {
              upsert: true,
            }
          ).then((value) => {
            practitioner = value;
          });

          await ObservationModel.findOneAndUpdate(
            {
              observationId: transformedValue.observation.observationId,
            },
            {
              ...transformedValue.observation,
              practitioner: practitioner._id,
              patient: patient._id,
              nurse: nurse._id,
              hospital: hospital._id,
              medication: medication?._id,
            },
            {
              upsert: true,
            }
          );
        } else {
          ignoredROws.push(row);
        }
      })
      .on("end", async (rowCount) => {
        console.log("rr");
        await session.commitTransaction();
        res.status(200).json({
          rowCount,
          ignoredROws,
        });
      });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json(e.toString());
  }
};

export const getPatientListAndLastObservation = () => {
  return ObservationModel.aggregate([
    {
      $lookup: {
        from: "patients",
        localField: "patient",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $unwind: {
        path: "$patient",
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $group: {
        _id: "$patient._id",
        observation: { $first: "$$ROOT" },
      },
    },
    {
      $sort: {
        "observation.patient.firstName": 1,
      },
    },
    {
      $project: {
        _id: "$$REMOVE",
        observation: "$observation",
      },
    },
  ]);
};

/**
 * Medication per patient
 * */
const medicationPerPatient = () => {
  try {
    return MedicationModel.aggregate([
      {
        $lookup: {
          from: "observations",
          localField: "_id",
          foreignField: "medication",
          as: "observations",
        },
      },
      {
        $unwind: "$observations",
      },
      {
        $lookup: {
          from: "patients",
          localField: "observations.patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $group: {
          _id: "$medicationId",
          patients: {
            $addToSet: "$patient",
          },
          medicationName: { $first: "$$ROOT" },
        },
      },

      {
        $project: {
          count: {
            $size: "$patients",
          },
          medicationName: "$medicationName.medicationName",
          medicationId: "$medicationName.medicationId",
        },
      },
    ]);
  } catch (e) {
    return e;
  }
};
const nursePerPatient = () => {
  try {
    return NurseModel.aggregate([
      {
        $lookup: {
          from: "observations",
          localField: "_id",
          foreignField: "nurse",
          as: "observations",
        },
      },
      {
        $unwind: "$observations",
      },
      {
        $lookup: {
          from: "patients",
          localField: "observations.patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $group: {
          _id: "$nurseId",
          patients: {
            $addToSet: "$patient",
          },
          nurse: { $first: "$$ROOT" },
        },
      },

      {
        $project: {
          count: {
            $size: "$patients",
          },
          firstName: "$nurse.firstName",
          lastName: "$nurse.lastName",
          nurse: "$nurse.nurseId",
        },
      },
    ]);
  } catch (e) {
    return e;
  }
};

const doctorPerPatient = () => {
  try {
    return PractitionerModel.aggregate([
      {
        $lookup: {
          from: "observations",
          localField: "_id",
          foreignField: "practitioner",
          as: "observations",
        },
      },
      {
        $unwind: "$observations",
      },
      {
        $lookup: {
          from: "patients",
          localField: "observations.patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $group: {
          _id: "$practitionerId",
          patients: {
            $addToSet: "$patient",
          },
          nurse: { $first: "$$ROOT" },
        },
      },

      {
        $project: {
          count: {
            $size: "$patients",
          },
          firstName: "$nurse.firstName",
          lastName: "$nurse.lastName",
          nurse: "$nurse.nurseId",
        },
      },
    ]);
  } catch (e) {
    return e;
  }
};

/**
 * Patient medication level
 * */
export const patientMedicationLevel = (patientSsn: string) => {
  return PatientModel.aggregate([
    {
      $match: { patientSsn: patientSsn },
    },
    {
      $lookup: {
        from: "observations",
        localField: "_id",
        foreignField: "patient",
        as: "observations",
      },
    },
    {
      $lookup: {
        from: "medications",
        localField: "observations.medication",
        foreignField: "_id",
        as: "medications",
      },
    },
    {
      $group: {
        _id: patientSsn,
        root: { $first: "$$ROOT" },
      },
    },
  ]).then((data: MedicationLevelQueryResponse[]) => {
    let patientMedicationLevel = data[0].root;
    //initialize return response
    let patientMedicationsLevel = {
      labels: [],
      dataSet: [],
    };

    //data comes in single array
    patientMedicationLevel.observations.forEach((observation) => {
      let medication = patientMedicationLevel.medications.find(
        (medication) =>
          medication._id.toString() === observation.medication.toString()
      );

      let patientMedication = {
        medicationName: medication.medicationName,
        medicationLevel: [],
      };
      let i = 0;

      let medicationLevel = +medication.medicationLevel;
      // decrement date by one month and also decrement medication by one level
      while (medicationLevel >= 0) {
        let date = new Date(observation.date);
        date.setMonth(date.getMonth() - i);

        let newDate = date.toDateString();
        if (!patientMedicationsLevel.labels.find((val) => val === newDate)) {
          patientMedicationsLevel.labels.push(newDate);
        }
        patientMedication.medicationLevel.push({
          level: +medicationLevel,
          date: newDate,
        });
        i++;
        medicationLevel--;
      }
      patientMedicationsLevel.dataSet.push(patientMedication);
    });

    patientMedicationsLevel.labels.sort((a, b) => b - a);

    let finalResponseData = {
      labels: patientMedicationsLevel.labels,
      dataSet: [],
    };

    patientMedicationsLevel.dataSet.forEach((data) => {
      let newVal = patientMedicationsLevel.labels.map((value) => 0);
      data.medicationLevel.forEach((medication) => {
        let index = patientMedicationsLevel.labels.findIndex(
          (val) => val === medication.date
        );
        newVal[index] = medication.level;
      });

      finalResponseData.dataSet.push({
        medicationName: data.medicationName,
        medicationLevel: newVal,
      });
    });

    return {
      medicationLevel: finalResponseData,
      info: {
        name:
          patientMedicationLevel.firstName +
          " " +
          patientMedicationLevel.lastName,
        email: patientMedicationLevel.email,
        address1: patientMedicationLevel.address1,
        occupation: patientMedicationLevel.occupation,
      },
    };
  });
};

/**
 * Get list of patient and last medicine assigned
 * */
const listOfPatientAndLastMedicationAssigned = () => {
  return ObservationModel.aggregate([
    {
      $lookup: {
        from: "medications",
        localField: "medication",
        foreignField: "_id",
        as: "medication",
      },
    },
    {
      $lookup: {
        from: "patients",
        localField: "patient",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $unwind: {
        path: "$patient",
      },
    },
    {
      $unwind: {
        path: "$medication",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$patient._id",
        root: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $project: {
        _id: "$_id",
        patientId: "$root.patient.patientSsn",
        firstName: "$root.patient.firstName",
        lastName: "$root.patient.lastName",
        medicationName: "$root.medication.medicationName",
        medicationId: "$root.medication.medicationId",
      },
    },
  ]);
};

/**
 * Get list of high risk patients
 * */
export const getHighRiskPatient = () => {
  return ObservationModel.aggregate([
    {
      $group: {
        _id: "$patientId",
        observations: { $push: { hospitalId: "$observationId" } },
        hospitalsVisited: { $push: { hospitalId: "$hospitalId" } },
        practitionersConsulted: {
          $push: { practitionerId: "$practitionerId" },
        },
      },
    },
    {
      $project: {
        _id: "$_id",
        hospitals_visited_size: {
          $size: "$hospitalsVisited",
        },
        practitioners_consulted_size: {
          $size: "$practitionersConsulted",
        },
        observation_count: {
          $size: "$observations",
        },
      },
    },
    {
      $match: {
        $or: [
          { hospitals_visited_size: { $exists: true, $gt: 3 } },
          { practitioners_consulted_size: { $exists: true, $gt: 5 } },
          { observation_count: { $exists: true, $gt: 10 } },
        ],
      },
    },
    {
      $lookup: {
        from: "patients", // collection name in db
        localField: "_id",
        foreignField: "patientSsn",
        as: "patient",
      },
    },
    {
      $unwind: "$patient",
    },
  ]);
};

export const aggregate = async () => {
  return {
    patientLatestObservation: await getPatientListAndLastObservation(),
    patientAndLastMedicationAssigned:
      await listOfPatientAndLastMedicationAssigned(),
    medicationPatientChart: await medicationPerPatient(),
    nursePerPatient: await nursePerPatient(),
    practitionerPerPatient: await doctorPerPatient(),
    observation: await ObservationModel.count(),
    patientCount: await PatientModel.count(),
    practitionerCount: await PractitionerModel.count(),
    nurseCount: await NurseModel.count(),
  };
};
