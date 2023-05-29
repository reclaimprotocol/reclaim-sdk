# Quickstart

In this quickstart guide, we'll show you how to integrate Reclaim SDK in your application! The tutorial assumes that you have a backend server running where you want to integrate the Reclaim SDK.

## Installation

```
npm i @reclaimprotocol/reclaim-sdk
```

## Request proofs

To request proofs of your users' credentials using reclaim protocol, generate a `reclaimUrl` using the Reclaim SDK that will be used by your user to generate proofs of their credentials and submit it to your application.

You can generate the `reclaimUrl` by:

This example uses CustomProvider to request proofs

```
// import reclaimprotocol
import { reclaimprotocol } from "@reclaimprotocol/reclaim-sdk";

const reclaim = new reclaimprotocol.Reclaim()

app.get('/request-proofs', (req, res) => {

const request = reclaim.requestProofs({
            title: "Reclaim Protocol",
            baseCallbackUrl: "https://reclaim.app/callback",
            callbackId: 'unique_callback_id' // optional, if not provided, SDK will generate one for you
            requestedProofs: [
                new reclaim.CustomProvider({
                    provider: 'google-login', // select the provider that you want your users to submit proofs for
                    payload: {}
                }),
            ],
        });

// Store the callback Id and Reclaim URL in your database
// These will be used later to verify the proofs submitted
const { callbackId, reclaimUrl } = request;
res.json({ reclaimUrl });
})
```

The Reclaim URL is supposed to be opened using mobile phone. We suggest you to show this `reclaimUrl` in the form of a QR code (on desktop) or a link (on smaller screens)

Your user opens the reclaimUrl on their mobile phone and gets redirected to the Reclaim mobile app for proof submission.

## Handle proof submission

When your user submits proof on the app, a POST request is made to the callback URL `baseCallbackUrl` with `callbackId` as one of the that you had passed during requesting the proofs.

To accept the proof submitted by the user through the callback endpoint, you need to implement a route in your application that corresponds to the `baseCallbackUrl` you provided when requesting the proofs. Here's an example of how you can set up the callback endpoint:

```
app.post("/callback/:callbackId", async (req, res) => {
      try {
        // Retrieve the callback ID from the URL parameters
        const { callbackId } = req.params;

        // Retrieve the proofs from the request body
        const { proofs } = req.body;

        const proofId = reclaim.generateProofId(proofs)

        // Check if proofs have already been submitted against this proofId
        const results = db.get(proofId)
        if(results){
            res.status(400).json({ error: "Proofs already submitted" });
        } else {

            // Verify the correctness of the proofs 
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
        }

      } catch (error) {
        console.error("Error processing callback:", error);
        res.status(500).json({ error: "Failed to process callback" });
      }
    });
```
