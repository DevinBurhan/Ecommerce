const { commonResponse } = require("../../helper");
const Service = require('./stripe.services');



module.exports = {


    /* 
     * Create Stripe
    */
    createStripe: async(req,res,next) => {
        try {
            let data = await Service.create(req.body);
            if(data){
                return commonResponse.success(res, "CREATE_STRIPE_CUSTOMER", 200, data, 'Success');
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, 'Something went wrong, Please try again');
            }
        } catch (error) {
            console.log("Create Stripe --> : ", error);
            return new Error(error);
        }
    },


    /* 
     * ephemeralKeys Stripe
    */
    Ephemeral: async(req,res,next) => {
        try {
            let data = await Service.Ephemeral(req.body);
            console.log('data is --->>> ' , data);
            if(data){
                return commonResponse.success(res, "CREATE_EPHEMERAL", 200, data, 'Success');
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, 'Something went wrong, Please try again');
            }
        } catch (error) {
            console.log("Create Ephemeral --> : ", error);
            return new Error(error);
        }
    },


    /* 
     * Payment Intents Stripe
    */
    PaymentIntents: async(req,res,next) => {
        try {
            let data = await Service.Paymentintents(req.body);
            if(data){
                return commonResponse.success(res, "CREATE_PAYMENT_INTERN", 200, data, 'Success');
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, 'Something went wrong, Please try again');
            }
        } catch (error) {
            console.log("PaymentIntents --> : ", error);
            return new Error(error);
        }
    },

    /* 
     * confirmPayment Payment Stripe
    */

    confirmPaymentIntents: async(req,res,next) => {
        try {
            let data = await Service.confirmPayment(req.body);
            if(data){
                return commonResponse.success(res, "CONFIRM_PAYMENT_INTERN", 200, data, 'Success');
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, 'Something went wrong, Please try again');
            }
        } catch (error) {
            console.log("PaymentIntents --> : ", error);
            return new Error(error);
        }
    },


    /* 
     * capturePayment Payment Stripe
    */
    CapturePayment: async(req,res,next) => {
        try {
            let data = await Service.capturePayment(req.body);
            if(data){
                return commonResponse.success(res, "CAPTURE_PAYMENT", 200, data, 'Success');
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, 'Something went wrong, Please try again');
            }
        } catch (error) {
            console.log("CapturePayment --> : ", error);
            return new Error(error);
        }
    },

}