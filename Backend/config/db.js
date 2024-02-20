import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectionToDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms")
      .then((conn) => {
        console.log(`Connection Establish To ${conn.connection.host}`);
      });
  } catch (error) {
    console.log(`Connection Error ${error.message}`);
    process.exit(1);
  }
};

export default connectionToDb;
