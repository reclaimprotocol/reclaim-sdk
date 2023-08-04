# callbackId/sessionId

`callbackId` is a unique identifier that is used to identify who is submitting the proofs.&#x20;

### Where do you define callbackId?

`callbackId` is defined while [requesting proofs](../developer/getting-started/reclaim-core-sdk/request-proofs.md#define-an-endpoint-for-requesting-proofs). It's optional, if you don't provide `callbackId`, not a problem, we generate it for you and append it to your `baseCallbackUrl.`

When the proof is submitted through the Reclaim app, it hits the url -\
`https://<baseCallbackUrl>?callbackId=<callbackId>`



**Important:**

<mark style="color:yellow;">You should store this</mark> <mark style="color:yellow;"></mark><mark style="color:yellow;">`callbackId`</mark> <mark style="color:yellow;"></mark><mark style="color:yellow;">mapped to your user in your database, so that when your user submits the proof it gets updated in your database correctly for the intended user.</mark>

**👉 Check** [**guide for handling proof submission**](../developer/getting-started/reclaim-core-sdk/handle-proof-submission.md) **to know more about handling proofs**

