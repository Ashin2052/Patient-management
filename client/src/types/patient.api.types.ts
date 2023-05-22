export interface IDashboard {
  patientLatestObservation: PatientLatestObservation[];
  patientAndLastMedicationAssigned: PatientAndLastMedicationAssigned[];
  medicationPatientChart: MedicationPatientChart[];
  nursePerPatient: NursePerPatient[];
  practitionerPerPatient: PractitionerPerPatient[];
  observation: number;
  patientCount: number;
  practitionerCount: number;
  nurseCount: number;
}

export interface PatientLatestObservation {
  observation: IObservation;
}

export interface IObservation {
  _id: string;
  observationId: string;
  createdAt: string;
  date: string;
  hospital: string;
  medication: string;
  nurse: string;
  patient: IPatient;
  practitioner: string;
  remark: string;
  time: string;
  updatedAt: string;
}

export interface IPatient {
  _id: string;
  patientSsn: string;
  address1: string;
  address2: string;
  bloodType: string;
  country: string;
  createdAt: string;
  educationBackground: string;
  email: string;
  firstName: string;
  height: string;
  lastName: string;
  number1: string;
  number2: string;
  occupation: string;
  sex: string;
  updatedAt: string;
  weight: string;
}

export interface PatientAndLastMedicationAssigned {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  medicationName: string;
  medicationId: string;
}

export interface MedicationPatientChart {
  _id: string;
  count: number;
  medicationName: string;
  medicationId: string;
}

export interface NursePerPatient {
  _id: string;
  count: number;
  firstName: string;
  lastName: string;
  nurse: string;
}

export interface PractitionerPerPatient {
  _id: string;
  count: number;
  firstName: string;
  lastName: string;
}

export interface MedicationLevelQueryResponse {
  _id: string;
  root: PatientObservationMedication;
}

export interface PatientObservationMedication {
  _id: string;
  patientSsn: string;
  __v: number;
  address1: string;
  address2: string;
  bloodType: string;
  country: string;
  createdAt: string;
  educationBackground: string;
  email: string;
  firstName: string;
  height: string;
  lastName: string;
  number1: string;
  number2: string;
  occupation: string;
  sex: string;
  updatedAt: string;
  weight: string;
  observations: Observation[];
  medications: Medication[];
}

export interface Observation {
  _id: string;
  observationId: string;
  createdAt: string;
  date: string;
  hospital: string;
  medication: string;
  nurse: string;
  patient: string;
  practitioner: string;
  remark: string;
  time: string;
  updatedAt: string;
}

export interface Medication {
  _id: string;
  medicationId: string;
  createdAt: string;
  medicationCompany: string;
  medicationLevel: string;
  medicationName: string;
  medicationRemark: string;
  updatedAt: string;
}
