import { Beacon, fetchWitnessListForClaim } from '@reclaimprotocol/crypto-sdk'
import { DEFAULT_CHAIN_ID, makeBeacon, makeBeaconCacheable } from '@reclaimprotocol/reclaim-node'
import canonicalize from 'canonicalize'
import { ethers, logger, utils } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { Context, Proof, SubmittedProof } from '../types'
import CONTRACTS_CONFIG from '../utils/contracts/config.json'
import { Reclaim, Reclaim__factory as ReclaimFactory } from '../utils/contracts/types'

export function generateUuid() {
	return uuidv4()
}

const existingContractsMap: { [chain: string]: Reclaim } = { }

export async function getClaimWitnessOnChain(chainId: number, epoch: number, identifier: string, timestampS: number) {
	const contract = getContract(chainId)
	logger.info('fetching witnesses for claim', epoch, identifier, timestampS)
	try {
		const witnesses = await contract.fetchWitnessesForClaim(epoch, identifier, timestampS)
		return witnesses.map(w => w.addr.toLowerCase())
	} catch(e) {
		logger.info('error fetching witnesses', e)
		return []
	}
}

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

export function encodeContext(ctx: Context, fromProof: boolean): string {
	const context: Context = {
		contextMessage: !fromProof ? utils.keccak256(utils.toUtf8Bytes(ctx.contextMessage)) : ctx.contextMessage,
		contextAddress: ctx.contextAddress,
		sessionId: ctx.sessionId,
	}
	return canonicalize(context)!
}

export function decodeContext(ctx: string): Context {
	const context: Context = JSON.parse(ctx)
	// context.contextMessage = utils.toUtf8String(context.contextMessage)
	return context
}

export async function getClaimWitnessesFromEpoch(chainId: number, epoch: number) {
	const contract = getContract(chainId)
	const epochFetched = await contract.fetchEpoch(epoch)
	return epochFetched.witnesses.map(w => w.addr.toLowerCase())
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
	const proofs: SubmittedProof[] = JSON.parse(decodeURIComponent(requestBody)).proofs
	return proofs
}

export function transformProofsToverify(proofs: SubmittedProof[]) {
	return proofs.map(p => {
		return {
			...p,
			parameters: JSON.parse(p.parameters)
		}
	})
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

	return `${baseUrl}?callbackId=${id}`
}

export function getCallbackIdFromUrl(_url: string): string {
	// check if valid url
	if(!isValidUrl(_url)) {
		throw new Error('Invalid URL')
	}

	const url = new URL(_url)
	const urlParams = new URLSearchParams(url.search)
	const callbackId = urlParams.get('callbackId')
	if(!callbackId) {
		throw new Error('Callback Id not found in URL')
	} else {
		return callbackId
	}
}

export function validateParameterValuesFromRegex(expectedProofsInCallback: string, proofs: Proof[]) {
	// parse expectedProofsInCallback
	const templateRegexes = decodeBase64(expectedProofsInCallback)

	const proofsParams = proofs.map(p => Object.entries(p?.extractedParameterValues ?? {}))
	const params = new Map<string, string|number>(...proofsParams)
	const unusedParams = new Map(params)

	//replace placeholders with params
	const selectionRegexes: string[][] = []
	templateRegexes.forEach(regexes => {
		const rxs: string[] = []
		regexes.forEach(rx => {
			let updatedRegex = rx
			for(const [paramsKey, paramsValue] of params) {
				const m = `{{${paramsKey}}}`
				if(updatedRegex.includes(m)) {
					updatedRegex = updatedRegex.replace(m, paramsValue.toString())
					unusedParams.delete(paramsKey)
				}
			}

			rxs.push(updatedRegex)
		})
		selectionRegexes.push(rxs)
	})


	if(unusedParams.size > 0) {
		throw new Error(`Not all parameters were used in response selections: ${JSON.stringify(Object.fromEntries(unusedParams))}`)
	}

	if(selectionRegexes.length !== proofs.length) {
		throw new Error(`Number of proofs (${proofs.length}) does not match number of response selections (${selectionRegexes.length})`)
	}

	//get all responseMatches from all proofs
	const proofSelections = proofs.map(proof => {
		if(Array.isArray(proof.parameters.responseSelections)) {
			return new Set<string>(proof.parameters.responseSelections.map(selection => {
				return selection.responseMatch
			}))
		} else {
			return new Set<string>([''])
		}
	})

	// make sure that ALL selectionRegexes are proven

	selectionRegexes.forEach(rxs => {
		//go through all proofs
		let found = false
		for(const ps of proofSelections) {
			let ok = false
			// try only those proofs which have same number of elements
			if(ps.size === rxs.length) {
				ok = true
				// try to find match for each selection regex
				rxs.forEach(rx => {
					ok = ok && ps.has(rx)
				})
			}

			if(ok) {
				found = true
				break
			}
		}

		if(!found) {
			throw new Error('Response match not found')
		}
	})
}

export async function getShortenedUrl(url: string) {
	// const headers = new Headers()
	// headers.append('Content-Type', 'application/json')
	const response = await fetch('https://rclm.link/short', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fullUrl: url
		})
	})
	const res = await response.json()
	const shortenedVerificationUrl = res.shortUrl
	return shortenedVerificationUrl
}

// type guard for proof
export function isProof(obj: unknown): obj is Proof {
	return (
		(obj as Proof).parameters !== undefined &&
		(obj as Proof).ownerPublicKey !== undefined &&
		(obj as Proof).signatures !== undefined &&
		(obj as Proof).timestampS !== undefined &&
		(obj as Proof).provider !== undefined &&
		(obj as Proof).witnessAddresses !== undefined &&
		(obj as Proof).templateClaimId !== undefined
	)
}

export default function makeSmartContractBeacon(chainId?: number): Beacon {
	chainId = chainId || DEFAULT_CHAIN_ID
	const contract = getContract(chainId)
	return makeBeaconCacheable({
		async getState(epochId) {
			const epoch = await contract.fetchEpoch(epochId || 0)
			if(!epoch.id) {
				throw new Error(`Invalid epoch ID: ${epochId}`)
			}

			return {
				epoch: epoch.id,
				witnesses: epoch.witnesses.map(w => ({
					id: w.addr.toLowerCase(),
					url: w.host
				})),
				witnessesRequiredForClaim: epoch.minimumWitnessesForClaimCreation,
				nextEpochTimestampS: epoch.timestampEnd
			}
		}
	})
}