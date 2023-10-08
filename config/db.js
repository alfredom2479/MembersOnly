const mongoose = require("mongoose");
const debug = require("debug")("test");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    debug(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    debug(error);
    process.exit(1);
  }
};

module.exports = connectDB;
