import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { Proof, RequestClaim } from '../types'
import CONTRACTS_CONFIG from '../utils/contracts/config.json'
import { Reclaim, Reclaim__factory as ReclaimFactory } from '../utils/contracts/types'

export function generateUuid() {
	return uuidv4()
}

const existingContractsMap: { [chain: string]: Reclaim } = { }

export async function getOnChainClaimDataFromRequestId(
	chainId: number,
	claimId: string | number
): Promise<RequestClaim> {
	const contract = getContract(chainId)
	const pendingCreateData = await contract!.claimCreations(claimId)
	if(!pendingCreateData?.claim.claimId) {
		throw new Error(`Invalid request ID: ${claimId}`)
	}

	const claim = pendingCreateData.claim
	return {
		infoHash:claim.infoHash,
		owner:claim.owner.toLowerCase(),
		timestampS:claim.timestampS,
		claimId:claim.claimId
	}
}

export async function getClaimWitnessOnChain(chainId: number, claimId: number) {
	const contract = getContract(chainId)
	const witnesses = await contract.getClaimWitnesses(claimId)
	return witnesses
}

export function getContract(chainId: number) {
	const chainKey = `0x${chainId.toString(16)}`
	if(!existingContractsMap[chainKey]) {
		const contractData = CONTRACTS_CONFIG[chainKey as keyof typeof CONTRACTS_CONFIG]
		if(!contractData) {
			throw new Error(`Unsupported chain: "${chainKey}"`)
		}

		const rpcProvider = new ethers.providers.JsonRpcProvider(contractData.rpcUrl)
		existingContractsMap[chainKey] = ReclaimFactory.connect(
			contractData.address,
			rpcProvider,
		)
	}

	return existingContractsMap[chainKey]
}

export function getProofsFromRequestBody(requestBody: string) {
	const proofs: Proof[] = JSON.parse(decodeURIComponent(requestBody)).claims
	return proofs
}
