const { commonResponse } = require('../../helper');
const UsersModel = require('../users/users.model');
const PropertyModel = require('../property/property.model');



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
*  Get Tenant
*/
exports.getTenant = async (reqBody,query) => {
    try {
        let user = await UsersModel.find({ role: reqBody.role }).lean();
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
*  Get Landlord By Role
*/
exports.getLandlord = async (reqBody) => {
    try {
        let user = await UsersModel.find({ role: reqBody.role}).sort({created_at : -1 }).lean();
        if (!user) {
            throw new Error(commonResponse.getErrorMessage("USER_ROLE_NOT_FOUND"));
        }
        return user;
    } catch (error) {
        console.log("Error : ", error);
        return new Error(error);
    }
};

/*
*  Get Property By Role
*/
exports.getPropertyByLandlord = async (user_id) => {
    try {
        return await PropertyModel.find({user_id:user_id}).lean();
    } catch (error) {
        console.log("Error : ", error);
        return new Error(error);
    }
};


/*
*  Get Property By Role
*/
exports.getProperty = async (reqBody) => {
    try {
        let user = await PropertyModel.find({ Address : reqBody.Address }).lean();
        if (!user) {
            throw new Error(commonResponse.getErrorMessage("PROPERTY_ROLE_NOT_FOUND"));
        }
        return user;
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
        let updateUserData = await UsersModel.findOneAndUpdate({ _id: id }, {$set:reqBody}, {new: true,}).lean();
        return updateUserData;
    } catch (error) {
        console.log("Error : ", error);
        return new Error(error);
    }
};
