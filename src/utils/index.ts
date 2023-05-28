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

function isValidUrl(url: string) {
	try {
	  new URL(url)
	  return true
	} catch(err) {
	  return false
	}
}

export function encodeBase64(str: string[]) {
	return Buffer.from(JSON.stringify(str)).toString('base64')
}

export function decodeBase64(str: string) {
	return JSON.parse(Buffer.from(str, 'base64').toString('utf-8')) as string[]
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

export function extractParameterValuesFromRegex(expectedProofsInCallback: string, proofs: Proof[]) {
	// parse expectedProofsInCallback
	const selectionRegexes = decodeBase64(expectedProofsInCallback)

	// check if correct number of response selections are present
	if(selectionRegexes.length !== proofs.length) {
		throw new Error('Invalid number of proofs')
	}

	// create object to store parameter values
	const parameterObj: {[key: string]: string} = {}
	proofs.forEach((proof, index) => {
		// console.log(proof)
		if(proof.parameters.responseSelections) {

			// TODO: support multiple response selections inside each proof
			// get first response selection since we only support one for now
			const proofResponseSelection = proof.parameters.responseSelections[0] as responseSelection

			if(proofResponseSelection.responseMatch) {
				// get regex string from response selection
				const responseMatchRegex = selectionRegexes[index]

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
	})

	return parameterObj
}
