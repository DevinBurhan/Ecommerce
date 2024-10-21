const router = require("express").Router();
const controller = require("./users.controller");
const { guard } = require("../../helper");
const multerSetting = require("../../helper/multer").userImageUpload;
const { usersValidation } = require("./users.validation");

/*
 *  Register New User
 */
router.post("/register", controller.register);

/*
 *  Login
 */
router.post("/login", controller.login);

/*
 *  Resend verification Link
 */
router.post("/resend-verification-link", controller.resendVerificationLink);

/*
 *  Verify User Account
 */
router.post("/verify-user", controller.verifyUser);

/*
 *  Forgot Passowrd
 */
router.post("/forgot-password", controller.forgotPassword);

/*
 *  Reset Passowrd
 */
router.post("/reset-password", controller.resetPassword);

/*
 *  Update Profile
 */
router.post(
  "/update",
  multerSetting,
  guard.isAuthorized(["admin", "organizer", "player"]),
  controller.update
);

/*
 *  Change Password
 */
router.post(
  "/change-password",
  guard.isAuthorized(["admin", "organizer", "player"]),
  controller.changePassword
);

/*
 *  Get Profile
 */
router.get(
  "/get-profile",
  guard.isAuthorized(["admin", "organizer", "player"]),
  controller.get
);

/*
 *  logout
 */
router.post(
  "/logout",
  guard.isAuthorized(["admin", "organizer", "player"]),
  controller.logout
);

module.exports = router;
