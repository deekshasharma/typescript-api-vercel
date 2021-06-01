import fetch from "node-fetch";

type BodyType = {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    orders: string;
    items: string;
    apiCalls: string;
    bandwidth: string;
    additionalInfo: string;
}

export const postToSlack = async (props: BodyType) => {
    return await fetch(process.env.SLACK_INCOMING_WEBHOOK_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(constructSlackPayload({...props}))
    })
}


//TODO: Add tenantId also
const constructSlackPayload = ({firstName, lastName, company, email, orders, items, apiCalls, bandwidth, additionalInfo}: BodyType) => {
   return {
       text: `${firstName} ${lastName} sent an enquiry for upgrading the current plan to Crystal`,
       "blocks": [
           {
               "type": "section",
               "text": {
                   "type": "mrkdwn",
                   "text": `:star: ${firstName} ${lastName} sent an enquiry for upgrading the current plan to Crystal. You may want to contact this customer.`
               }
           },
           {
               "type": "section",
               "block_id": "section789",
               "fields": [
                   {
                       "type": "mrkdwn",
                       "text": `*Company*\n${company}`
                   },
                   {
                       "type": "mrkdwn",
                       "text": `*Email*\n${email}`
                   },
                   {
                       "type": "mrkdwn",
                       "text": `*Orders*\n${orders}`
                   },
                   {
                       "type": "mrkdwn",
                       "text": `*Catalogue Items*\n${items}`
                   },
                   {
                       "type": "mrkdwn",
                       "text": `*API Calls*\n${apiCalls}`
                   },
                   {
                       "type": "mrkdwn",
                       "text": `*Bandwidth*\n${bandwidth}`
                   }
               ]
           },
           {
               "type": "section",
               "block_id": "section567",
               "text": {
                   "type": "mrkdwn",
                   "text": `*Additional information requested* \n${additionalInfo}`
               }
           }
       ]
   }

}
