import mongoose, { Schema, model } from "mongoose";

const HospitalSchema = new Schema<any>(
  {
    hospitalId: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    number: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const HospitalModel = model<any>("Hospital", HospitalSchema);

HospitalSchema.pre("save", function (next) {
  const self = this;
  HospitalModel.exists(
    { hospitalId: self.hospitalId },
    function (err, present) {
      if (!present) {
        next();
      } else {
        const data = this.getUpdate();
        this.update({}, data).exec();
        next();
      }
    }
  );
});

export { HospitalSchema, HospitalModel };
