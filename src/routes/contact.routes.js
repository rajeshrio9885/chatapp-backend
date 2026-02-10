const express = require("express");
const { searchUserByNm } = require("../controllers/contact.controller.");
const { protectRoute } = require("../middleware/auth.middleware");

const contactRoute = express.Router();

contactRoute.post("/get-contact", protectRoute, searchUserByNm);

module.exports = contactRoute;
