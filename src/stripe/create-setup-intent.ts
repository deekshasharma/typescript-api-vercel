const { getClient } = require("./utils");

export const createSetupIntent = async ({...customer}): Promise<Response> => {
    const { email, name, address, metadata } = customer;
    const stripeCustomer = await getClient().customers.create({email, name, address, metadata});
    return await getClient().setupIntents.create({
        customer: stripeCustomer.id,
    });
}