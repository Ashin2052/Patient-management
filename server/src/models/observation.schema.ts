import { Schema, model } from "mongoose";
import { IObservation } from "../types/pateint.service.types";
import { MongooseQueryLogger } from "mongoose-query-logger";

export const queryLogger = new MongooseQueryLogger();
const ObservationSchema = new Schema<IObservation>(
  {
    observationId: {
      type: String,
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
    patient: {
      type: Schema.Types.ObjectId,
      ref: "patient",
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "hospital",
    },
    practitioner: {
      type: Schema.Types.ObjectId,
      ref: "practitioner",
    },
    nurse: {
      type: Schema.Types.ObjectId,
      ref: "nurse",
    },
    medication: {
      type: Schema.Types.ObjectId,
      ref: "medication",
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

ObservationSchema.plugin(queryLogger.getPlugin);
export default ObservationModel;
