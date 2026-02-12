const { User } = require("../models/user.model");
const { statusCode, responseUtil } = require("../utils/appUtils");
const { protectRoute } = require("../middleware/auth.middleware");

const searchUserByNm = async (req, res) => {
  try {
    const searchNm = req.body.srchTxt;

    const user = await User.find(
      {
        $and: [
          { fNm: { $regex: searchNm, $options: "i" } },
          { _id: { $ne: req.user._id } }, 
        ],
      },
      { fNm: 1, img: 1, color: 1, email :1 },
      { lean: true },
    );

    res.status(statusCode()).json(responseUtil(null, user));
  } catch (error) {
    res.status(statusCode(error)).json(responseUtil(error));
  }
};

module.exports = { searchUserByNm };
