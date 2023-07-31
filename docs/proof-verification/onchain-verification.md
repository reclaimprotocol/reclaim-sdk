# On-chain Verification of Reclaim proofs

This method of verification helps to build trustless dApps. A user generates a proof and submits it to the relevant smart-contract/dApp for verification. This smart-contract can query Reclaim Contract to verify the validity of the proof. Based on the response from Reclaim Contract and the specific application logic, the smart-contract can execute transactions.

## Prerequisites

- Proof has already been generated using one of *reclaim-sdk* or *reclaim-client-sdk*.

## Relevant Components of the Proof

1. `uint32 Epoch` - This is the epoch number when the proof was generated. This is essential to determine the witnesses that were supposed to sign the proofs.
2. `ClaimInfo claimInfo` - This is a struct with the following:
    - `string provider` - name of the provider used. E.g. `'uidai-dob'`
    - `string parameters` - the parameters returned. E.g. `'{"dob":"0000-00-00"}'`
    - `string context` - the user-application specific context. A concatenation of *contextMessage* and *contextAddress*.
3. `CompleteClaimData claimData` - This is a struct of the following:
    - `bytes32 infoHash` - the hash of the *ClaimInfo*.
    - `address owner` - address of the owner of the proof.
    - `uint32 timestampS` - timestamp when the epoch started.
    - `uint256 claimId` - [deprecated] Claim Id if the proof is stored on-chain by reclaim. Set the value to `0` for the new versions.
    - `string identifier` - Current value is to be set to an empty string `''`.
    - `uint256 epoch` - the epoch number, same as above.
4. `bytes[] signatures` - List of signatures received from the witnesses.

## Verifying proofs in your Smart Contracts

The following function from Reclaim Contract helps check whether a proof is correct or not.
```solidity
function assertValidEpochAndSignedClaim(uint32 epochNum, ClaimInfo memory claimInfo, CompleteClaimData memory claimData, bytes[] memory signatures) external view;
```

This returns successfully only if:
- The infoHash computed using the claimInfo matches the infoHash in claimData.
- The signatures are by valid witnesses.

The function reverts if either is unsuccessful. To use this function, implement an interface in your smart contract (SC).
```solidity
interface ReclaimContractInterface {
    struct CompleteClaimData {
		bytes32 infoHash;
		address owner;
		uint32 timestampS;
		uint256 claimId;
	}
	struct ClaimInfo {
		string provider;
		string parameters;
		string context;
	}
    function assertValidEpochAndSignedClaim(uint32 epochNum, ClaimInfo memory claimInfo, CompleteClaimData memory claimData, bytes[] memory signatures) external view;
}
```

The transaction which queries `assertValidEpochAndSignedClaim()` will look like the following:
```solidity
function verifyProofAndExecuteSCLogic(uint32 _epoch, string memory _params, string memory _provider, address _contextAddress, ReclaimContractInterface.CompleteClaimData memory _claimData, bytes[] memory _signatures) public {

    // execute checks on _params and _providers.
    // ...

    // contextMessage is a contract constant. E.g. contextMessage = keccak256(abi.encode("MySC"));
    string memory context = string(abi.encodePacked(contextMessage, contextAddressString));

    // create a claiminfo struct object to send to reclaim for verification
    ReclaimContractInterface.ClaimInfo memory claimInfo = ReclaimContractInterface.ClaimInfo(_provider, params, context);

    // assertValidEpochAndSignedClaim will revert if either infoHash or Signatures don't match.
    // address reclaimContractAddress = '0x6D0f81BDA11995f25921aAd5B43359630E65Ca96' <- example
    ReclaimContractInterface(reclaimContractAddress).assertValidEpochAndSignedClaim(_epoch, claimInfo, _claimData, _signatures);

    // return success/execute further SC logic.
}
```