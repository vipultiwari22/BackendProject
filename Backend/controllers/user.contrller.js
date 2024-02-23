import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  try {
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
    console.log("File details > ", JSON.stringify(req.file));

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          // Remove file from server
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return next(
          new AppError(error || "File not uploaded, please try again", 500)
        );
      }
    }

    await user.save();
    user.password = undefined;

    const token = await user.genrateJWTtoken();
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User registration successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required"));
    }
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user || !user.comparePassword(password)) {
      return next(new AppError("password does Not match"));
    }

    const token = await user.genrateJWTtoken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);
    res.send(200).json({
      success: true,
      message: "user loggedIn successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const logout = (req, res) => {
  try {
    res.cookie("token", null, {
      secure: true,
      maxAge: 0,
      httpOnly: true,
    });
    res.statu(200).json({
      message: "user loggedOut successfully",
      success: true,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: "Usr deatils",
      user,
    });
  } catch (error) {
    return next(new AppError("failed to fetch Profile"));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is requred", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email not registerd", 400));
  }

  const resetToken = await user.genratePasswordResetToken();

  await user.save();
  const resetPasswordURL = `${process.env.FORNTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: `Reset Password Token has been send to your ${email} successfully`,
    });
  } catch (error) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();
    return next(new AppError(error.message, 400));
  }
};

const resetPassword = async () => {};

export { register, login, logout, getProfile, forgotPassword, resetPassword };
