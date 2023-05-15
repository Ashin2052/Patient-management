import {Router} from 'express';
import * as patientService from '../services/patient.service'

const router = Router();
const multer = require('multer');
const upload = multer();

router.post('/upload', upload.single('csv'), async (req, res, next) => {
    patientService.uploadPatientsINfo(req.file,res)
});

router.delete('', (req, res, next) => {
    // patientService.deleteAll()
    //     .then(() => {
    //         res.json('All deleted')
    //     })
    //     .catch((err) =>{
    //         res.json(err)
    // })
});

router.get('/count', (req, res, next) => {
    patientService.aggregate()
        .then((data) => {
            res.json(data)
        })
        .catch((err) =>{
            console.log(err)
            res.json(err)
    })
});

export default router;