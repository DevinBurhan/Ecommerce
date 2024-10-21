const stripe = require('stripe')('sk_test_51IxnIpSE5mCu5tLAkm3HgoEuDnAzf9F0vTJ3EBii85x9tQy3nJHINM7jW3ZVEyfEm6BCOcigaEbjvz7KOff7zSyh00WC0jrPRC');



/** 
 * Create Customer
*/

exports.create = async(reqBody) => {
    try {
        return await stripe.customers.create({
            email:reqBody.email ,
            name:reqBody.name,
            address:reqBody.address
        });
    } catch (error) {
        console.log("Error :" , error);
        return error;
    }

},

/**
 * Ephemeral
*/

exports.Ephemeral = async(reqBody) => {
    try {
        return await stripe.ephemeralKeys.create(
            {customer: reqBody.customer},
            {stripe_version: '2020-08-27'}
        );   
        
    } catch (error) {
        console.log("Error :" , error);
        return error;
    }
}

/** 
 * Create PaymentItents
*/
exports.Paymentintents = async(reqBody) => {
    try {
        return await stripe.paymentIntents.create({
            amount: reqBody.amount,
            currency: reqBody.currency,      
            payment_method_types:  ['card'],
            customer:reqBody.customer,
            description:'aaaa'
          });
    } catch (error) {
        console.log("Error :" , error);
        return error;
    }
}  

/** 
 * Confirm Payment Intents 
*/


exports.confirmPayment = async(reqBody) => {
    try {
        console.log("hellooooooooooo");
        let data  =  await stripe.paymentIntents.confirm(
            // 'pi_1IyaQ8SE5mCu5tLAkW4qAvat'
            reqBody.payment_intent
            ,{
            payment_method: 'pm_card_visa'

        });
        console.log("Data is ---->>>>>" , data);
        return data ; 
    } catch (error) {
        console.log("Error :" , error);
        return error;
    }
}



/** 
 * Capture Payment 
*/


exports.capturePayment = async(reqBody) => {
    try {
        return await stripe.paymentIntents.capture(
        reqBody.payment_intent
        );
    } catch (error) {
        console.log("Error :" , error);
        return error;
    }
}