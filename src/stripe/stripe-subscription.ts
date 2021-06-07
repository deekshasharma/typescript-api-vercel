const { getClient } = require("./utils");
//TODO: Currently priceIds for Particle plan are hard coded, it should be passed in priceIDsForPlan variable.
//TODO: Do not charge the customer immediately. Prorate the charges from 1st to 1st of every month.

export const createSubscription = async (paymentMethodId, customerId, priceIDs) => {
    // Set the default payment method on the customer
    try {
        await getClient().paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
    } catch (error) {
        return error;
    }

    // Update the default customer payment method
    let updateCustomerDefaultPaymentMethod = await getClient().customers.update(customerId,{invoice_settings: {default_payment_method: paymentMethodId}});

    // Create the subscription
        return await getClient().subscriptions.create({
        customer: customerId,
        items: [{ price: process.env.PARTICLE_ORDERS_PRICE_ID },{ price: process.env.PARTICLE_ITEMS_PRICE_ID }, { price: process.env.PARTICLE_BANDWIDTH_PRICE_ID }, { price: process.env.PARTICLE_API_CALLS_PRICE_ID }],
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
    });
}


export const createPaymentMethod = async ({ card, isPaymentRetry, invoiceId, billingName,customerId, priceId }) => {
    // Set up payment method for recurring usage
    getClient()
        .createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                name: billingName,
            },
        })
        .then((result) => {
            if (result.error) {
                console.log(result.error);
            } else {
                if (isPaymentRetry) {
                    // Update the payment method and retry invoice payment
                    retryInvoiceWithNewPaymentMethod(
                        customerId,
                        result.paymentMethod.id,
                        invoiceId,
                        priceId
                    );
                } else {
                    // Create the subscription
                    createSubscription(customerId, result.paymentMethod.id, priceId);
                }
            }
        });
}

//TODO: If payment requires user to be in the session to complete payment, that should be handled here.
//TODO: Take action if subscription is complete.
export const retryInvoiceWithNewPaymentMethod = async (customerId,paymentMethodId, invoiceId,priceId ) => {
    // Set the default payment method on the customer
    try {
        await getClient().paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
        await getClient().customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
    } catch (error) { // in case card_decline error
        return error;
    }
    return await getClient().invoices.retrieve(invoiceId, {
        expand: ['payment_intent'],
    });
}

