const Joi = require('joi');

module.exports = {

    usersValidation : async(req,res,next) => {
        try {
            let UserSchema = Joi.object().keys({ 
              first_name:Joi.string().required().min(2).max(10),
              last_name:Joi.string().required().min(2).max(10),
              email:Joi.string().lowercase().required().email(),
              password:Joi.string().required(),
              long:Joi.number().required(),
              lat:Joi.number().required()
            }); 
            let result = UserSchema.validate(req.body); 
            // let { value, error } = result; 
            // let valid = error == null;
            if(result.error) {
                const resData = {
                    error: true,
                    statusCode: 500,
                    message: result.error.details[0]['message'],
                    data: {},
                    messageCode: 'DATABASE_ERROR',
                  }; 
              return res.status(500).json(resData) 
            }else{ 
                console.log("hello")
              next();
            }  
        } catch (error) {
            console.log("User Validation -->> ", error);
            return (error);
        }
    },




}
    


