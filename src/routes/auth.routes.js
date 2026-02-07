const express = require("express");
const {
  signIn,
  logIn,
  logOut,
  getUserInfo,
  updateProfile,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");
const { upload } = require("../lib/multerConfig.js");
const authRoutes = express.Router();

authRoutes.post("/signin", signIn);

authRoutes.post("/login", logIn);

authRoutes.post("/logout", logOut);

authRoutes.get("/getuserInfo", protectRoute, getUserInfo);

authRoutes.put(
  "/update-profile",
  protectRoute,
  upload.single("img"),
  updateProfile,
);

module.exports = authRoutes;
