---
description: '@reclaimprotocol/reclaim-sdk'
---

# 👮 Off-chain Verification

This tutorial will guide you on how to verify the proofs submitted by your user off-chain

<pre class="language-typescript" data-line-numbers data-full-width="false"><code class="lang-typescript">import { reclaimprotocol } from '@reclaimprotocol/reclaim-sdk'

const reclaim = new reclaimprotocol.Reclaim()  // 👈 initialise Reclaim class
<strong>const isProofsCorrect = reclaim.verifyCorrectnessOfProofs(callbackId, proofs)
</strong><strong>
</strong><strong>// ... proceed with your business logic
</strong></code></pre>

1. Line 1, import `reclaimprotocol` from Reclaim SDK
2. Line 3, initialise the Reclaim class to start using the methods provided by the SDK
3. Line 4, use the method `verifyCorrectnessOfProofs()` to verify proofs submitted by the user
4. The method returns a boolean response depending on whether the proof is correct or incorrect
5. Depending on the correctness of proof, proceed with your business logic\
   \
   To know more about the structure of Proofs, check [Glossary/Proof](broken-reference)
