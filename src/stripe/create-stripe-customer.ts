const { getClient } = require("./utils");
import Stripe from 'stripe';
if (!process.env.STRIPE_SECRET_KEY
) {
    console.log('The .env file is not configured.');
    console.log('');
    process.env.STRIPE_SECRET_KEY? '': console.log('Add STRIPE_SECRET_KEY to your .env file.');
    process.exit();
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