import { assertValidSignedClaim, hashClaimInfo, signatures, SignedClaim } from '@reclaimprotocol/crypto-sdk'
import serialize from 'canonicalize'
import { utils } from 'ethers'
import P from 'pino'
import { Proof, ProofRequest, SubmittedProof, Template } from '../types'
import { generateCallbackUrl, generateUuid, getCallbackIdFromUrl, getClaimWitnessesFromEpoch, getClaimWitnessOnChain, getOnChainClaimDataFromRequestId, transformProofsToverify } from '../utils'
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
	verifyCorrectnessOfProofs = async(expectedSessionId: string, submittedProofs: SubmittedProof[]): Promise<boolean> => {
		let result: boolean = false
		const proofs = transformProofsToverify(submittedProofs)
		for(const proof of proofs) {
			let witnesses: string[] = []
			if(proof.onChainClaimId === '0' && proof.epoch && proof.identifier) {
				// fetch witness from epoch
				witnesses = await getClaimWitnessesFromEpoch(proof.chainId, proof.epoch)
			} else if(proof.onChainClaimId === '0' && (!proof.epoch || !proof.identifier)) {
				// fetch witness from epoch
				logger.error('Epoch or identifier missing')
				return result
			} else if(proof.onChainClaimId !== '0') {
				// fetch on chain witness address for the claim
				witnesses = await getClaimWitnessOnChain(proof.chainId, parseInt(proof.onChainClaimId))
			}

			// if no witnesses are present: return false
			if(!witnesses.length) {
				logger.error('No witnesses found for the claim')
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
						epoch: proof.epoch ? proof.epoch : undefined,
						identifier: proof.identifier ? proof.identifier : undefined,
					},
					signatures: proof.signatures.map(signature => {
						return utils.arrayify(signature)
					})
				}

				if(proof.onChainClaimId !== '0') {
					// fetch on chain claim data from the claim id
					const claimData = await getOnChainClaimDataFromRequestId(proof.chainId, parseInt(proof.onChainClaimId))
					const onChainInfoHash = claimData.infoHash
					const calculatedInfoHash = hashClaimInfo({ parameters: serialize(proof.parameters)!, provider: proof.provider, context: proof.context, sessionId: expectedSessionId })

					// if the info hash is not same: return false
					if(onChainInfoHash.toLowerCase() !== calculatedInfoHash.toLowerCase()) {
						logger.error('Info hash mismatch')
						return result
					}
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

