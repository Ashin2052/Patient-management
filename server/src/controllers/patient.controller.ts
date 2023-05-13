import {Router} from 'express';
import * as patientService from '../services/patient.service'

const router = Router();
const multer = require('multer');
const upload = multer();

router.post('/upload', upload.single('csv'), async (req, res, next) => {
    patientService.uploadPatientsINfo(req.file,res)
});

router.delete('', (req, res, next) => {
    patientService.deleteAll()
        .then(() => {
            res.json('All deleted')
        })
        .catch((err) =>{
            res.json(err)
    })
});

export default router;