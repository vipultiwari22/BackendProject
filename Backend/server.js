import app from "./app.js";
import cloudinary, { v2 } from "cloudinary";
import razorpay from "razorpay";

const PORT = process.env.PORT || 5001;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLUOD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const razorpay = new razarpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
