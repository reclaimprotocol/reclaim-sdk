# Using the HTTPS Provider

This guide assumes you will have a backend server running for your website/app. If that's not the case please visit [serverless-embed.md](serverless-embed.md "mention")

## Install the SDK

Install the Reclaim SDK from [node package](https://www.npmjs.com/package/@reclaimprotocol/reclaim-sdk)

```
npm install @reclaimprotocol/reclaim-sdk
```

## Request proofs

You can generate the `reclaimUrl` using `HttpsProvider` by:

```
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

app.get("/request-proofs", (req, res) => {
    try {
        const request = reclaim.requestProofs({
            title: "Reclaim Protocol",
            baseCallbackUrl: "https://reclaim.app/callback",
            requestedProofs: [
                new reclaim.HttpsProvider({
                    name: "Acme Corp Emp Id",
                    logoUrl: "https://acmecorp.com/logo.png",
                    url: "https://acmecorp.com/myprofile",
                    loginUrl: "https://acmecorp.com/login",
                    loginCookies: ['authToken', 'ssid'],
                    selectionRegex: "<span id='empid'>{{empid}}</span>",
                }),
            ],
        });
        // Store the callback Id, Reclaim URL and expectedProofsInCallback in your database
        const { callbackId, reclaimUrl, expectedProofsInCallback } = request;
        // ... store the callbackId, reclaimUrl and expectedProofsInCallback in your database
        res.json({ reclaimUrl });
    }
    catch (error) {
        console.error("Error requesting proofs:", error);
        res.status(500).json({ error: "Failed to request proofs" });
    }
})
```
In the above code snippet, the HttpsProvider accepts object of `type HttpsProviderParams` defined [here](../../src/types/index.ts#L24). Here's a description of each property:

- `name`: The name of your application.
- `logoUrl`: The URL of your application's logo. This will be displayed in the Reclaim app.
- `url`: The URL from where the information is to be extracted. This is typically the webpage where the user's data is located.
- `loginUrl`: The URL where the user can log in to access the information. If authentication is required to access the data, the user will be redirected to this URL for login.
- `loginCookies`: An array of cookie names required for authentication. If the webpage uses cookies for authentication, you can specify the names of those cookies here. These cookies will be passed along with the request to the url.
- `selectionRegex`: A regular expression to extract specific information from the webpage. If you only need to extract a specific piece of information from the webpage, you can specify a regex pattern here. The SDK will search for this pattern in the HTML of the webpage and extract the matching content.

The tricky part is to find the `loginCookies` that need to be set. 

### How to find `loginCookies`?
A good way to figure this out is to look at the Application Tab in the Chrome debugger and look for cookies. 

You can also look at the Network calls tab to identify which cookies are really being used. 

This requires a little bit of reverse engineering or trial and error.

Trick : 
- Open the network tab on chrome
- Open the URL
- Login
- In the network tab "Search" for some string like the empid or username
- This will give you the network request that contained that information
- Right click on the network request and copy as curl
- Paste the curl command in your terminal
    1. Remove cookies one by one and run the curl
    2.  If the curl still responds with the correct expected response, repeat 1
    3. If the curl responds with an access denied error, you should keep this cookie in the checkLoginCookies array and continue removing other cookies one by one.

The submission of proofs is handled by the callback endpoint as shown below. The function `reclaimprotocol.utils.extractParameterValues(expectedProofsInCallback, proofs)` is used to extract the information proved by your user 
```
    app.post("/callback/:callbackId", async (req, res) => {
      try {
        // Retrieve the callback ID from the URL parameters
        const { callbackId } = req.params;

        // Retrieve the proofs from the request body
        const { proofs } = req.body;

        // Verify the correctness of the proofs (optional but recommended)
        const isProofsCorrect = await reclaim.verifyCorrectnessOfProofs(proofs);

        if (isProofsCorrect) {
          // Proofs are correct, handle them as needed
          // ... process the proofs and update your application's data
          console.log("Proofs submitted:", proofs);

          // Retrieve the expected proofs corresponding to the callbackId from your database
          // const expectedProofsInCallback = db.get(expectedProofsInCallback, callbackId) 
          // Please change the above line based on your database implementation
          const parsedParams = reclaimprotocol.utils.extractParameterValuesFromRegex(expectedProofsInCallback, proofs)
        
          // use the parsedParams as needed in your application

          // Respond with a success message
          res.status(200).json({ parsedParams });
        } else {
          // Proofs are not correct or verification failed
          // ... handle the error accordingly
          console.error("Proofs verification failed");

          // Respond with an error message
          res.status(400).json({ error: "Proofs verification failed" });
        }
      } catch (error) {
        console.error("Error processing callback:", error);
        res.status(500).json({ error: "Failed to process callback" });
      }
    });
```

### Selection regex

The `selectionRegex` matches the regular expression on the html response received from the website.&#x20;

The `selectionRegex` field also allows you to define parameters using \{{VAR\_NAME\}} syntax.&#x20;

If your `selectionRegex` string has a \{{VAR\_NAME\}} set, it will be matched using (.\*?) and stored in the variable VAR\_NAME.

The value of the VAR\_NAME will be available to you in the callback url payload.

## Check the proof and extract the parameters proved

{% code overflow="wrap" %}
```
// verify if the proof submitted is legitimate
if(await reclaim.verifyCorrectnessOfProofs(proofs)) {
  // extract the user information that was extracted using the https provider
  const parsedParams = reclaimprotocol.utils.extractParameterValuesFromRegex(expectedProofsInCallback, proofs)
  
  // process the parsed parameters as needed in your application
}
```
{% endcode %}

