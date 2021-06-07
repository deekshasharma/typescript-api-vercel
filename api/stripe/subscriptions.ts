import { VercelRequest, VercelResponse } from "@vercel/node";
import {createSubscription} from "../../src/stripe/stripe-subscription";
import {allowCors} from '../allowCors';


const create = async (req: VercelRequest, res: VercelResponse) => {
    const customerId = req.body.customerId;
    const paymentMethodId = req.body.paymentMethodId;
    const priceIDs = req.body.priceIDs;
    createSubscription(customerId, paymentMethodId, priceIDs ).then((response) => {
        res.send({subscription: response})
    })
}


module.exports = allowCors(create);
