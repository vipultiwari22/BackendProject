import { User } from "../models/user.model.js";
const { default: AppError } = require("../utils/error.util");

exports.register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new AppError("Email alerdy exists", 400));
  }
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "#",
    },
  });
  if (!user) {
    return next(new AppError("User registration faild, Please try again"));
  }

  // file Upload

  await user.save();
  user.password = undefined;

  const token = await user.genrateJWTtoken();

  res.status(200).json({
    success: true,
    message: "User registration successfully",
    user,
  });
};
exports.login = (req, res) => {};
exports.logout = (req, res) => {};
exports.getProfile = (req, res) => {};
