import mongoose, {Schema, model} from 'mongoose';

const PatientSchema = new Schema<any>({
        observation_id: {
            type: String,
            unique : true,
        },observation_date: {
            type: String,
        },observation_time: {
            type: String,
        },observation_remark: {
            type: String,
        },patient_ssn: {
            type: String,
        },patient_firstName: {
            type: String,
        },patient_lastName: {
            type: String,
        },patient_country: {
            type: String,
        },patient_address1: {
            type: String,
        },patient_address2: {
            type: String,
        },patient_number1: {
            type: String,
        },patient_number2: {
            type: String,
        },patient_sex: {
            type: String,
        },patient_DOB: {
            type: String,
        },patient_DOD: {
            type: String,
        },patient_email: {
            type: String,
        },patient_height: {
            type: String,
        },patient_weight: {
            type: String,
        },patient_bloodType: {
            type: String,
        },patient_educationBackground: {
            type: String,
        },patient_occupation: {
            type: String,
        },hospital_id: {
            type: String,
        },hospital_name: {
            type: String,
        },hospital_address: {
            type: String,
        },hospital_number: {
            type: String,
        },hospital_email: {
            type: String,
        },practitioner_id: {
            type: String,
        },practitioner_firstName: {
            type: String,
        },practitioner_lastName: {
            type: String,
        },practitioner_address1: {
            type: String,
        },practitioner_address2: {
            type: String,
        },practitioner_number1: {
            type: String,
        },practitioner_number2: {
            type: String,
        },practitioner_checkIn: {
            type: String,
        },practitioner_checkOut: {
            type: String,
        },nurse_id: {
            type: String,
        },nurse_firstName: {
            type: String,
        },nurse_lastName: {
            type: String,
        },nurse_address1: {
            type: String,
        },nurse_address2: {
            type: String,
        },nurse_number1: {
            type: String,
        },nurse_checkOut: {
            type: String,
        },medication_id: {
            type: String,
        },medication_name: {
            type: String,
        },medication_company: {
            type: String,
        },medication_level: {
            type: String,
        },medication_remark: {
            type: String,
        }
    },
    {
        timestamps: true,
        id: true,
        toJSON: {
            transform(doc, user) {
                user.id = user._id
                delete user._id
            }
        }
    });




const  PatientModel =  model<any>('Patient', PatientSchema)

PatientSchema.pre('save', function (next) {
    var self = this;
    PatientModel.exists({observation_id : self.observation_id}, function (err, present) {
        if (!present){
            next();
        }else{
            console.log('user exists: ',self.observation_id);
            next(new Error("User exists!"));
        }
    });
});

export  default  PatientModel;