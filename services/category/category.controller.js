const Service = require("./category.services");
const { commonResponse } = require("../../helper");

module.exports = {
  create: async (req, res, next) => {
    try {
      let data = await Service.create(req.body);
      if (data) {
        return commonResponse.success(
          res,
          "CATEGORY_CREATE",
          200,
          data,
          "Success"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          {},
          "Something went wrong, Please try again"
        );
      }
    } catch (error) {
      console.log("Create Category -> ", error);
      return next(error);
    }
  },

  list: async (req, res, next) => {
    try {
      let list = await Service.list();
      if (list.length > 0) {
        return commonResponse.success(
          res,
          "CATEGORY_LIST",
          200,
          list,
          "Success"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          {},
          "Something went wrong, Please try again"
        );
      }
    } catch (error) {
      console.log("List Category -> ", error);
      return next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      let data = await Service.getById(req.params.id);
      if (data) {
        return commonResponse.success(
          res,
          "CATEGORY_DETAILS",
          200,
          data,
          "Success"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          {},
          "Something went wrong, Please try again"
        );
      }
    } catch (error) {
      console.log("Category  Details -> ", error);
      return next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      let update = await Service.update(req.params.id, req.body);
      if (update) {
        return commonResponse.success(
          res,
          "CATEGORY_UPDATE",
          200,
          update,
          "Success"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          {},
          "Something went wrong, Please try again"
        );
      }
    } catch (error) {
      console.log("Update Category  -> ", error);
      return next(error);
    }
  },

  Delete: async (req, res, next) => {
    try {
      let data = await Service.delete(req.params.id);
      if (data) {
        return commonResponse.success(
          res,
          "CATEGORY_DELETE",
          200,
          data,
          "Success"
        );
      } else {
        return commonResponse.customResponse(
          res,
          "SERVER_ERROR",
          400,
          {},
          "Something went wrong, Please try again"
        );
      }
    } catch (error) {
      console.log("Delete Category  -> ", error);
      return next(error);
    }
  },
};
