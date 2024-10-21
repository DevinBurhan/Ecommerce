const router = require("express").Router();
const Controller = require('./stripe.controller');


/*
 *  Add Question Ans
 */
router.post(
    "/createcustomer",
    Controller.createStripe
);

/*
 *  Ephemeral
 */
router.post(
    "/Ephemeral",
    Controller.Ephemeral
);


/*
 *  PaymentIntents
 */
router.post(
    "/Payment",
    Controller.PaymentIntents
);


/*
 *  confirmPayment
 */
router.post(
    "/confirmPayment",
    Controller.confirmPaymentIntents
);


/*
 *  CapturePayment
 */
router.post(
    "/CapturePayment",
    Controller.CapturePayment
);


module.exports = router;