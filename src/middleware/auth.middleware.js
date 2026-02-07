const jwt = require("jsonwebtoken");
const { statusCode, responseUtil } = require("../utils/appUtils");
const { User } = require("../models/user.model");

exports.createJwtToken = (id, res) => {
  try {
    console.log(process.env.ENV_MODE);
    const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "5d" });
    res.cookie("token", token, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      secure: process.env.ENV_MODE !== "DEVELOPMENT",
      httpOnly: true,
      sameSite: "strict",
    });
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error));
  }
};

exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw { notFound: true, message: "token not found" };
    }
    const { id: _id } = jwt.verify(token, process.env.JWT_KEY);
    if (_id) {
      const user = await User.findOne({ _id }).lean();
      if (!user) {
        throw { notFound: true, message: "user not found" };
      }
      req.user = user;
      next();
    } else {
      throw { notFound: true, message: "Invalid token" };
    }
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error));
  }
};
