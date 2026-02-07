const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be required"],
      unique: true,
      lowercase: true,
      match: [/^[^s@]+@[^s@]+.[^s@]+$/, "Invalid email address"],
    },
    pass: {
      //password
      type: String,
      required: [true, "Password must be required"],
      minlength: [8, "Password must be more than 8 character"],
      select: false, // not select the password when querying
      trim: true,
    },
    fNm: {
      //first name
      type: String,
    },
    lNm: {
      //last name
      type: String,
    },
    img: {
      //Image
      type: String,
    },
    color: {
      type: Number,
      enum: [0, 1, 2, 3],
    },
    prfSetUp: {
      // profile setup status flag
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "crAt", updatedAt: "moAt" } }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.pass = await bcrypt.hash(this.pass, salt);
});

module.exports = { User: mongoose.model("User", userSchema) };
