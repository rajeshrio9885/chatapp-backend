const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const connectDb = require("./lib/dbconfig");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const { statusCode, responseUtil } = require("./utils/appUtils");
const contactRoute = require("./routes/contact.routes");
const app = express();
dotenv.config();

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoute);

//multer config
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      err.badReq = true;
      err.message = "Image size must be 2MB";
      return res.status(statusCode(err)).json(responseUtil(err, null));
    }
  }
  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(
    "Server is running on port " + PORT + " on " + process.env.ENV_MODE,
  );
  connectDb();
});
