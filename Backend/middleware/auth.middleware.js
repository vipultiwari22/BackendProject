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
