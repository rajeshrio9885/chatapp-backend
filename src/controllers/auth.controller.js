const { cloudinary } = require("../lib/cloudinaryConfig");
const { createJwtToken } = require("../middleware/auth.middleware");
const { User } = require("../models/user.model");
const { responseUtil, statusCode } = require("../utils/appUtils");
const bcrypt = require("bcryptjs");

const signIn = async (req, res, next) => {
  try {
    const { email, pass } = req.body;
    const user = new User({ email, pass });
    await user.save();
    //create jwt token here
    createJwtToken(user._id, res);
    res
      .status(statusCode(201))
      .json(responseUtil(null, "user created successfully"));
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error, null));
  }
};

const logIn = async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      throw { badReq: true, message: "Email or password is missing" };
    }
    const user = await User.findOne(
      { email },
      { email: 1, pass: 1, fNm: 1, lNm: 1, img: 1, color: 1, prfSetUp: 1 },
    ).lean();
    if (!user) {
      throw { notFound: true, message: "User not found" };
    }
    const isCrtPass = await bcrypt.compare(pass, user.pass);

    if (!isCrtPass) {
      throw { badReq: true, message: "Incorrect password" };
    }
    createJwtToken(user._id, res);
    res.status(statusCode()).json(responseUtil(null, user));
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error, null));
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(statusCode())
      .json(responseUtil(null, "Logout successfully"));
  } catch (error) {
    console.log(error);
    res.status(statusCode(error)).json(responseUtil(error, null));
  }
};

const getUserInfo = async (req, res) => {
  try {
    res.status(statusCode()).json(responseUtil(null, { user: req.user }));
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error));
  }
};

const updateProfile = async (req, res) => {
  try {
    let url = "";
    let updatedData = [];
    if (req.file?.path) {
      url = await cloudinary.uploader.upload(req.file.path);
    }

    const userData = await User.findById(req.user._id, {});
    if (req.body.isDelete && userData.img) {
      const publicKey = userData.img
        .slice(userData.img.lastIndexOf("/") + 1)
        .split(/\./)[0];
      await cloudinary.uploader.destroy(publicKey);
      updatedData = await User.findByIdAndUpdate(
        req.user._id,
        { img: null },
        { new: true },
      );
    } else {
      updatedData = await User.findByIdAndUpdate(
        req.user._id,
        {
          fNm: req.body.fNm,
          lNm: req.body.lNm,
          color: req.body.color,
          img: url.secure_url,
          prfSetUp: true,
        },
        { new: true },
      );
    }

    res.status(statusCode()).json(responseUtil(null, updatedData));
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error));
  }
};

module.exports = {
  signIn,
  logIn,
  logOut,
  getUserInfo,
  updateProfile,
};
