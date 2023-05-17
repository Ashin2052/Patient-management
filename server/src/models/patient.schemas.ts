import mongoose, { Schema, model } from "mongoose";
const PatientSchema = new Schema<any>(
  {
    patientSsn: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    country: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    number1: {
      type: String,
    },
    number2: {
      type: String,
    },
    sex: {
      type: String,
    },
    DOB: {
      type: String,
    },
    DOD: {
      type: String,
    },
    email: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    bloodType: {
      type: String,
    },
    educationBackground: {
      type: String,
    },
    occupation: {
      type: String,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const PatientModel = model<any>("Patient", PatientSchema);

PatientSchema.pre("save", function (next, err) {
  var self = this;
  PatientModel.exists({ patientSsn: self.patientSsn }, function (err, present) {
    if (!present) {
      next();
    } else {
      const data = this.getUpdate();
      this.update({}, data).exec();
      next();
    }
  });
});

export { PatientSchema, PatientModel };
