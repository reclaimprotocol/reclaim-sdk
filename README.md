# Reclaim-SDK
The Reclaim SDK provides a way to let your users import data from other websites into your app in a secure, privacy preserving manner using zero knowledge proofs. 

## Table of contents:
1. [Introduction](#introduction)
2. [Getting started](#getting-started)
3. [Providers](#providers)
4. [Using HTTPS Provider](#using-https-provider)
    - [How to find `loginCookies`](#how-to-find-logincookies)
5. [Using Custom Provider](#using-custom-provider)

## Introduction
The goal of the SDK is to allow you, the developer to easily integrate [Reclaim Protocol](https://questbook.gitbook.io/reclaim-protocol/)
 into your application. For example, you can ask your user for a proof that they have contributed to a GitHub repo, or they are an YC alumni, or they have a certain bank balance in their account without revealing any other PII like their name, physical address, phone number etc.

Here's a step-by-step guide to help you get started:

 ## Getting started
 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/reclaimprotocol/one-step-deploy-provider)

Follow along the guide and build your own server or you can directly deploy the following provider example to Vercel with a single click. This process automatically creates a fork in your GitHub repository, allowing you to jump straight into the action. By editing the code directly on Github, you can conveniently modify and tailor the application to your specific use case.

1. Set up a new Node.js project:
     ```
    mkdir my-reclaim-app
    cd my-reclaim-app
    npm init -y
      ```
2. Install the necessary dependencies:
    ```
    npm i typescript ts-node @types/node
    npm i express cors body-parser
    npm i @reclaimprotocol/reclaim-sdk

    npm i --save-dev @types/cors @types/express @types/body-parser
    ```
3. Create a `tsconfig.json` file in the project root directory to configure TypeScript and add the following:
      ```
      {
        "compilerOptions": {
          "module": "commonjs",
          "esModuleInterop": true,
          "target": "es6",
          "moduleResolution": "node",
          "sourceMap": true,
          "outDir": "dist"
        },
        "lib": ["es2015"]
      }
      ```
4. Open the `package.json` file and modify the `"scripts"` section to include the TypeScript compiler:
      ```
      "scripts": {
        "start": "ts-node index.ts",
        "build": "tsc"
      }
      ```

5. Create an index.ts file in your project directory and add the following code to initialize the SDK and request proofs from your user:
    ```
    import { reclaimprotocol } from "@reclaimprotocol/reclaim-sdk";
    import bodyParser from 'body-parser'
    import express from "express";
    import cors from 'cors';

    const app = express()
    const port = 3000

    app.use(cors())
    app.use(bodyParser.json())

    // initialise the Reclaim class
    const reclaim = new reclaimprotocol.Reclaim()

    // Define an endpoint for requesting proofs
    app.get("/request-proofs", async(req, res) => {
    try {
        const request = reclaim.requestProofs({
            title: "Reclaim Protocol",
            baseCallbackUrl: "https://reclaim.app/callback", 
            contextMessage: "Airdrop for Reclaim claimants", //optional: context message for the proof request
            contextAddress: "0x5d96Cb97F8499d4dEa814cEa2F8448A0AF1A2bC2" //optional: your users' Ethereum wallet address
            requestedProofs: [
                new reclaim.CustomProvider({
                    provider: 'google-login',
                    payload: {}
                }),
            ],
        });
        // Store the callback Id and Reclaim URL in your database
        const { callbackId } = request;
        const reclaimUrl = await request.getReclaimUrl({});
        // ... store the callbackId and reclaimUrl in your database
        res.json({ reclaimUrl });
    }
    catch (error) {
        console.error("Error requesting proofs:", error);
        res.status(500).json({ error: "Failed to request proofs" });
    }

    app.listen(port, () => {
    console.log(`Reclaim app listening on port ${port}`)
      })
    })
    ```

6. Start the server. Your server should now be running on http://localhost:3000.
      ```
      npm start
      ```

7. In your client application, make a request to the /request-proofs endpoint to retrieve the Reclaim URL:

      ```
      fetch("http://localhost:3000/request-proofs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((data) => {
          const reclaimUrl = data.reclaimUrl;
          // Use the reclaimUrl in your application to initiate the proof request
        })
        .catch((error) => {
          console.error("Error requesting proofs:", error);
        });
      ```

8. Use the `reclaimUrl` returned from the server to initiate the proof request in your application. We suggest to display the URL as a QR code on web and link/button on mobile view

9. By scanning the QR code or clicking on the `reclaimUrl`, the user will be directed to the Reclaim app, where they can generate and submit the required proofs.

10. To accept the proof submitted by the user through the callback endpoint, you need to implement a route in your application that corresponds to the `baseCallbackUrl` you provided when requesting the proofs. Here's an example of how you can set up the callback endpoint:

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

          // Respond with a success message
          res.json({ success: true });
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
    Upon receiving the callback, you can verify the correctness of the proofs using `await reclaim.verifyCorrectnessOfProofs()`. If the proofs are correct, you can process them as needed in your application and update your data. You can also handle any errors that may occur during the callback processing.

    Make sure to adjust the route (`/callback`) and the processing logic inside the endpoint to match your application's requirements and data handling.

That's it 🎉 You have now set up the Reclaim SDK in your application and can start requesting proofs from your users. 

The example code demonstrates how to request proofs for ownership of Google account. You can customize the requested proofs by using different providers or creating your own Providers.

## Providers
Following are the default providers that you can start using right away:
- **GitHub**: To prove GitHub commits or pull requests by your user
- **YCombinator**: To prove that your user is a YC alumni
- **Google**: To prove that your user is an owner of a certain google account

But if your application require a certain Provider that is not listed above. You can create your own Provider using one of the following methods:

- **HTTPS Provider**: Use this provider when the data exists in plain text on a webpage and needs to be extracted. This usually means extracting the text from a particular html element on a particular webpage.

  The providers developed using this method are available explicitly for your application. They would not show up on the Reclaim app as one of the default providers. 
- **Custom Provider**: Use this provider If the data doesn't exist as is in any html element and requires some additional compute, for example counting the number of transactions or summing some values on the page - the logic needs to be embedded in a custom provider.
  
  The providers developed using this method are available for other applications to use them as well. They appear on the Reclaim app as one of the default providers.

## Using HTTPS Provider

```
import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

app.get("/request-proofs", async(req, res) => {
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
        const { callbackId, expectedProofsInCallback } = request;
        const reclaimUrl = await request.getReclaimUrl({})
        // ... store the callbackId, reclaimUrl and expectedProofsInCallback in your database
        res.json({ reclaimUrl });
    }
    catch (error) {
        console.error("Error requesting proofs:", error);
        res.status(500).json({ error: "Failed to request proofs" });
    }
})
```
In the above code snippet, the HttpsProvider accepts object of `type HttpsProviderParams` defined [here](src/types/index.ts#L11). Here's a description of each property:

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

The submission of proofs is handled by the callback endpoint as show below. The function `reclaimprotocol.utils.extractParameterValues(expectedProofsInCallback, proofs)` is used to extract the information proved by your user 
```
    app.post("/callback", async (req, res) => {
      try {
        // Retrieve the callback ID from the URL parameters
        const { id } = req.query;

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
## Using Custom Provider
Here's an example usage of Custom Provider that uses `github-commits` to request proof of commit to a particular repository:
```
const request = reclaim.requestProofs({
            title: "Reclaim Protocol",
            baseCallbackUrl: "https://reclaim.app/callback",
            requestedProofs: [
                new reclaim.CustomProvider({
                    provider: "github-commits",
                    payload: {
                        repository: "reclaimprotocol/reclaim-sdk",
                        searchQuery: {
                            keywords: [],
                            qualifiers: {}
                        },
                        type: "github-commits",
                    }
                }),
            ],
        });
```
`CustomProvider` accepts object of type `ProviderParams` defined [here](src/types/index.ts#L20) where:

- `provider`: The name of the custom provider. This is used to specify the type of custom provider you want to request proofs from.
- `payload`: An object containing custom parameters specific to the custom provider. The structure and content of this object depend on the requirements of your custom provider.

In the provided example, the custom provider is named `"github-commits"` and the `payload` contains the following properties:

- `repository`: The GitHub repository from which you want to request proof of commits.
- `searchQuery`: An object specifying the keywords and qualifiers for filtering the commits. This allows you to retrieve specific commits based on search criteria.
- `type`: A type identifier for the custom provider, in this case, "github-commits". This can be used by your custom provider implementation to handle different types of requests.


*Note: Building a custom provider is not available publicly at this point. Please [contact us](https://t.me/abhilashinumella) for getting access to the repository to build a custom provider*
## Examples
Check the [examples](/examples/) folder to run a sample project using Reclaim-sdk
