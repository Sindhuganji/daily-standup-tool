// Kept for compatibility if imported elsewhere.
// Delegates to authController to avoid duplicate auth logic.
const authController = require("./authController");

exports.signup = authController.register;
exports.login = authController.login;