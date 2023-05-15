import mongoose, {Schema, model} from 'mongoose';

const HospitalSchema = new Schema<any>({
    hospitalId: {
            type: String,
        },name: {
            type: String,
        },address: {
            type: String,
        },number: {
            type: String,
        },email: {
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




const  HospitalModel =  model<any>('Hospital', HospitalSchema)

HospitalSchema.pre('save', function (next) {
    var self = this;
    HospitalModel.exists({hospitalId : self.hospitalId}, function (err, present) {
        if (!present){
            next();
        }else{
            console.log('user exists: ',self.hospitalId);
            next(new Error("User exists!"));
        }
    });
});

export {HospitalSchema, HospitalModel};