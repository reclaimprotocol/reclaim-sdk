import { fetchWitnessListForClaim, makeBeacon } from '@reclaimprotocol/witness-sdk'

export async function getWitnessesForClaim(epoch: number, identifier: string, timestampS: number) {
	const beacon = makeBeacon()
	const state = await beacon.getState(epoch)
	const witnessList = fetchWitnessListForClaim(
		state,
		identifier,
		timestampS,
	)
	return witnessList.map(w => w.id.toLowerCase())
}