import { VercelRequest, VercelResponse } from "@vercel/node";
import { postToSlack } from "../src/triggerSlackMsg";

export default async (req: VercelRequest, res: VercelResponse) => {
    postToSlack({...req.body})
        .then((response) => {
            if(response.status === 200) res.send({message: 'success'})
        })
};