# Integration - Quick Start

Follow along the guide and build your own server or you can directly deploy the following provider example to Vercel with a single click [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/reclaimprotocol/one-step-deploy-provider) or just start tinkering with code sandbox environment right in on Replit <a href="https://replit.com/@AkshayNarisett1/Reclaim-SDK">
    <img src="https://reclaimprotocol.s3.ap-south-1.amazonaws.com/Tinker-modified.png" alt="Tinker Inside Sandbox" width="90px" height="30px"/>
</a>.

## Integrating Reclaim Protocol via HTTPS Provider

The HTTPS provider is the simplest way to integrate Reclaim Protocol into your project. It allows you to specify the URL of the website you're interacting with, the regex to match on the website, and the cookies that need to be checked. Below, we illustrate the process using Express.js.

### Initiating a Project

To start a new project in Express.js, navigate to the desired directory and run the following commands:

```bash
express my-project
cd my-project
npm install
```

### Installing Reclaim SDK

Next, install the Reclaim SDK in your project using the following command:

```bash
npm i @reclaimprotocol/reclaim-sdk
```

### Creating an Endpoint to Request Proofs

The following example shows how to create an endpoint for requesting proofs of a user's Reddit karma. In this example, the developer sets the `title`, `baseCallbackUrl`, and `requestedProofs` parameters for the Reclaim request. The `requestedProofs` parameter includes an `HttpsProvider` instance with information for accessing the desired website and extracting the required data.

Here are some important things to note:

* `baseCallbackUrl`:  Reclaim SDK will append a unique identifier (UUID) to this base URL, creating a unique callback URL for each proof request. The proofs will be uploaded to this callback URL by the Reclaim Wallet App.
* `title`, `name`, and `logoUrl`: These parameters will be displayed to the user in the Reclaim app. The `title` is used as the title of the proof request, the `name` is used as the name of the provider (e.g., the name of the website the user is logging into), and the `logoUrl` is the URL of the logo to display. These details can be used to provide the user with context about what proofs they're creating and why.

\


```javascript
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

app.get("/request-proofs", (req, res) => {
    const request = reclaim.requestProofs({
        title: "Reclaim Protocol",
        baseCallbackUrl: "https://yourdomain.com/callback",
        contextMessage: "Airdrop for Reclaim claimants", //optional: context message for the proof request
        contextAddress: "0x5d96Cb97F8499d4dEa814cEa2F8448A0AF1A2bC2" //optional: your users' Ethereum wallet 
        requestedProofs: [
            new reclaim.HttpsProvider({
                name: "Reddit Karma",
                logoUrl: "https://i.redd.it/snoovatar/avatars/97178518-5ce1-400b-8185-54dcaef96d9c.png",
                url: "https://www.reddit.com",
                loginUrl: "https://reddit.com/login",
                loginCookies: ['session', 'reddit_session', 'loid', 'token_v2', 'edgebucket'],
                selectionRegex: '<span class=\"_2BMnTatQ5gjKGK5OWROgaG\">{{username}}</span>.*?<span>{{karma}} karma</span>',
            }),
        ],
    });

    const { callbackId, expectedProofsInCallback } = request;
    const reclaimUrl = await request.getReclaimUrl();
    // Save the callbackId, reclaimUrl, and expectedProofsInCallback for future use
    // ...
    res.json({ reclaimUrl });
})
```

### Extracting Login Cookies

When configuring the HTTPS provider, one of the required parameters is `loginCookies`. This array should contain the names of all the cookies required to establish a logged-in session on the website. Extracting these cookies involves a bit of reverse engineering, and it can be accomplished by using the developer tools in Google Chrome.

Follow the steps below:

1. Open the Google Chrome browser and navigate to the website from which you need to extract the cookies.
2. Open the developer tools by pressing `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac), and click on the `Application` tab.
3. Under the `Storage` section on the left, click on `Cookies`, then select the website. You should see a list of cookies for the website.
4. Alternatively, you can find the required cookies from the `Network` tab. Refresh the page with the network tab open, and click on the name of any request. Under the `Headers` tab, scroll down to the `Request Headers` section to see the cookies sent with the request.

A more accurate method to identify which cookies are required is as follows:

1. With the developer tools open and the `Network` tab selected, log into the website.
2. In the `Network` tab, use the "Search" feature to search for a unique string like the username or ID. This will help you find the network request that contained this information.
3. Right-click on the network request and select "Copy as cURL".
4. Paste the cURL command into your terminal.
5. Start removing cookies one by one from the cURL command. If the command still responds with the expected response, continue removing cookies. If the command responds with an access denied error, the cookie you removed is necessary for authentication. Add this cookie to the `loginCookies` array, and continue removing the other cookies one by one.

By following these steps, you can figure out which cookies are required for the `loginCookies` parameter when creating an `HttpsProvider` instance.



### Setting Up a Callback to Verify Proofs

To verify the proofs returned by the Reclaim Protocol, you'll need to set up a callback endpoint in your application. This callback verifies the correctness of the proofs and processes them accordingly.

```javascript
app.post("/callback/", async (req, res) => {
    const { id } = req.query;
    const { proofs } = req.body;

    const onChainClaimIds = reclaim.getOnChainClaimIdsFromProofs(proofs)

    // check if onChainClaimIds have been submitted in the database before
    const results = db.find({{ valueField: { $in: valuesArray } }; // Replace 'valueField' with the field name in your database

    if(results){
        res.status(400).json({ error: "Proofs already submitted" });
    } else {
        const isProofsCorrect = await reclaim.verifyCorrectnessOfProofs(proofs);

        if (isProofsCorrect) {
            console.log("Proofs submitted:", proofs);
            // store proofs in your backend for future use
            res.json({ success: true });
        } else {
            console.error("Proofs verification failed");
            res.status(400).json({ error: "Proofs verification failed" });
        }
    }
});
```

In this code snippet, the callback first generates a unique proof ID and checks if proofs have been submitted for this ID. If they have, it responds with an error.
