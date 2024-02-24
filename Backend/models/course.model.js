import mongoose, { model } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [8, "Title must be atleast 8 charecter"],
      maxLength: [60, "Title should be atleast 60 charecter"],
    },
    description: {
      type: String,
      required: [true, "Title is required"],
      minLength: [8, "Description must be atleast 8 charecter"],
      maxLength: [200, "Description should be atleast 200 charecter"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },

    lectures: {
      title: String,
      description: String,
      lecture: {
        public_id: {
          type: String,
          // required: true,
        },
        secure_url: {
          type: String,
          // required: true,
        },
      },
    },
    numbersOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);

export default Course;
