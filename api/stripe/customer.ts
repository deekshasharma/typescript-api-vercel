import { VercelRequest, VercelResponse } from "@vercel/node";
import {createCustomer} from "../../src/stripe/create-stripe-customer";
import {allowCors} from '../allowCors';

const create =  async (req: VercelRequest, res: VercelResponse) => {
    createCustomer(req.body).then((response) => {
        res.send({customer: response})
    })
}
module.exports = allowCors(create);
