import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Name must be at lest 5 charecter"],
      maxLength: [50, "Name must be 50 charecter"],
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
      required: [true, "password is required"],
      minLength: [8, "password must be at lest 8 charecter"],
      maxLength: [16, "Name must be 16 charecter"],
      select: false,
    },
    avatar: {
      publid_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      defualt: "USER",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: String,
  },
  {
    timestamps: true,
  }
);

const user = model("User", userSchema);

export default user;
