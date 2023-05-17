import transformCsvToSchema from "../DTO/observation";
import ObservationModel from "../models/observation.schema";
import { PatientModel } from "../models/patient.schemas";
import { PractitionerModel } from "../models/practitioner.schema";
import { NurseModel } from "../models/nurse.schema";
import { HospitalModel } from "../models/hospital.schema";
import { MedicationModel } from "../models/medicine.schema";
import mongoose from "mongoose";

const csv = require("@fast-csv/parse");
const streamifier = require("streamifier");

/**
 * Bulk upload csv file
 * */
export const uploadPatientsINfo = (req, res) => {
  const { buffer } = req;
  const observations = [];
  streamifier
    .createReadStream(buffer)
    .pipe(csv.parse({ headers: true, ignoreEmpty: true })) // <== this is @fast-csv/parse!!
    .on("data", async (row) => {
      if (row.patient_ssn && row.practitioner_id && row.observation_id) {
        observations.push(transformCsvToSchema(row));
      }
    })
    .on("end", async (rowCount) => {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        const observation = await ObservationModel.create(
          observations.map((value) => value.observation)
        );
        await PatientModel.create(observations.map((value) => value.patient));
        await PractitionerModel.create(
          observations.map((value) => {
            let isOvertime;
            observations.find((val) => {
              if (val.observation.time < val.nurse.checkOut) {
                isOvertime = true;
                return;
              }
            });
            return { ...value.practitioner, overTime: isOvertime };
          })
        );
        await NurseModel.create(
          observations.map((value) => {
            let isOvertime;
            observations.find((val) => {
              console.log(
                val.observation.time > val.nurse.checkOut,
                val.observation.time,
                val.nurse.checkOut
              );
              if (val.observation.time < val.nurse.checkOut) {
                isOvertime = true;
                return;
              }
            });
            return { ...value.nurse, overTime: isOvertime };
          })
        );
        await MedicationModel.create(
          observations.map((value) => value.medication)
        );
        await HospitalModel.create(observations.map((value) => value.hospital));
        await session.commitTransaction();
        res.json({ rowCount, data: observation });
      } catch (error) {
        await session.abortTransaction();
        res.status(400).json(error.toString());
      }
    });
};

const getPatientListAndLastObservation = () => {
  return PatientModel.aggregate([
    {
      $lookup: {
        from: "observations",
        localField: "patientSsn",
        foreignField: "patientId",
        as: "observation",
      },
    },
    {
      $unwind: {
        path: "$observation",
      },
    },
    {
      $sort: { "observation.date": 1 },
    },
    {
      $group: {
        _id: "$patientSsn",
        patient: { $first: "$$ROOT" },
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
          localField: "medicationId",
          foreignField: "medicationId",
          as: "observations",
        },
      },
      {
        $unwind: "$observations",
      },
      {
        $lookup: {
          from: "patients",
          localField: "observations.patientId",
          foreignField: "patientSsn",
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
          medicationName: "$medicationName.medication_name",
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
          localField: "nurseId",
          foreignField: "nurseId",
          as: "observations",
        },
      },
      {
        $unwind: "$observations",
      },
      {
        $lookup: {
          from: "patients",
          localField: "observations.patientId",
          foreignField: "patientSsn",
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
          nurse: { $first: "$$ROOT" },
        },
      },

      {
        $project: {
          count: {
            $size: "$patients",
          },
          firstName: "$nurse.fistName",
          lastName: "$nurse.lastName",
          medicationId: "$nurse.nurseId",
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
          localField: "practitionerId",
          foreignField: "practitionerId",
          as: "observations",
        },
      },
      {
        $unwind: "$observations",
      },
      {
        $lookup: {
          from: "patients",
          localField: "observations.patientId",
          foreignField: "patientSsn",
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
          practitioner: { $first: "$$ROOT" },
        },
      },

      {
        $project: {
          count: {
            $size: "$patients",
          },
          medicationName: "$practitioner.practitionerName",
          medicationId: "$practitioner.practitionerId",
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
        localField: "patientSsn",
        foreignField: "patientId",
        as: "observations",
      },
    },
    {
      $lookup: {
        from: "medications",
        localField: "observations.medicationId",
        foreignField: "medicationId",
        as: "medications",
      },
    },
    {
      $project: {
        medications: "$medications",
      },
    },
  ]);
};

/**
 * Get list of patient and last medicine assigned
 * */
const listOfPatientAndLastMedicationAssigned = () => {
  return ObservationModel.aggregate([
    {
      $lookup: {
        from: "medications",
        localField: "medicationId",
        foreignField: "medicationId",
        as: "medications",
      },
    },
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "patientSsn",
        as: "patients",
      },
    },
    {
      $unwind: "$medications",
    },
    {
      $unwind: "$patients",
    },
    {
      $sort: { date: -1 },
    },
    {
      $group: {
        _id: "$patientId",
        global: { $first: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: "$_id",
        patient: "$global.patients",
        lastMedication: "$global.medications",
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
