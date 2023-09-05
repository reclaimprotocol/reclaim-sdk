import { utils } from 'ethers'
import { BufferJSON, decryptData, encryptData, isRedactionCongruent } from '../utils'
import { createSignDataForClaim } from './sign-data'
import { signatures } from './signatures'
import { Claim, ClaimProof, EncryptedClaimProof, SignedClaim } from './types'

/**
 * Encrypts data using recipient's public key and sender's private key.
 * @param publicKey - Recipient public key in raw (un-hexed) form.
 * @param privateKey - Sender's private key in raw (un-hexed) form.
 * @param data - claim proof to encrypt
 */
export function encryptClaimProof(publicKey: Uint8Array, privateKey: Uint8Array, data: ClaimProof): Uint8Array {
	const serialised = Buffer.from(JSON.stringify(data, BufferJSON.replacer))
	return encryptData(publicKey, privateKey, serialised)
}

/**
 * Call to verify that the claims are proven by the encrypted proofs
 * @param claims the claims to verify
 * @param encryptedProofs encrypted proofs of the claims
 * @param privateKey private part of the communication key, must have been used
 * to encrypt the "encryptedProofs"
 */
export function verifyEncryptedClaims(
	claims: Claim[],
	encryptedProofs: EncryptedClaimProof[],
	privateKey: Uint8Array,
) {
	const revealedClaims: { [id: string]: ClaimProof } = {}
	// claims we have not found a proof for
	const claimsMissing = new Set(claims.map(c => c.identifier))
	// go through all encrypted proofs and decrypt them
	// check if the decrypted proof matches the claim
	for(const { identifier, enc } of encryptedProofs) {
		const claim = claims
			.find(c => c.identifier === identifier)
		if(!claim) {
			throw new Error('Claim not found')
		}

		// 1. check the data decrypts successfully
		const decryped = decryptData(privateKey, claim.ownerPublicKey, enc)
		// 2. check the data is valid JSON
		const proof: ClaimProof = JSON.parse(decryped.toString(), BufferJSON.reviver)
		// 3. check the claim parameters contained original link
		// match the ones decrypted
		if(!isRedactionCongruent(claim.redactedParameters, proof.parameters)) {
			throw new Error(`Claim parameters do not match for "${identifier}", redacted="${claim.redactedParameters}", decrypted="${proof.parameters}"`)
		}

		assertValidSignedClaim(
			{
				claim: {
					...claim,
					parameters: proof.parameters,
					owner: signatures.getAddress(claim.ownerPublicKey),
				},
				signatures: proof.signatures
			},
			claim.witnessAddresses
		)

		claimsMissing.delete(identifier)
		revealedClaims[identifier] = proof
	}

	// 7. if there are any claims left, that did not have a proof
	// throw an error, because we expected all claims to be proven
	if(claimsMissing.size) {
		const missing = claims.map(c => c.identifier).join(', ')
		throw new Error(`Not all claims were proven: ${missing}`)
	}

	return revealedClaims
}

/**
 * Asserts that the claim is signed by the expected witnesses
 * @param claim
 * @param expectedWitnessAddresses
 */
export function assertValidSignedClaim(
	claim: SignedClaim,
	expectedWitnessAddresses: string[],
) {
	const witnessAddresses = recoverSignersOfSignedClaim(claim)
	// set of witnesses whose signatures we've not seen
	const witnessesNotSeen = new Set(expectedWitnessAddresses)
	for(const witness of witnessAddresses) {
		if(witnessesNotSeen.has(witness)) {
			witnessesNotSeen.delete(witness)
		}
	}

	// check if all witnesses have signed
	if(witnessesNotSeen.size > 0) {
		throw new Error(`Missing signatures from ${expectedWitnessAddresses.join(', ')}`)
	}
}

/** recovers the addresses of those that signed the claim */
export function recoverSignersOfSignedClaim({ claim, signatures }: SignedClaim) {
	const dataStr = createSignDataForClaim({ ...claim })
	return signatures.map(signature => (
		utils.verifyMessage(dataStr, signature).toLowerCase()
	))
}