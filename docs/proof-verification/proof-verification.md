## Verifying Proofs from Reclaim

Once you receive zk proof from your user, you can verify if they are correct using two methods:

1. **On-chain verification**: This method is useful if you want to build a trustless application. The proof is verified on-chain and the application can execute transactions based on the response from Reclaim Contract.

    Guide to on-chain verification can be found [here](onchain-verification.md).

2. **Off-chain verification**: This method is useful if you want to build a centralized application. The proof is verified off-chain using Reclaim-SDK and the application can execute its business logic based on the correctness of the proof.

    <!-- Guide to off-chain verification can be found [here](offchain-verification.md). -->

<!-- Once a proof is generated, there are two ways the application can choose to verify it. Either `verifyCorrectnessOfProof()` from reclaim-sdk can be used if the application is centralized or `assertValidEpochAndSignedClaim()` external function from Reclaim's smart contract can be used to verify the proof on-chain if the application is trustless. -->