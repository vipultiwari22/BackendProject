import mongoose, { Schema, model } from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_subscription_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
  },
  {
    timeseries: true,
  }
);

const Payments = model("Payments", PaymentSchema);

export { Payments };
