import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/send.mail.js";
import crypto from "crypto";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httOnly: true,
  secure: true,
};

const getAllUser = async (req, res, next) => {
  try {
    const Users = await User.find({});
    if (!Users) {
      return next(new AppError("we did not get any user in to database", 500));
    }
    res.status(200).json({
      success: true,
      message: "We got Users!",
      Users,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return next(new AppError("Email alerdy exists", 409));
    }
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      avatar: {
        public_id: email,
        secure_url: "#",
      },
    });
    if (!user) {
      return next(new AppError("User registration faild, Please try again"));
    }

    // file Upload
    // console.log("File details > ", JSON.stringify(req.file));

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
          timeout: 600000,
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
    res.status(200).json({
      success: true,
      message: "user loggedIn successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const logout = (req, res,next) => {
  try {
    res.cookie("token", null, {
      secure: true,
      maxAge: 0,
      httpOnly: true,
    });
    res.status(200).json({
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

  const subject = "Reset Password";
  const message = `You can Reset you password by clicking <a href=${resetPasswordURL} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this in new tab ${resetPasswordURL}.\n If you have not registerd this, kidly ignore .`;

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

const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  console.log("Reset Token:", resetToken); // Add this line for debugging

  if (!resetToken || typeof resetToken !== "string") {
    return next(new Error("Reset token is invalid or missing."));
  }

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("Forgot Password Token:", forgotPasswordToken); // Add this line for debugging

  try {
    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError("Token is invalid or expired, please try again", 400)
      );
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save(); // Await user.save() to wait for the save operation to complete

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    // Handle any potential errors
    return next(error);
  }
};

const cangePassword = async (req, res, next) => {
  const { oldPassword, newpassword } = req.body;
  const { id } = req.user;
  if (!oldPassword || !newpassword) {
    return next(new AppError("All fields are mendatory", 400));
  }

  const user = await User.findOne(id).select("+password");

  if (!user) {
    return next(new AppError("User does not exist!", 400));
  }

  const isPasswordvalid = await user.comparePassword(oldPassword);

  if (!isPasswordvalid) {
    return next(new AppError("Invalid Old Password!", 400));
  }
  user.password = newpassword;
  await user.save();

  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "password Changed Successfully!",
  });
};

const updateProfile = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.user.id;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User does not exist!", 400));
  }

  if (req.fullName) {
    user.fullName = fullname;
  }

  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
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
  res.status(200).jason({
    success: true,
    message: "User Profile Update successfully!",
  });
};

export {
  getAllUser,
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  cangePassword,
  updateProfile,
};
