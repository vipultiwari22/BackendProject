import { Router } from "express";
import {
  cangePassword,
  forgotPassword,
  getAllUser,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
} from "../controllers/user.contrller.js";
import { isLoggedin } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/getAllUser", getAllUser);
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedin, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", isLoggedin, cangePassword);
router.put("/update", isLoggedin, upload.single("avatar"), updateProfile);

export default router;
