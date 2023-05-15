import mongoose, {Schema, model} from 'mongoose';

const MedicationSchema = new Schema<any>({
        medicationId: {
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




const  MedicationModel =  model<any>('Medication', MedicationSchema)

MedicationSchema.pre('save', function (next) {
    var self = this;
    MedicationModel.exists({medicationId : self.medicationId}, function (err, present) {
        if (!present){
            next();
        }else{
            console.log('user exists: ',self.medicationId);
            MedicationModel.updateOne(present);
        }
    });
});

export {MedicationSchema, MedicationModel};