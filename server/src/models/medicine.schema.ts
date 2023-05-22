import mongoose, { Schema, model } from "mongoose";

const MedicationSchema = new Schema<any>(
  {
    medicationId: {
      type: String,
    },
    medicationName: {
      type: String,
    },
    medicationCompany: {
      type: String,
    },
    medicationLevel: {
      type: String,
    },
    medicationRemark: {
      type: String,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const MedicationModel = model<any>("Medication", MedicationSchema);

MedicationSchema.pre("save", function (next) {
  const self = this;
  MedicationModel.exists(
    { medicationId: self.medicationId },
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

export { MedicationSchema, MedicationModel };
