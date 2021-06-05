const { getClient } = require("./utils");
import Stripe from 'stripe';
if (!process.env.STRIPE_SECRET_KEY
) {
    console.log('The .env file is not configured.');
    console.log('');
    process.env.STRIPE_SECRET_KEY? '': console.log('Add STRIPE_SECRET_KEY to your .env file.');
    process.exit();
}

interface ResponseType {
    response: Record<string, string>
}

type CustomerSuccess = Stripe.Customer;
type StripeError = Stripe.StripeError;
type Response = CustomerSuccess | StripeError;

export const createCustomer = async (customer): Promise<Response> => {
    // save the customer.id as stripeCustomerId in the backend.
    try{
        return await getClient().customers.create({
            email: customer.email,
            name: customer.name,
            address: customer.address,
            metadata: customer.metadata
        });
    }catch(error){
        return error;
    }
}


// export const createSubscription = async (paymentMethodId, customerId, priceIDsForPlan): Response => {
//     try {
//         await getClient().paymentMethods.attach(paymentMethodId, {
//             customer: customerId,
//         });
//     } catch (error) {
//         // return res.status('402').send({ error: { message: error.message } });
//     }
// }


// app.post('/create-subscription', async (req, res) => {
//     // Set the default payment method on the customer
//     try {
//         await stripe.paymentMethods.attach(req.body.paymentMethodId, {
//             customer: req.body.customerId,
//         });
//     } catch (error) {
//         return res.status('402').send({ error: { message: error.message } });
//     }
//
//     let updateCustomerDefaultPaymentMethod = await stripe.customers.update(
//         req.body.customerId,
//         {
//             invoice_settings: {
//                 default_payment_method: req.body.paymentMethodId,
//             },
//         }
//     );
//
//     // Create the subscription
//     const subscription = await stripe.subscriptions.create({
//         customer: req.body.customerId,
//         items: [{ price: process.env[req.body.priceId] }],
//         expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
//     });
//
//     res.send(subscription);
// });
