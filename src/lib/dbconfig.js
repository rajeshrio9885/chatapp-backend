const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      "Database connection sucessfull on host " + dbConnect.connection.host
    );
  } catch (error) {
    console.error("Error in Db connection " + error.message);
  }
};

module.exports = connectDb;
