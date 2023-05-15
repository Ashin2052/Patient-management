import mongoose, {Schema, model} from 'mongoose';

 const PractitionerSchema = new Schema<any>({
   practitionerId: {
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
        },number2: {
            type: String,
        },checkIn: {
            type: String,
        },checkOut: {
            type: String,
        }
    },
    {
        timestamps: true,
        id: true,
        toJSON: {
            transform(doc, user) {
                user.id = user.Id
                delete user.Id
            }
        }
    });




const  PractitionerModel =  model<any>('Practitioner', PractitionerSchema)

PractitionerSchema.pre('save', function (next) {
    var self = this;
    PractitionerModel.exists({practitionerId : self.practitionerId}, function (err, present) {
        if (!present){
            next();
        }else{
            console.log('user exists: ',self.practitionerId);
            next(new Error("User exists!"));
        }
    });
});

export {PractitionerSchema, PractitionerModel};