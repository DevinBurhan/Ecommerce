const passport = require("passport");
const UsersService = require("./users.services");
const guard = require("../../helper/guards");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

module.exports = {
  /*
   *  Register New User
   */
  register: async (req, res, next) => {
    try {
      req.body.email = req.body.email.toLowerCase();
      let is_exist = await UsersService.is_exist(req.body);
      if (is_exist) {
        return next(new Error("EMAIL_EXIST"));
      }
      if (req.files != undefined && req.files.image != undefined) {
        req.body.image =
          process.env.DOMAIN_URL +
          "/user-profile/" +
          req.files.image[0].filename;
      }

      // Handle splitting userName into first_name and last_name
      if (!req.body.first_name || !req.body.last_name) {
        if (req.body.userName) {
          const nameParts = req.body.userName?.trim()?.split(" ");
          req.body.first_name = nameParts[0]; // Set first part as first_name

          // Check if there is a last name part
          req.body.last_name =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        } else {
          return next(new Error("USERNAME_REQUIRED")); // Error if userName is not provided
        }
      }
      req.body.password = await commonFunctions.encryptStringCrypt(
        req.body.password
      );

      // req.body.otp = await commonFunctions.randomSixDigit();
      req.body.otp = "123456";
      // is_exist.otp = await UsersService.otpGenerate(is_exist);

      let user = await UsersService.save(req.body);

      if (user) {
        /* Send Account Verification Link */
        let emailData = {
          to: user.email,
          subject: "boiler_plate || Account Verification OTP",
          text: `Your account verification Link Is ${user.otp}`,
          html: `<h1> boiler_plate </h1>
                            <p>Your account verification OTP is :  ${user.otp}</b></p>`,
        };
        // nodemailer.sendMail(emailData);

        let getUser = await UsersService.get(user._id);
        commonResponse.success(
          res,
          "USER_CREATED",
          200,
          getUser,
          "We have sent account verification OTP to your email, Please verify your account to continue"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          user,
          "Something went wrong, Please try again"
        );
      }
    } catch (error) {
      console.log("Create User -> ", error);
      return next(error);
    }
  },

  /*
   *  Login
   */
  login: async (req, res, next) => {
    passport.authenticate("user", async function (err, user, info) {
      if (err) {
        var err = err;
        err.status = 400;
        return next(err);
      }
      if (info) {
        var err = new Error("Missing_Credentials");
        err.status = 400;
        return next(err);
      }

      if (user) {
        if (user.status == "pending") {
          return commonResponse.customResponse(
            res,
            "USER_NOT_VERIFIED",
            400,
            user,
            "Please verify your email to login"
          );
        }
        if (user.status == "deactivated") {
          return commonResponse.customResponse(
            res,
            "USER_DEACTIVATED",
            400,
            user,
            "Your account has been deactivated, Please contact admin to activate your account"
          );
        }
        // await UsersService.update(user._id, {
        //     fcm_token: req.body.fcm_token ? req.body.fcm_token : "",
        //     device_type: req.body.device_type ? req.body.device_type : "android",
        //     device_id: req.body.device_id ? req.body.device_id : "",
        // })
        let userResponse = await UsersService.get(user.id);
        const token = await guard.createToken(user, userResponse.role);
        userResponse.token = token.token;
        return commonResponse.success(res, "LOGIN_SUCCESS", 200, userResponse);
      } else {
        return commonResponse.customResponse(
          res,
          "USER_NOT_FOUND",
          400,
          {},
          "User not found"
        );
      }
    })(req, res, next);
  },

  /*
   *  Resend Verification Link
   */
  resendVerificationLink: async (req, res, next) => {
    try {
      req.body.email = req.body.email.toLowerCase();
      let user = await UsersService.is_exist(req.body);
      if (user) {
        // let otp = await commonFunctions.randomSixDigit();
        // user.otp = await UserServices.otpGenerate(user);
        let otp = "123456";
        let updateData = {
          otp: otp,
        };
        let updateUser = await UsersService.update(user._id, updateData);
        if (updateUser) {
          /* Send Account Verification OTP */
          // let emailData = {
          //     to: updateUser.email,
          //     subject: "boiler_plate || Account Verification OTP",
          //     text: `Your account verification Link Is ${updateUser.otp}`,
          //     html: `<h1> boiler_plate </h1>
          //             <p>Your account verification OTP is :  ${updateUser.otp}</b></p>`,
          // };
          // nodemailer.sendMail(emailData);

          return commonResponse.success(
            res,
            "RESEND_VERIFICATION_LINK_SUCCESS",
            200,
            updateUser,
            "We have sent account verification OTP to your email, Please verify your account to continue"
          );
        } else {
          return commonResponse.customResponse(
            res,
            "SERVER_ERROR",
            400,
            {},
            "Something went wrong please try again"
          );
        }
      } else {
        return commonResponse.customResponse(
          res,
          "EMAIL_NOT_EXIST",
          400,
          {},
          "Email does not exist"
        );
      }
    } catch (error) {
      console.log("Resend User Verification Link -> ", error);
      return next(error);
    }
  },

  /*
   *  Verify User
   */
  verifyUser: async (req, res, next) => {
    try {
      let getUser = await UsersService.is_exist(req.body);
      if (getUser) {
        if (getUser.status == "deactivated") {
          return commonResponse.customResponse(
            res,
            "USER_DEACTIVATED",
            400,
            getUser,
            "Your account has been deactivated, Please contact admin to activate your account"
          );
        }
        if (
          req.body.otp != getUser.otp ||
          req.body.otp == 0 ||
          req.body.otp == "0"
        ) {
          return commonResponse.customResponse(
            res,
            "INVALID_OTP",
            400,
            getUser,
            "Please enter valid otp"
          );
        }

        let updateData = {
          status: "verified",
          otp: 0,
        };

        let updateUserDetails = await UsersService.update(
          getUser._id,
          updateData
        );
        if (updateUserDetails) {
          const token = await guard.createToken(updateUserDetails, "user");
          updateUserDetails.token = token.token;
          return commonResponse.success(
            res,
            "USER_VERIFIED_SUCCESS",
            200,
            updateUserDetails,
            "Success"
          );
        } else {
          return commonResponse.customResponse(
            res,
            "SERVER_ERROR",
            400,
            {},
            "Something went wrong please try again"
          );
        }
      } else {
        return commonResponse.customResponse(
          res,
          "EMAIL_NOT_EXIST",
          400,
          {},
          "Email does not exist"
        );
      }
    } catch (error) {
      console.log("Verify User -> ", error);
      return next(error);
    }
  },

  /*
   *  Forgot Password
   */
  forgotPassword: async (req, res, next) => {
    try {
      req.body.email = req.body.email.toLowerCase();
      let checkUserExist = await UsersService.is_exist(req.body);
      if (checkUserExist) {
        if (checkUserExist.status == "deactivated") {
          return commonResponse.customResponse(
            res,
            "USER_DEACTIVATED",
            400,
            checkUserExist,
            "Your account has been deactivated, Please contact admin to activate your account"
          );
        }
        //let otp = await commonFunctions.randomSixDigit();
        let otp = "123456";
        let updateData = {
          otp: otp,
        };
        let updateUser = await UsersService.update(
          checkUserExist._id,
          updateData
        );
        /* Send Reset Password OTP */
        let emailData = {
          to: updateUser.email,
          subject: "boiler_plate || Reset Password OTP",
          text: `Your Reset Password OTP Is ${updateUser.otp}`,
          html: `<h1> boiler_plate </h1>
                            <p>Your Reset Password verification OTP is <br><br><b>${updateUser.otp}</b></p>`,
        };
        // nodemailer.sendMail(emailData);

        return commonResponse.success(
          res,
          "FORGOT_PASSWORD_SUCCESS",
          200,
          updateUser,
          "We have send reset password OTP to your email"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "EMAIL_NOT_EXIST",
          400,
          {},
          "Email does not exist"
        );
      }
    } catch (error) {
      console.log("User Forgot Password -> ", error);
      return next(error);
    }
  },

  /*
   *  Reset Password
   */
  resetPassword: async (req, res, next) => {
    try {
      let user = await UsersService.get(req.body._id);
      if (user) {
        if (user.status == "pending") {
          return commonResponse.customResponse(
            res,
            "USER_NOT_VERIFIED",
            400,
            user,
            "Please verify your email"
          );
        }
        if (user.status == "deactivated") {
          return commonResponse.customResponse(
            res,
            "USER_DEACTIVATED",
            400,
            user,
            "Your account has been deactivated, Please contact admin to activate your account"
          );
        }

        if (req.body.new_password == req.body.confirm_password) {
          req.body.new_password = await commonFunctions.encryptStringCrypt(
            req.body.new_password
          );
          let updateData = {
            password: req.body.new_password,
          };
          let updateUserDetails = await UsersService.update(
            user._id,
            updateData
          );
          if (updateUserDetails) {
            return commonResponse.success(
              res,
              "PASSWORD_RESET_SUCCESS",
              200,
              updateUserDetails,
              "Password reset successfully"
            );
          } else {
            return commonResponse.customResponse(
              res,
              "SERVER_ERROR",
              400,
              {},
              "Something went wrong please try again"
            );
          }
        } else {
          return commonResponse.customResponse(
            res,
            "INVALID_CONFIRM_PASSWORD",
            400,
            {},
            "Confirm password did not match, Please try again"
          );
        }
      } else {
        return commonResponse.customResponse(
          res,
          "USER_NOT_FOUND",
          400,
          {},
          "User not found"
        );
      }
    } catch (error) {
      console.log("User Reset Password -> ", error);
      return next(error);
    }
  },

  /*
   *  Update Profile
   */
  update: async (req, res, next) => {
    try {
      if (req.files != undefined && req.files.image != undefined) {
        req.body.image =
          process.env.DOMAIN_URL +
          "/user-profile/" +
          req.files.image[0].filename;
      }
      let updatedUser = await UsersService.update(req.user.id, req.body);
      commonResponse.success(res, "USER_PROFILE_UPDATE", 200, updatedUser);
    } catch (error) {
      return next(error);
    }
  },

  /*
   *  Change Password
   */
  changePassword: async (req, res, next) => {
    try {
      let getUser = await UsersService.get(req.user.id);
      if (getUser) {
        let isPasswordValid = await commonFunctions.matchPassword(
          req.body.old_password,
          getUser.password
        );
        if (isPasswordValid) {
          if (req.body.new_password == req.body.confirm_password) {
            req.body.new_password = await commonFunctions.encryptStringCrypt(
              req.body.new_password
            );
            let updateData = {
              password: req.body.new_password,
            };
            let updatePassword = await UsersService.update(
              req.user.id,
              updateData
            );
            if (updatePassword) {
              return commonResponse.success(
                res,
                "PASSWORD_CHANGED_SUCCESS",
                200,
                updatePassword,
                "Password changed successfully"
              );
            } else {
              return commonResponse.customResponse(
                res,
                "SERVER_ERROR",
                400,
                {},
                "Something went wrong please try again"
              );
            }
          } else {
            return commonResponse.customResponse(
              res,
              "INVALID_CONFIRM_PASSWORD",
              400,
              {},
              "Confirm password did not match, Please try again"
            );
          }
        } else {
          return commonResponse.customResponse(
            res,
            "INVALID_OLD_PASSWORD",
            400,
            {},
            "Invalid old password"
          );
        }
      } else {
        return commonResponse.customResponse(
          res,
          "USER_NOT_FOUND",
          400,
          {},
          "User not found"
        );
      }
    } catch (error) {
      console.log("User Change Password -> ", error);
      return next(error);
    }
  },

  /*
   *  Get Profile
   */
  get: async (req, res, next) => {
    try {
      let User = await UsersService.get(req.user.id);
      commonResponse.success(res, "GET_PROFILE", 200, User, "Success");
    } catch (error) {
      return next(error);
    }
  },

  /*
   *  logout
   */
  logout: async (req, res, next) => {
    try {
      let updateData = {
        fcm_token: "",
        device_id: "",
      };
      let update = await UsersService.update(req.user.id, updateData);
      if (update) {
        return commonResponse.success(
          res,
          "USER_LOGOUT",
          200,
          update,
          "Successfully logout"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          {},
          "Something went wrong please try again"
        );
      }
    } catch (error) {
      return next(error);
    }
  },
};
