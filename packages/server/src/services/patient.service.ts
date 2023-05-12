import PatientSchema from "../models/patient.schema";
import PatientModel from "../models/patient.schema";

const csv = require("@fast-csv/parse");
const streamifier = require('streamifier');

export const uploadPatientsINfo =  (req, res) => {
    const {buffer} = req;
    const dataFromRows = [];
    streamifier
        .createReadStream(buffer)
        .pipe(csv.parse({headers: true, ignoreEmpty: true})) // <== this is @fast-csv/parse!!
        .on("data", async (row) => {
           dataFromRows.push(row);
        })
        .on("end", async (rowCount) => {
            try {
                const data = await PatientModel.create(dataFromRows);
                res.json({rowCount, data})
            } catch (error) {
                res.status(400).json(error)
            }
        })
}

export  const deleteAll = () => {
    return PatientModel.remove();
}