import { Schema, model } from "mongoose";
import { IObservation } from "../types/pateint.service.types";

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

export default ObservationModel;
