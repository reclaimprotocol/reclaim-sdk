## Verifying Proofs from Reclaim

Once a proof is generated, there are two ways the application can choose to verify it. Either `verifyCorrectnessOfProof()` from reclaim-sdk can be used if the application is centralized or `assertValidEpochAndSignedClaim()` external function from Reclaim's smart contract can be used to verify the proof on-chain if the application is trustless.