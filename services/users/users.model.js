const mongoose = require("mongoose");
let softDelete = require("mongoosejs-soft-delete");
const { USERSTATUS, USERROLES } = require("../../helper/constant");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: false,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    role: {
      type: String,
      enum: [USERROLES.ADMIN, USERROLES.USER],
      default: USERROLES.USER,
      required: false,
    },
    otp: {
      type: Number,
      required: false,
      default: 0,
    },
    fcm_token: {
      type: String,
      required: false,
      default: "",
    },
    device_type: {
      type: String,
      enum: ["android", "ios"],
      default: "android",
      required: false,
    },
    device_id: {
      type: String,
      required: false,
      default: "",
    },
    is_notification_on: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: [USERSTATUS.DEACTIVATED, USERSTATUS.PENDING, USERSTATUS.VERIFIED],
      default: USERSTATUS.PENDING,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

usersSchema.plugin(softDelete);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
