import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import {Proof, ProofParameters, RequestClaim} from '../types'
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
	return await contract.getClaimWitnesses(claimId)
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

function isValidUrl(url: string) {
	try {
	  new URL(url)
	  return true
	} catch(err) {
	  return false
	}
}

export function encodeBase64(str: string[][]) {
	return Buffer.from(JSON.stringify(str)).toString('base64')
}

export function decodeBase64(str: string) {
	return JSON.parse(Buffer.from(str, 'base64').toString('utf-8')) as string[][]
}

export function generateCallbackUrl(baseUrl: string, callbackId?: string) {
	// check if valid url
	if(!isValidUrl(baseUrl)) {
		throw new Error('Invalid URL')
	}

	const id = callbackId ? callbackId : generateUuid()

	//check for trailing slash
	if(baseUrl.endsWith('/')) {
		// remove trailing slash
		baseUrl = baseUrl.slice(0, -1)
	}

	return `${baseUrl}?id=${id}`
}

export function getCallbackIdFromUrl(_url: string): string {
	// check if valid url
	if(!isValidUrl(_url)) {
		throw new Error('Invalid URL')
	}

	const url = new URL(_url)
	const urlParams = new URLSearchParams(url.search)
	const callbackId = urlParams.get('id')
	if(!callbackId) {
		throw new Error('Callback Id not found in URL')
	} else {
		return callbackId
	}
}

export function validateParameterValuesFromRegex(expectedProofsInCallback: string, proofs: Proof[], params:ProofParameters) {
	// parse expectedProofsInCallback
	const selectionRegexes = decodeBase64(expectedProofsInCallback)

	let paramsClone = { ...params };

	//replace placeholders with params
	const updatedSelectionRegexes: Set<string>[] = [];
	selectionRegexes.forEach(regexes => {
		const rxs: Set<string> = new Set<string>();
		regexes.forEach(rx => {
			let updatedRegex = rx
			for (let paramsKey in params) {
				const m = `{{${paramsKey}}}`
				if (updatedRegex.includes(m)){
					updatedRegex = updatedRegex.replace(m,params[paramsKey])
					delete paramsClone[paramsKey]
				}
			}
			rxs.add(updatedRegex)
		})
		updatedSelectionRegexes.push(rxs)
	})


	if (Object.keys(paramsClone).length > 0){
		throw new Error("Not all parameters were used in response selections")
	}

	if(updatedSelectionRegexes.length !== proofs.length) {
		throw new Error('Number of proofs does not match number of response selections')
	}

	proofs.forEach((proof, index) => {
		//console.log(proof)
		if(proof.parameters.responseSelections && Array.isArray(proof.parameters.responseSelections)) {
			proof.parameters.responseSelections.forEach((selection) => {
				if (!selection.responseMatch){
					throw new Error('Response match cannot be empty')
				}
				if (!updatedSelectionRegexes[index].has(selection.responseMatch)){
					throw new Error('Response match not found')
				}
			})

		}
	})

}

// type guard for proof
export function isProof(obj: unknown): obj is Proof {
	return (
		(obj as Proof).chainId !== undefined &&
		(obj as Proof).parameters !== undefined &&
		(obj as Proof).onChainClaimId !== undefined &&
		(obj as Proof).ownerPublicKey !== undefined &&
		(obj as Proof).signatures !== undefined &&
		(obj as Proof).timestampS !== undefined &&
		(obj as Proof).provider !== undefined &&
		(obj as Proof).witnessAddresses !== undefined &&
		(obj as Proof).templateClaimId !== undefined
	)
}