import { SignedClaim } from '@reclaimprotocol/witness-sdk'
import serialize from 'canonicalize'
import { utils } from 'ethers'
import P from 'pino'
import { assertValidSignedClaim, hashClaimInfo, signatures } from '../crypto'
import { Proof, ProofRequest, SubmittedProof, Template } from '../types'
import { decodeContext, encodeContext, generateCallbackUrl, generateUuid, getCallbackIdFromUrl, getWitnessesForClaim, transformProofsToverify } from '../utils'
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
			requestorAddress: request.requestorAddress,
			requestorPublicKey: request.requestorPublicKey,
			claims: request.requestedProofs.map((requestedProof) => {
				return {
					templateClaimId: generateUuid(),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					provider: requestedProof.params.provider as any,
					payload: requestedProof.params.payload,
					context: encodeContext({ sessionId, contextMessage, contextAddress }, false),
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
			const witnesses = await getWitnessesForClaim(proof.epoch, proof.identifier, parseInt(proof.timestampS))
			// if no witnesses are present: return false
			if(!witnesses.length) {
				logger.error('No witnesses found for the claim')
				return result
			}

			try {
				const claim: SignedClaim = {
					claim: {
						owner: signatures.getAddress(Buffer.from(proof.ownerPublicKey, 'hex')),
						provider: proof.provider,
						timestampS: parseInt(proof.timestampS),
						context: proof.context,
						parameters: serialize(proof.parameters)!,
						epoch: proof.epoch,
						identifier: proof.identifier,
					},
					signatures: proof.signatures.map(signature => {
						return utils.arrayify(signature)
					})
				}
				// first decode ctx
				const decodedCtx = decodeContext(proof.context)
				// then encode it again with the expected sessionId
				const encodedCtx = encodeContext({ sessionId: expectedSessionId, contextMessage: decodedCtx.contextMessage, contextAddress: decodedCtx.contextAddress }, true)
				// then hash the claim info with the encoded ctx to get the identifier
				const calculatedIdentifier = hashClaimInfo({ parameters: serialize(proof.parameters)!, provider: proof.provider, context: encodedCtx })
				// check if the identifier matches the one in the proof
				if(calculatedIdentifier !== proof.identifier) {
					logger.error('Identifier mismatch')
					return result
				}

				// verify the witness signature
				assertValidSignedClaim(claim, witnesses)
				result = true
				logger.info(`isCorrectProof: ${result}`)
			} catch(error) {
				// if the witness signature is not valid: return false
				logger.error(`${error}`)
				result = false
			}
		}

		return result
	}

	/**
	 * function to get the claimIds from the proofs
	 * @param proofs
	 * @returns {string}
	 */
	 getClaimIdsFromProofs = (proofs: Proof[]): string[] => {
		const claimIdArray: string[] = []
		for(const proof of proofs) {
			const claimId = proof.identifier
			claimIdArray.push(claimId)
		}

		return claimIdArray
	}
}

