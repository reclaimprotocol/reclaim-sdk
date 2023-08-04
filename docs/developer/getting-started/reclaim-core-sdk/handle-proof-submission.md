---
description: '@reclaimprotocol/reclaim-sdk'
---

# 🕵♀ Handle Proof submission

### Define callback endpoint to handle proof submission:

Use `reclaim.verifyCorrectnessOfProofs(callbackId, proofs)` to verify if the proofs submitted were correct.

Here's an example of how you can set up the callback endpoint:

<pre class="language-javascript" data-line-numbers><code class="lang-javascript">// index.js
// ...

app.use(express.text({ type: "*/*" }));
<strong>
</strong><strong>app.post("/callback", async (req, res) => {
</strong>  try {
    // Retrieve the callback ID from the URL parameters
    const callbackId = req.query.callbackId as string;

    // Retrieve the proofs from the request body
    const proofs = reclaimprotocol.utils.getProofsFromRequestBody(req.body)

    // Verify the correctness of the proofs (optional but recommended)
    const isProofsCorrect = await reclaim.verifyCorrectnessOfProofs(callbackId, proofs);

    if (isProofsCorrect) {
      // Proofs are correct, handle them as needed
      // Retrieve user from db
      // user = await db.get(req.query.callbackId)
      // update user object according to your business logic
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
</code></pre>
