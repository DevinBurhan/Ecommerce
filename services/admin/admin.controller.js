const passport = require("passport");
const adminService = require("./admin.services");
const guard = require("../../helper/guards");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

module.exports = {
  /*
   *  Login Admin
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
            "ADMIN_NOT_VERIFIED",
            400,
            user,
            "Please verify your email to login"
          );
        }
        if (user.status == "deactivated") {
          return commonResponse.customResponse(
            res,
            "ADMIN_DEACTIVATED",
            400,
            user,
            "Your account has been deactivated, Please contact admin to activate your account"
          );
        }
        let userResponse = await adminService.get(user.id);
        const token = await guard.createToken(user, userResponse.role);
        userResponse.token = token.token;
        return commonResponse.success(res, "LOGIN_SUCCESS", 200, userResponse);
      } else {
        return commonResponse.customResponse(
          res,
          "ADMIN_NOT_FOUND",
          400,
          {},
          "Admin not found"
        );
      }
    })(req, res, next);
  },

  /*
   *  logout Admin
   */
  logout: async (req, res, next) => {
    try {
      let updateData = {
        fcm_token: "",
        device_id: "",
      };
      let update = await adminService.update(req.user.id, updateData);
      if (update) {
        return commonResponse.success(
          res,
          "ADMIN_LOGOUT",
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

  /*
   *  Get Tenant Profile
   */
  getTenant: async (req, res, next) => {
    try {
      let User = await adminService.getTenant(req.body);
      commonResponse.success(res, "GET_TENANT_DATA", 200, User, "Success");
    } catch (error) {
      return next(error);
    }
  },

  /*
   *  Get Landlord Profile
   */
  getLandlord: async (req, res, next) => {
    try {
      let User = await adminService.getLandlord(req.body);
      commonResponse.success(res, "GET_LANDLORD_DATA", 200, User, "Success");
    } catch (error) {
      return next(error);
    }
  },

  /*
   *  Get property by landlord id Profile
   */
  getPropertyByLandlordId: async (req, res, next) => {
    try {
      let data = await adminService.getPropertyByLandlord(req.params.id);
      commonResponse.success(
        res,
        "GET_LANDLORD_DATA_BY_ID",
        200,
        data,
        "Success"
      );
    } catch (error) {
      return next(error);
    }
  },

  /*
   *  Get property Profile
   */
  getProperty: async (req, res, next) => {
    try {
      let User = await adminService.getProperty(req.body);
      commonResponse.success(res, "GET_PROPERTY_DATA", 200, User, "Success");
    } catch (error) {
      return next(error);
    }
  },

  /*
   *  Get  Profile
   */
  get: async (req, res, next) => {
    try {
      let User = await adminService.get(req.user.id);
      commonResponse.success(res, "GET_ADMIN_DATA", 200, User, "Success");
    } catch (error) {
      return next(error);
    }
  },
};
