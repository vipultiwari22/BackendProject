const { default: AppError } = require("../utils/error.util");

exports.register = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }
};
exports.login = (req, res) => {};
exports.logout = (req, res) => {};
exports.getProfile = (req, res) => {};
