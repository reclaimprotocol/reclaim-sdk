/**
 * Uniquely identifies a claim.
 * Hash of claim info.
 * Utilise `hashClaimInfo` to obtain this.
 */
export type ClaimID = string

export type ClaimInfo = {
	provider: string
	parameters: string
	context?: string
}

export type AnyClaimInfo = ClaimInfo | { identifier: ClaimID }

export type CompleteClaimData = (
	{
		owner: string
		timestampS: number
		epoch: number
	}
) & AnyClaimInfo

export type SignedClaim = {
	claim: CompleteClaimData
	signatures: Uint8Array[]
}

export type AuthToken = {
	/** wallet address of the user */
	id: string
	/** unix timestamp in seconds */
	expiresAtS: number
}

export type Claim = {
	identifier: ClaimID
	provider: string
	redactedParameters: string
	ownerPublicKey: Uint8Array
	timestampS: number
	witnessAddresses: string[]
	epoch: number
	context?: string
}

export interface ClaimProof {
	/** the full parameters of the claim */
	parameters: string
	/**
	 * signatures of the claim done by the witnesses
	 * that attested to the claim's validity
	 */
	signatures: Uint8Array[]
}

export interface EncryptedClaimProof {
	/** identifier of the encrypted claim */
	identifier: string
	/** encrypted claim proof */
	enc: Uint8Array
}