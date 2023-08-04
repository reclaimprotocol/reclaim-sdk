# Custom Provider

Use a Custom provider if the data doesn't exist as is in any HTML element and requires some additional computing, for example, counting the number of transactions or summing some values on the page - the logic needs to be embedded in a custom provider.

### Request proofs using a custom provider

```javascript
// index.js
// ...
app.get("/request-proofs", async(req, res) => {
const {userAddress} = req.body;
try {
    const request = reclaim.requestProofs({
        title: "Reclaim Protocol", // Name of your application
        baseCallbackUrl: "http://localhost:3000/callback", 
        contextMessage: "Airdrop for Reclaim Users!", //required : Why you are requesting this proof. Displayed on the user's device while creating the proof
        contextAddress: userAddress, //optional: your users' EVM/Solana/Bitcoin wallet address if you are planning to use this proof for NFT or Coin drops
        requestedProofs: [
            new reclaim.CustomProvider({
                provider: 'google-login',
                payload: {}
            }),
        ],
    });

    const { callbackId } = request;
    const reclaimUrl = await request.getReclaimUrl();
    // Store the callback Id and Reclaim URL in your database
    // await db.put(callbackId, reclaimUrl, { userAddress: req.body.userAddress, param1 : req.body.param1 })
    res.json({ reclaimUrl }); // display this reclaimUrl as a QR code on laptop or as a link on mobile devices for users to initiate creating proofs
}
```

The example above uses `google-login` as the Custom Provider. Find all other providers [here](https://github.com/reclaimprotocol/reclaim-sdk/blob/eecabbffb56c467da3f6551ca238132b61e3b48d/src/types/index.ts#L61)\
