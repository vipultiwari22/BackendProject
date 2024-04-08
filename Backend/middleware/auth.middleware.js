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

const authorizedRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new AppError("You must be logged in to access this route", 401);
      }

      // Check if user has the required role
      const currentUserRoles = req.user.role;
      if (!roles.includes(currentUserRoles)) {
        throw new AppError("You do not have permission to access this route", 403);
      }

      // If everything is okay, proceed to the next middleware
      next();
    } catch (error) {
      next(error); // Pass error to the error handling middleware
    }
  };
};

const authorizedSubscriber = (req, res, next) => {
  const subscription = req.user.subscription;
  const currentRole = req.user.role;

  if (currentRole !== "ADMIN" && subscription.status !== "active") {
    return next(
      new AppError("please subscribe to access the course details!", 400)
    );
  }
};
export { isLoggedin, authorizedRoles, authorizedSubscriber };
