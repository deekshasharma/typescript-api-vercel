const { getClient } = require("./utils");

//TODO: Confirm if the charges should be prorated from 1st to 1st of every month.
export const createSubscription = async (customerId, paymentMethodId, priceIDs) => {
    if(paymentMethodId) {
        // Set the default payment method on the customer
        try {
            await getClient().paymentMethods.attach(paymentMethodId, {
                customer: customerId,
            });
        } catch (error) {
            return error;
        }
        // Update the default customer payment method
        await getClient().customers.update(customerId,{invoice_settings: {default_payment_method: paymentMethodId}});
    }
    // Create the subscription
    return await getClient().subscriptions.create({
        customer: customerId,
        items: [{ price: process.env[priceIDs[0]] },{ price: process.env[priceIDs[1]] }, { price: process.env[priceIDs[2]] }, { price: process.env[priceIDs[3]] }],
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
    });
}


//TODO: If payment requires user to be in the session to complete payment, that should be handled here.
//TODO: Take action if subscription is complete.
// export const retryInvoiceWithNewPaymentMethod = async (customerId,paymentMethodId, invoiceId, priceIDs ) => {
//     // Set the default payment method on the customer
//     try {
//         await getClient().paymentMethods.attach(paymentMethodId, {
//             customer: customerId,
//         });
//         await getClient().customers.update(customerId, {
//             invoice_settings: {
//                 default_payment_method: paymentMethodId,
//             },
//         });
//     } catch (error) { // in case card_decline error
//         return error;
//     }
//     return await getClient().invoices.retrieve(invoiceId, {
//         expand: ['payment_intent'],
//     });
// }

