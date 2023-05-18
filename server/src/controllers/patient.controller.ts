import { Router } from "express";
import * as patientService from "../services/patient.service";

const router = Router();
const multer = require("multer");
const upload = multer();
const auth = require("../middlewares/auth");

router.post("/upload", upload.single("csv"), async (req, res, next) => {
  patientService.uploadPatientsINfo(req.file, res);
});

router.get("/dashboard", auth, (req, res, next) => {
  patientService
    .aggregate()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.get("/patientMedicationLevel/:id", auth, (req, res, next) => {
  patientService
    .patientMedicationLevel(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/high-risk-patient", (req, res, next) => {
  patientService
    .getHighRiskPatient()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

export default router;
