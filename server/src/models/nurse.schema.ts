import mongoose, { Schema, model } from "mongoose";

const NurseSchema = new Schema<any>(
  {
    nurseId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
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
    checkOut: {
      type: String,
    },
    overTime: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const NurseModel = model<any>("Nurse", NurseSchema);

NurseSchema.pre("save", function (next) {
  var self = this;
  NurseModel.exists({ id: self.id }, function (err, present) {
    if (!present) {
      next();
    } else {
      const data = this.getUpdate();
      this.update({}, data).exec();
      next();
    }
  });
});

export { NurseSchema, NurseModel };
