const {commonResponse} = require('../helper');
const Service = require('../services/application/application.services');






module.exports = {

    verifyApplicationKey : async(req,res,next) => {
        try{
            if(req.headers.app_key){
                if(req.headers.app_key != ''){
                    let data = await Service.key(req.headers.app_key)
                    if(data){
                        return next();
                    }else{
                        return commonResponse.customResponse(res, "MISSING_ERROR", 401 , {}, 'app_key is missing, Please try again');
                    }
                }else{
                    return commonResponse.customResponse(res, "MISSING_ERROR", 401 , {}, 'app_key is missing, Please try again');
                }
            }else{
                return commonResponse.customResponse(res, "MISSING_ERROR", 401, {} , 'app_key is missing, Please try again');
            }
        }catch(error){
            console.log("Create App_key -> ", error);
            return error;
        }
    }      

}