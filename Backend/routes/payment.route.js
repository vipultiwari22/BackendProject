import { Router } from "express";
import {
  AllPayments,
  buySubscription,
  getRazorPayApiKey,
  unSubscription,
  verifySubscription,
} from "../controllers/Payment.controller.js";
import { authorizedRoles, isLoggedin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/razorpay-key").get(isLoggedin, getRazorPayApiKey);
router.route("/subscribe").post(isLoggedin, buySubscription);
router.route("/verify").post(isLoggedin, verifySubscription);
router.route("/unsubscribe").post(isLoggedin, unSubscription);
router.route("/").get(isLoggedin, authorizedRoles("ADMIN"), AllPayments);

export default router;
