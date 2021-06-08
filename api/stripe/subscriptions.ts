import { VercelRequest, VercelResponse } from "@vercel/node";
import {createSubscription} from "../../src/stripe/stripe-subscription";
import {allowCors} from '../allowCors';


const create = async (req: VercelRequest, res: VercelResponse) => {
    const customerId = req.body.customerId;
    const paymentMethodId = req.body.paymentMethodId;
    const planName = req.body.planName;
    if(!customerId) return res.status(400).send({message: 'Missing required input:  customerId '})
    if(!planName) return res.status(400).send({message: 'Missing required input:  planName '})
    createSubscription(customerId, paymentMethodId, planName ).then((response) => {
        res.send({subscription: response})
    })
}


module.exports = allowCors(create);
