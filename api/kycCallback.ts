import {VercelRequest, VercelResponse} from "@vercel/node";
import {PassbaseClient, PassbaseConfiguration, ResponseFormats} from "@passbase/node";
import {ManagementClient} from "auth0";
import {Identity} from "@passbase/node/lib/models/Identity";

import Sentry from "@sentry/node";

let auth0APIKey;
let auth0APIDomain;
let passbaseAPIKey;

if (process.env.VERCEL_ENV === 'production') {
    auth0APIKey = "";
    auth0APIDomain = "";
    passbaseAPIKey = "";

} else {
    auth0APIKey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNGa05DODVzeEd2TFl6c3BsNTlyMyJ9.eyJpc3MiOiJodHRwczovL2Rldi1wdnpmczVpbC51cy5hdXRoMC5jb20vIiwic3ViIjoiVnBnMjN4Q21YdGQ0TXVzYjFmMEw0MDlpUDY3TTZ3V25AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LXB2emZzNWlsLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjMzNTg4NDQ1LCJleHAiOjE2MzM2NzQ4NDUsImF6cCI6IlZwZzIzeENtWHRkNE11c2IxZjBMNDA5aVA2N002d1duIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.m3KBSvEOI1wGvtSv0tEOBwziBdPHrANYAf7CeMRNyjN35c-mzILT5MSrwfpy1NcW1yM2xx9qnBluLljQaVQLaa-5fBN_0rehblU2TC_ASrV-JZbexL8ibq1kyS2GKirUjZW-HgjQQqXBFveGlLhEvGuBbtWSB2qKMGBl2KDQpR3-Vd9_AAQ0MpvSfTGVQ8OjK0qVYRkf1Y6e1Q9yQXYG7oE02UOtBMTm1_JnOfo9ZZolXbPWa7yOedRwrFQo7lgBwR71okqWRrZ-IMFksMp48I5dqSGn0IKiIzcIydlIHlfOC1yJ5jIQ8hGRAaT0i3NOeEzxcxEEyab3Vp5oJcP0pQ";
    auth0APIDomain = "dev-pvzfs5il.us.auth0.com";
    passbaseAPIKey = "MPF0oblOisRDtFULhx0OfhctQWn2PjffUnCXxm8u8fwAAVdFSs1KzlPm2jMxWpceDJDcS2BlJLSR4LwrMyD3CyWqyaJ1lY4ReMuWJwO90nomOB8fXUzRy2JX0Krr3Jn3";
}


const management = new ManagementClient({
    token: auth0APIKey,
    domain: auth0APIDomain
});

Sentry.init({
    dsn: "https://fe4eb508dd564b6cabf1e579f223f0b6@o1007873.ingest.sentry.io/5998082",
    tracesSampleRate: 1.0,
});

const getUserByEmail = async (email: string) => management.users.getByEmail(email);

const updateUserMetadata = (params, metadata) => new Promise<void>((resolve, reject) =>
    management.users.updateUserMetadata(params, metadata, (err) => {
        if (err) reject(err);
        else resolve();
    }))

const getKYC = async (id: string) => new PassbaseClient(new PassbaseConfiguration({
    apiKey: passbaseAPIKey,
    format: ResponseFormats.Json,
})).getIdentityById(id);


const getMetadata = (kyc: Identity) => ({
    kyc: {
        email: kyc.owner.email,
        firstName: kyc.owner.firstName,
        lastName: kyc.owner.lastName,
        status: kyc.status,
        id: kyc.id,
    }
});

export default async (request: VercelRequest, response: VercelResponse) => {
    const transaction = Sentry.startTransaction({
        op: "kycMetadataUpdate",
        name: "KYC Auth0 Metadata update",
    });
    try {
        const kyc = await getKYC(request.body.key);

        const auth0User: { user_id: string }[] = await getUserByEmail(kyc.owner.email);

        await Promise.all(auth0User.filter(a => a.user_id.startsWith('email'))
            .map(user => user.user_id).map(id =>
                updateUserMetadata({id}, getMetadata(kyc))));

        response.status(200).send(`ok`);
    } catch (e) {
        console.error(e);
        response.status(500).send(e);
    } finally {
        transaction.finish();
    }
};


