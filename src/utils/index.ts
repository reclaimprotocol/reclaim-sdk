import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { Proof, RequestClaim, responseSelection } from '../types'
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
	const proofs: Proof[] = JSON.parse(decodeURIComponent(requestBody)).proofs
	return proofs
}

export function extractValuesFromParameters(responseSelections: responseSelection[], proof: Proof) {
	// check if correct number of response selections are present
	if(proof.parameters.responseSelections && (responseSelections.length === proof.parameters.responseSelections.length)) {

		// create object to store parameter values
		const parameterObj: {[key: string]: string} = {}

		// iterate over all response selections
		for(let i = 0; i < responseSelections.length; i++) {
			const proofResponseSelection = proof.parameters.responseSelections[i] as responseSelection

			if(proofResponseSelection.responseMatch) {
				// get regex string from response selection
				const responseMatchRegex = responseSelections[i].responseMatch

				const parameterKeys: string[] = []
				// replace all {{parameterName}} with (.*?)
				const regexString = responseMatchRegex.replace(/{{(.*?)}}/g, (_, parameterName) => {
					parameterKeys.push(parameterName)
					return '(.*?)'
				})

				// create regex from string
				const regex = new RegExp(regexString, 'g')

				const regexStringWithValues = proofResponseSelection.responseMatch
				const regexValues = regex.exec(regexStringWithValues)
				if(regexValues !== null) {
					for(let i = 0; i < parameterKeys.length; i++) {
						const parameterKey = parameterKeys[i]
						const parameterValue = regexValues[i + 1]
						parameterObj[parameterKey] = parameterValue
					}
				}
			}
		}

		return parameterObj
	} else {
		throw new Error('Invalid response selections')
	}
}
