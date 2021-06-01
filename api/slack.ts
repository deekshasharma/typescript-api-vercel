import { VercelRequest, VercelResponse } from "@vercel/node";
import { postToSlack } from "../src/triggerSlackMsg";

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

const handler = (req: VercelRequest, res: VercelResponse) => {
    postToSlack({...req.body})
        .then((response) => {
            if(response.status === 200) res.send({message: 'success'})
        })
}

module.exports = allowCors(handler)