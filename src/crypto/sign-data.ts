import { utils } from 'ethers'
import { ClaimID, ClaimInfo, CompleteClaimData } from './types'

type CommunicationData = {
	communicationPublicKey: Uint8Array
	linkId: string
	context: string
}

export function createSignDataForCommunicationKey(
	{
		communicationPublicKey,
		linkId,
		context
	}: CommunicationData,
) {
	const str = `${utils.hexlify(communicationPublicKey).toLowerCase()}\n${linkId}\n${context ?? ''}`
	return Buffer.from(str, 'utf-8')
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

export function hashClaimInfo(info: ClaimInfo): ClaimID {
	const str = `${info.provider}\n${info.parameters}\n${info.context || ''}`
	return utils.keccak256(Buffer.from(str, 'utf-8')).toLowerCase()
}