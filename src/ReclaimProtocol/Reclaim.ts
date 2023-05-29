import { Claim, ClaimProof, hashClaimInfo, verifyWitnessSignature } from '@reclaimprotocol/crypto-sdk'
import crypto from 'crypto'
import { utils } from 'ethers'
import P from 'pino'
import { Proof, ProofRequest, Template } from '../types'
import { generateCallbackUrl, generateUuid, getClaimWitnessOnChain, getOnChainClaimDataFromRequestId } from '../utils'
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
		const template: Template = {
			id: generateUuid(),
			name: request.title,
			callbackUrl: generateCallbackUrl(request.baseCallbackUrl, request.callbackId), // if callbackId is present, use it, else generate a new callback url
			claims: request.requestedProofs.map((requestedProof) => {
				return {
					templateClaimId: generateUuid(),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					provider: requestedProof.params.provider as any,
					payload: requestedProof.params.payload,
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
	verifyCorrectnessOfProofs = async(proofs: Proof[]): Promise<boolean> => {
		let result: boolean = false

		for(const proof of proofs) {
			// fetch on chain witness address for the claim
			const witnesses = await getClaimWitnessOnChain(proof.chainId, parseInt(proof.onChainClaimId))

			// if no witnesses are present: return false
			if(!witnesses.length) {
				logger.error('No witnesses found on chain')
				return result
			}

			const claim: Claim = {
				id: parseInt(proof.onChainClaimId),
				ownerPublicKey: Buffer.from(proof.ownerPublicKey, 'hex'),
				provider: proof.provider,
				timestampS: parseInt(proof.timestampS),
				witnessAddresses: witnesses,
				redactedParameters: proof.redactedParameters
			}

			const decryptedProof: ClaimProof = {
				parameters: JSON.stringify(proof.parameters),
				signatures: proof.signatures.map(signature => {
					return utils.arrayify(signature)
				})
			}
			// fetch on chain claim data from the request id
			const claimData = await getOnChainClaimDataFromRequestId(proof.chainId, proof.onChainClaimId)
			const onChainInfoHash = claimData.infoHash
			const calculatedInfoHash = hashClaimInfo({ parameters: decryptedProof.parameters, provider: proof.provider, context: '' }) //TODO: pass context from the app

			// if the info hash is not same: return false
			if(onChainInfoHash.toLowerCase() !== calculatedInfoHash.toLowerCase()) {
				logger.error('Info hash mismatch')
				return result
			}

			try {
				// verify the witness signature
				result = verifyWitnessSignature(claim, decryptedProof)
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
	 * function to generate hash of all the onChainClaimIds
	 * @param proofs
	 * @returns {string}
	 */
	generateProofId = (proofs: Proof[]): string => {
		const onChainClaimIdArray: string[] = []
		for(const proof of proofs) {
			const onChainClaimId = proof.onChainClaimId
			onChainClaimIdArray.push(onChainClaimId)
		}

		const concatenatedOnChainClaimId = onChainClaimIdArray.join('')

		// create hash of concatenatedClaimId
		return crypto.createHash('sha256').update(concatenatedOnChainClaimId).digest('hex')
	}
}

