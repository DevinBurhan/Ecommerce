const { commonResponse } = require("../../helper");
const UsersModel = require("./users.model");
const otpGenerator = require("otp-generator");

/*
 *  Check Email Exist
 */
exports.is_exist = async (reqBody) => {
  try {
    let user = await UsersModel.findOne({ email: reqBody.email }).lean();
    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    console.log("Error : ", error);
    return new Error(error);
  }
};

/*
 *  Get By Id
 */
exports.get = async (id) => {
  try {
    let user = await UsersModel.findOne({ _id: id }).lean();
    if (!user) {
      throw new Error(commonResponse.getErrorMessage("USER_NOT_FOUND"));
    }
    return user;
  } catch (error) {
    console.log("Error : ", error);
    return new Error(error);
  }
};

/*
 *  Add New User
 */
exports.save = async (reqbody) => {
  try {
    const newUser = new UsersModel(reqbody);
    return await newUser.save();
  } catch (error) {
    console.log("Error : ", error);
    return new Error(error);
  }
};

/*
 *  Update User
 */
exports.update = async (id, reqBody) => {
  try {
    let updateUserData = await UsersModel.findOneAndUpdate(
      { _id: id },
      { $set: reqBody },
      { new: true }
    ).lean();
    return updateUserData;
  } catch (error) {
    console.log("Error : ", error);
    return new Error(error);
  }
};

/*
 *  Otp Generator
 */

exports.otpGenerate = async () => {
  return await otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });
};
