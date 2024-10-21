const controller = require("./admin.controller");
const router = require("express").Router();
const { guard } = require("../../helper");
const multerSetting = require("../../helper/multer").userImageUpload;

/*
 *  Login Admin
 */
router.post("/login", controller.login);

/*
 *  Get Admin Profile
 */
router.get("/admin-profile", guard.isAuthorized(["admin"]), controller.get);

/*
 *  Get Admin By Role
 */
router.get(
  "/tenant-profile",
  guard.isAuthorized(["admin"]),
  controller.getTenant
);

/*
 *  Get Landlord By Role
 */
router.get(
  "/landlord-profile",
  guard.isAuthorized(["admin"]),
  controller.getLandlord
);

/*
 *  Get Property list
 */
router.get(
  "/property-profile",
  guard.isAuthorized(["admin"]),
  controller.getProperty
);

/*
 *  Get Property by Landlord Id
 */
router.get(
  "/property/landlord/:id",
  guard.isAuthorized(["admin"]),
  controller.getPropertyByLandlordId
);

/*
 *  logout Admin
 */
router.post("/logout", guard.isAuthorized(["admin"]), controller.logout);

module.exports = router;
