import { VercelRequest, VercelResponse } from "@vercel/node";
import {createSetupIntent} from "../../src/stripe/create-setup-intent";
import {allowCors} from '../allowCors';

const create =  async (req: VercelRequest, res: VercelResponse) => {
    createSetupIntent(req.body).then((response) => {
        res.send({setupIntent: response})
    })
}

module.exports = allowCors(create);