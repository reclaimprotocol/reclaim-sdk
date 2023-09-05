import { ClaimID, ClaimInfo, CompleteClaimData, SignedClaim } from '@reclaimprotocol/witness-sdk'
import { utils } from 'ethers'

export const signatures = {
	getAddress(publicKey) {
		return utils.computeAddress(publicKey).toLowerCase()
	},
}

export function hashClaimInfo(info: ClaimInfo): ClaimID {
	const str = `${info.provider}\n${info.parameters}\n${info.context || ''}`
	return utils.keccak256(Buffer.from(str, 'utf-8')).toLowerCase()
}

export function createSignDataForClaim(
	data: CompleteClaimData
) {
	const identifier = 'identifier' in data
		? data.identifier
		: hashClaimInfo(data)
	const lines = [
		identifier,
		data.owner.toLowerCase(),
		data.timestampS.toString(),
		data.epoch.toString(),
	]

	return lines.join('\n')
}

/** recovers the addresses of those that signed the claim */
export function recoverSignersOfSignedClaim({ claim, signatures }: SignedClaim) {
	const dataStr = createSignDataForClaim({ ...claim })
	return signatures.map(signature => (
		utils.verifyMessage(dataStr, signature).toLowerCase()
	))
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