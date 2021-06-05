import { VercelRequest, VercelResponse } from "@vercel/node";
import {createCustomer} from "../../src/stripe/create-stripe-customer";

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if(req.method === 'POST') {
        createCustomer(req.body.customer).then((response) => {
            res.send({customer: response})
        })
    }
}