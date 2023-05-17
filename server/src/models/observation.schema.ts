import { Schema, model } from "mongoose";

const ObservationSchema = new Schema<any>(
  {
    observationId: {
      type: String,
      unique: true,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    remark: {
      type: String,
    },
    patientId: {
      type: String,
    },
    hospitalId: {
      type: String,
    },
    practitionerId: {
      type: String,
    },
    nurseId: {
      type: String,
    },
    medicationId: {
      type: String,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const ObservationModel = model<any>("Observation", ObservationSchema);

ObservationSchema.pre("save", function (next) {
  var self = this;
  ObservationModel.exists(
    { observationId: self.observationId },
    function (err, present) {
      if (!present) {
        next();
      } else {
        console.log("user exists: ", self.observationId);
        next(new Error("User exists!"));
      }
    }
  );
});

export default ObservationModel;
