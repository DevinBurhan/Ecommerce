const { commonResponse } = require("../../helper");
const Model = require('./category.model');


/*
* Create  
*/

exports.create = async(reqBody) =>{
    try {
        return await Model(reqBody).save();
    } catch (error) {
        console.log("Error : ", error);
        return new Error(error);
    }
},


exports.list = async(query) => {
    try {
        return await Model.find().sort( { created_at: -1 } ).lean();
    } catch (error) {
        
    }
},

/*Get By Id 
* 
*/

exports.getById = async (id) => {
    try {
        return await Model.findById(id).populate({
            path:'organizer  players',
            select:'name email'}).select("-created_at -updated_at -__v"); 
    } catch (error) {
        return error;
    }
};


/* 
* Update By Id
*/

exports.update = async (id, reqBody) => {
    try {
        let update = await Model.findByIdAndUpdate({ _id: id }, {$set:reqBody}, {new: true}).lean();
        return update;
    } catch (error) {
        console.log("Error : ", error);
        return new Error(error);
    }
};


/*
*  Delete Game
*/

exports.delete = async (id) => {
    try {
        return await Model.findByIdAndDelete({_id:id}); 
    } catch (error) {
        return error;
    }
};
