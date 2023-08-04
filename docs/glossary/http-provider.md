# Http Provider

Use this provider, if the data resides as is in some HTML element. It allows you to specify the URL of the website you're interacting with, the regex to match on the website and the cookies that need to be checked.&#x20;

### Request proofs using HTTP provider

```javascript
// index.js

// ...
// ...

app.get("/request-proofs", async(req, res) => {
    const request = reclaim.requestProofs({
        title: "Reclaim Protocol",
        baseCallbackUrl: "https://yourdomain.com/callback",
        // callbackId: "<UNIQUE_IDENTIFIER_GOES_HERE>" // optional
        contextMessage: "Airdrop for Reclaim claimants", //optional: context message for the proof request
        contextAddress: "0x5d96Cb97F8499d4dEa814cEa2F8448A0AF1A2bC2" //optional: your users' Ethereum wallet 
        requestedProofs: [
            new reclaim.HttpsProvider({
                name: "Y Combinator Membership",
                logoUrl: "https://i.redd.it/snoovatar/avatars/97178518-5ce1-400b-8185-54dcaef96d9c.png",
                url: "https://bookface.ycombinator.com/home",
                loginUrl: "https://account.ycombinator.com/?continue=https%3A%2F%2Fbookface.ycombinator.com%2F",
                loginCookies: ['_sso.key'],
                responseSelections: [
                    {
                        "xPath": "//*[@id='js-react-on-rails-context']",
                        "jsonPath": "$.currentUser",
                        "responseMatch": "\\{\"id\":{{YC_USER_ID}},.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}"
                    },
                    {
                        "xPath": "//script[@data-component-name='BookfaceCsrApp']",
                        "jsonPath": "$.hasBookface",
                        "responseMatch": "\"hasBookface\":true"
                    }
            ],
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

The following information is used to provide your user with context about what proofs they're creating and why.

* **baseCallbackUrl**: Reclaim SDK will append a unique identifier (UUID) to this base URL, creating a unique callback URL for each proof request. The proofs will be uploaded to this callback URL by the Reclaim Wallet App.
  * You can also provide a `callbackId` (_optional_) if you want to identify users based on your unique identifier
* **title:** The `title` is used as the title of the proof request.
* **name:** The name of the provider (e.g., the name of the website the user is logging into)
* **logoUrl: T**he URL of the logo to display on the Reclaim app.&#x20;
* **url:** The URL of the website where the data resides
* **loginUrl**: The URL that your user should log in to. \


&#x20;    _Note: It should be constructed in a way that should redirect to `url` after the user logs in_

&#x20;   Example, in the code above, following `loginUrl` is used that redirects your user back to the `url`

&#x20;   `https://account.ycombinator.com/?continue=https%3A%2F%2Fbookface.ycombinator.com%2F`
