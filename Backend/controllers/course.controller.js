import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async (req, res, next) => {
  try {
    const giveMeAllCourses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All Courses",
      giveMeAllCourses,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById({ id });
    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully!",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: "Dummy",
        secure_url: "Dummy",
      },
    });

    if (!course) {
      return next(
        new AppError("Course could not be created please try again!")
      );
    }

    try {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
        });
        // console.log(json.stringify(result));
        if (result) {
          course.thumbnail.public_id = result.public_id;
          course.thumbnail.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError(error.message, 500));
    }

    await course.save();
    res.status(200).json({
      succcess: true,
      message: "course creted successfully!",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );
    if (!course) {
      return next(new AppError("Course with id does not exist!", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course Updated successfully!",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError("Course with Given id does not exist!"));
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully!",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const addLecturesCourseById = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!title || !description) {
      return next(new AppError("All fields are required", 400));
    }

    if (!course) {
      return next(new AppError("Course with given id does not exist!", 500));
    }

    const lectureData = {
      title,
      description,
      lecture: {},
    };
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
        });
        // console.log(json.stringify(result));
        if (result) {
          course.lecture.public_id = result.public_id;
          course.lecture.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        return next(new AppError(error.message, 500));
      }
    }
    course.lectures.push(lectureData);
    course.numbersOfLectures = course.lectures.length;

    await course.save();
    res.status(200).json({
      success: true,
      mesage: "Course lectures  Added succesfully to the course!",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  deleteCourse,
  addLecturesCourseById,
};
