import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const getRazorPayApiKey = async (req, res, next) => {
  req.status(200).jaon({
    success: true,
    message: "Razorpay API Key",
    Key: process.env.RAZORPAY_KEY_ID,
  });
};
const buySubscription = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Unathorized,please login"));
  }

  if (user.role === "ADMIN") {
    return next(new AppError("Admin cannot purchase a subscription", 400));
  }

  const Subscription = await razor
};
const verifySubscription = async (req, res, next) => {};
const unSubscription = async (req, res, next) => {};
const AllPayments = async (req, res, next) => {};

export {
  getRazorPayApiKey,
  buySubscription,
  verifySubscription,
  unSubscription,
  AllPayments,
};
