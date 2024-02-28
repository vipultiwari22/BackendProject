import { Router } from "express";
import {
  authorizedRoles,
  authorizedSubscriber,
  isLoggedin,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

import {
  addLecturesCourseById,
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
  .post(authorizedRoles("ADMIN"), upload.single("thumbnail"), createCourse);

router
  .route("/:id")
  .get(isLoggedin, authorizedSubscriber, getLecturesByCourseId)
  .put(isLoggedin, authorizedRoles("ADMIN"), updateCourse)
  .delete(isLoggedin, authorizedRoles("ADMIN"), deleteCourse)
  .post(
    isLoggedin,
    authorizedRoles("ADMIN"),
    upload.single("lecture"),
    addLecturesCourseById
  );

export default router;
