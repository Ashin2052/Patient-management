import transformCsvToSchema from "../DTO/observation";
import ObservationModel from "../models/observation.schema";
import {PatientModel} from "../models/patient.schemas";
import {PractitionerModel} from "../models/practitioner.schema";
import {NurseModel} from "../models/nurse.schema";
import {HospitalModel} from "../models/hospital.schema";
import {MedicationModel} from "../models/medicine.schema";
import observation from "../DTO/observation";

const csv = require("@fast-csv/parse");
const streamifier = require('streamifier');

export const uploadPatientsINfo =  (req, res) => {
    const {buffer} = req;
    const observations = [];
    streamifier
        .createReadStream(buffer)
        .pipe(csv.parse({headers: true, ignoreEmpty: true})) // <== this is @fast-csv/parse!!
        .on("data", async (row) => {
           if(row.patient_ssn && row.practitioner_id && row.observation_id){
               observations.push(transformCsvToSchema(row))
           }
        })
        .on("end", async (rowCount) => {
            try {
              const observation =   await ObservationModel.create(observations.map(value => value.observation));
                 await PatientModel.create(observations.map(value => value.patient));
                 await PractitionerModel.create(observations.map(value => value.practitioner));
                 await NurseModel.create(observations.map(value => value.nurse));
                 await MedicationModel.create(observations.map(value => value.medication));
                 await HospitalModel.create(observations.map(value => value.hospital));
                res.json({rowCount, data: observation})
            } catch (error) {
                res.status(400).json(error.toString());
            }
        })
}

export  const aggregate = async () => {

    return {
        observation: await ObservationModel.count(),
        patientCount: await PatientModel.count(),
        practitionerCount: await PractitionerModel.count(),
        nurseCount: await NurseModel.count(),
    }
}