import { Claim, ClaimProof, hashClaimInfo, verifyWitnessSignature } from '@reclaimprotocol/crypto-sdk'
import { utils } from 'ethers'
import P from 'pino'
import { Claim as TemplateClaim, Proof, Template } from '../types'
import { generateUuid, getClaimWitnessOnChain, getOnChainClaimDataFromRequestId } from '../utils'
import Connection from './Connection'

const logger = P()

/** Reclaim class */
export class Reclaim {

	/**
     * Connect to Reclaim
     * @param applicationName - name of the application
     * @param claims - providers to get claims
     * @returns {Connection}
     */
	connect = (applicationName: string, claims: TemplateClaim[], callbackUrl: string): Connection => {
		const template: Template = {
			id: generateUuid(),
			name: applicationName,
			callbackUrl: callbackUrl,
			claims: claims,
		}

		return new Connection(template)
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
}

