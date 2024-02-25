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

const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRoles = req.user.role;
    if (!roles.includes(currentUserRoles)) {
      return next(
        new AppError("You do not have permission to accsess this route", 400)
      );
    }
    next();
  };
export { isLoggedin, authorizedRoles };
