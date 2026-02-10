const { User } = require("../models/user.model");
const { statusCode, responseUtil } = require("../utils/appUtils");
const { protectRoute } = require("../middleware/auth.middleware");

const searchUserByNm = async (req, res) => {
  try {
    const searchNm = req.body.srchTxt;

    const user = await User.find(
      { fNm: { $regex: searchNm, $options: "i" } },
      { fNm: 1, img: 1, color: 1 },
      { lean: true },
    );

    res.status(statusCode()).json(responseUtil(null, user));
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error));
  }
};

module.exports = { searchUserByNm };
