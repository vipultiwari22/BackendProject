import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

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

export { register, login, logout, getProfile };
