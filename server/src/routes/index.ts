import UserController from '../controllers/user.controller';
import PatientController from "../controllers/patient.controller";
const Router=require('express').Router;

const router = Router();

router.use(`/user`, UserController);
router.use(`/patient`, PatientController);


export default router;