import { assertValidSignedClaim, hashClaimInfo, signatures, SignedClaim } from '@reclaimprotocol/crypto-sdk'
import serialize from 'canonicalize'
import { utils } from 'ethers'
import P from 'pino'
import { Proof, ProofRequest, Template } from '../types'
import { generateCallbackUrl, generateUuid, getCallbackIdFromUrl, getClaimWitnessOnChain, getOnChainClaimDataFromRequestId } from '../utils'
import { CustomProvider } from './CustomProvider'
import { HttpsProvider } from './HttpsProvider'
import TemplateInstance from './Template'

const logger = P()

/** Reclaim class */
export class Reclaim {

	get HttpsProvider() {
		return HttpsProvider
	}

	get CustomProvider() {
		return CustomProvider
	}

	/**
	 * function to request proofs from Reclaim
	 * @param request Proof request
	 * @returns {TemplateInstance} Template instance
	 */
	requestProofs = (request: ProofRequest): TemplateInstance => {
		const callbackUrl = generateCallbackUrl(request.baseCallbackUrl, request.callbackId)
		const sessionId = getCallbackIdFromUrl(callbackUrl)

		const contextMessage = request.contextMessage ? request.contextMessage : request.baseCallbackUrl
		const contextAddress = request.contextAddress ? request.contextAddress : '0x0'

		const template: Template = {
			id: generateUuid(),
			sessionId,
			name: request.title,
			callbackUrl,
			claims: request.requestedProofs.map((requestedProof) => {
				return {
					templateClaimId: generateUuid(),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					provider: requestedProof.params.provider as any,
					payload: requestedProof.params.payload,
					context: utils.keccak256(utils.toUtf8Bytes(contextMessage)) + '' + contextAddress,
				}
			})
		}
		const regexes = request.requestedProofs.map((requestedProof) => {
			return requestedProof.regex
		})
		return new TemplateInstance(template, regexes)
	}

	/**
	 * function to verify the witness signatures
	 * @param proofs proofs returned by the callback URL
	 * @returns {Promise<boolean>} boolean value denotes if the verification was successful or failed
	 */
	verifyCorrectnessOfProofs = async(expectedSessionId: string, proofs: Proof[]): Promise<boolean> => {
		let result: boolean = false

		for(const proof of proofs) {
			// fetch on chain witness address for the claim
			const witnesses = await getClaimWitnessOnChain(proof.chainId, parseInt(proof.onChainClaimId))

			// if no witnesses are present: return false
			if(!witnesses.length) {
				logger.error('No witnesses found on chain')
				return result
			}

			// if the session id is not same: return false
			if(proof.sessionId !== expectedSessionId) {
				logger.error('Session id mismatch')
				return result
			}

			try {
				const claim: SignedClaim = {
					claim: {
						claimId: parseInt(proof.onChainClaimId),
						owner: signatures.getAddress(Buffer.from(proof.ownerPublicKey, 'hex')),
						provider: proof.provider,
						timestampS: parseInt(proof.timestampS),
						context: proof.context,
						sessionId: proof.sessionId,
						parameters: serialize(proof.parameters)!,
					},
					signatures: proof.signatures.map(signature => {
						return utils.arrayify(signature)
					})
				}

				// fetch on chain claim data from the request id
				const claimData = await getOnChainClaimDataFromRequestId(proof.chainId, proof.onChainClaimId)
				const onChainInfoHash = claimData.infoHash
				const calculatedInfoHash = hashClaimInfo({ parameters: serialize(proof.parameters)!, provider: proof.provider, context: proof.context, sessionId: expectedSessionId }) //TODO: pass context from the app


				// if the info hash is not same: return false
				if(onChainInfoHash.toLowerCase() !== calculatedInfoHash.toLowerCase()) {
					logger.error('Info hash mismatch')
					return result
				}

				// verify the witness signature
				assertValidSignedClaim(claim, witnesses)
				logger.info(`isCorrectProof: ${result}`)
				result = true
			} catch(error) {
				// if the witness signature is not valid: return false
				logger.error(`${error}`)
				result = false
			}
		}

		return result
	}

	/**
	 * function to get the onChainClaimIds from the proofs
	 * @param proofs
	 * @returns {string}
	 */
	getOnChainClaimIdsFromProofs = (proofs: Proof[]): string[] => {
		const onChainClaimIdArray: string[] = []
		for(const proof of proofs) {
			const onChainClaimId = proof.onChainClaimId
			onChainClaimIdArray.push(onChainClaimId)
		}

		return onChainClaimIdArray
	}
}

