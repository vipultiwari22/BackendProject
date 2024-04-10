import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import mongoose
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Changed import name to lowercase
import crypto from 'crypto';

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Name must be at least 5 characters"], // Fixed typo in error message
      maxLength: [50, "Name must be 50 characters at most"], // Fixed typo in error message
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER", // Fixed typo in default value
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date, // Changed to Date type
    subscription: {
      type: String,
      status: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJWTtoken: async function () {
    return await jwt.sign( // Changed to lowercase
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  comparePassword: async function (plainTextpassword) {
    return await bcrypt.compare(plainTextpassword, this.password);
  },

  generatePasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min from now
  },
};

const User = mongoose.model("User", userSchema); // Changed to default import syntax

export default User;
