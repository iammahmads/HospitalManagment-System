import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to database !");
    })
    .catch((err) => {
      console.log(`some error occurred while connecting to database: ${err}`);
    });
};
