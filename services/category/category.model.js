const mongoose = require("mongoose");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamp: { createdAt: "created_at", updatedAt: "updated_at" } }
);

categorySchema.plugin(softDelete);

const category = mongoose.model("category", categorySchema);

module.exports = category;
