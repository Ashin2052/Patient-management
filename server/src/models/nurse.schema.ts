import mongoose, {Schema, model} from 'mongoose';

const NurseSchema = new Schema<any>({
     nurse_id: {
            type: String,
        },firstName: {
            type: String,
        },lastName: {
            type: String,
        },address1: {
            type: String,
        },address2: {
            type: String,
        },number1: {
            type: String,
        },checkOut: {
            type: String,
        }
    },
    {
        timestamps: true,
        id: true,
        toJSON: {
            transform(doc, nurse) {
                nurse.id = nurse._id
                delete nurse._id
            }
        }
    });




const  NurseModel =  model<any>('Nurse', NurseSchema)

NurseSchema.pre('save', function (next) {
    var self = this;
    NurseModel.exists({id : self.id}, function (err, present) {
        if (!present){
            next();
        }else{
            console.log('user exists: ',self.observation_id);
            next(new Error("User exists!"));
        }
    });
});

export {NurseSchema, NurseModel};