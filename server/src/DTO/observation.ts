

const transformCsvToSchema = (observation) => {
    return {
        observation: {
            observationId: observation.observation_id,
            date: observation.observation_date,
            remark: observation.observation_remark,
            time: observation.observation_time,
            patientId: observation.patient_ssn,
            hospitalId: observation.hospital_id,
            practitionerId: observation.hospital_id,
            nurseId: observation.nurse_id,
            medicationId: observation.medication_id,
        },
        patient: {
            patientSsn: observation.patient_ssn,
            firstName: observation.patient_firstName,
            lastName: observation.patient_lastName,
            country: observation.patient_country,
            address1: observation.patient_address1,
            address2: observation.patient_address2,
            number1: observation.patient_number1,
            number2: observation.patient_number2,
            sex: observation.patient_sex,
            email: observation.patient_email,
            height: observation.patient_height,
            weight: observation.patient_weight,
            bloodType: observation.patient_bloodType,
            educationBackground: observation.patient_educationBackground,
            occupation: observation.patient_occupation,
        }, hospital: {
            hospitalId: observation.hospital_id,
            name: observation.hospital_name,
            address: observation.hospital_address,
            number: observation.hospital_number,
            email: observation.hospital_email
        },
        practitioner: {
            practitionerId: observation.practitioner_id,
            firstName: observation.practitioner_firstName,
            lastName: observation.practitioner_lastName,
            address1: observation.practitioner_address1, address2: observation.practitioner_address2,
            number1: observation.practitioner_number1,
            number2: observation.practitioner_number2,
            checkIn: observation.practitioner_checkIn,
            checkOut: observation.practitioner_checkOut
        },
        nurse: {
            nurseId: observation.nurse_id,
            firstName: observation.nurse_firstName,
            lastName: observation.nurse_lastName,
            address1: observation.nurse_address1,
            address2: observation.nurse_address2,
            number1: observation.number1,
            checkOut: observation.number2observations
        },
        medication: {
            medicationId: observation.medication_id,
            medication_name: observation.medication_name,
            medication_company: observation.medication_company,
            medication_level: observation.medication_level,
            medication_remark: observation.medication_remark
        }
    };
}
export default transformCsvToSchema;