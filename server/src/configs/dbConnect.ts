import mongoose from "mongoose";
import logger from "./logger";

type TInput = {
  db: string;
};

export const dbConnect = ({ db }: TInput) => {
  const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(db)
      .then(() => {
        logger.info(`Successfully connected to database`);
        return;
      })
      .catch((error) => {
        console.log(error);
        logger.error("Error connecting to database: ", error.toString());
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};

export const close = () => {
  mongoose.connection.close().then(() => {
    logger.info(`Successfully disconnected`);
  });
};
