import { VercelRequest, VercelResponse } from "@vercel/node";
import {createInvoiceAndPay} from "../../src/stripe/create-invoice-and-pay";
import {allowCors} from '../allowCors';
const usage = {
    orders: {unit_amount: 50, quantity: 10},
    bandwidth: {unit_amount: 5, quantity: 100},
    items: {unit_amount: 30, quantity: 2},
    apiCalls: {unit_amount: 200, quantity: 5},
    plan: {unit_amount: 1, quantity: 0}
}

//TODO: Add error handling
//TODO: Update Product Subscription
const payInvoice =  async (req: VercelRequest, res: VercelResponse) => {
    const { customerId, defaultTaxRates } = req.body;
    createInvoiceAndPay(customerId, defaultTaxRates, usage).then((response) => {
        res.send({invoice: response})
    })
}

module.exports = allowCors(payInvoice);