import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";
const isLoggedin = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError("Unauthenticated, please Login again", 400));
  }

  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = userDetails;
  next();
};

export { isLoggedin };
