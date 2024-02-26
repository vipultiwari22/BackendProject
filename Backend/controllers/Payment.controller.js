import { Payments } from "../models/Payment.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";

const getRazorPayApiKey = async (req, res, next) => {
  req.status(200).jaon({
    success: true,
    message: "Razorpay API Key",
    Key: process.env.RAZORPAY_KEY_ID,
  });
};
const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("Unauthorized, please login"));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchase a subscription", 400));
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscribed Successfully!",
      subscription_id: subscription.id,
    });
  } catch (error) {
    next(error); // Pass any error to the error handler middleware
  }
};

const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("Unauthorized, please try again"));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment not verified, please try again", 500));
    }

    await Payments.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment created and verified successfully!",
    });
  } catch (error) {
    next(error); // Pass any error to the error handler middleware
  }
};

const unSubscription = async (req, res, next) => {};
const AllPayments = async (req, res, next) => {};

export {
  getRazorPayApiKey,
  buySubscription,
  verifySubscription,
  unSubscription,
  AllPayments,
};
