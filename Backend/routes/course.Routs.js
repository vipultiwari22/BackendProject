import { Router } from "express";
import { isLoggedin } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getLecturesByCourseId,
  updateCourse,
} from "../controllers/course.controller.js";

const router = new Router();

router
  .route("/")
  .get(getAllCourses)
  .post(upload.single("thumbnail"), createCourse);

router
  .route("/:id")
  .get(isLoggedin, getLecturesByCourseId)
  .put(isLoggedin, updateCourse)
  .delete(isLoggedin, deleteCourse);

export default router;
