import { Template, Claim as TemplateClaim, Proof } from "../types";
import { generateUuid } from "../utils";
import Connection from "./Connection";
import { Wallet } from 'ethers'
import { verifyWitnessSignature, Claim, ClaimProof } from "@reclaimprotocol/reclaim-crypto-sdk";
import { RECLAIM_APP_URL } from "../config";

/** Reclaim class */
export class Reclaim { 

    /**
     * Connect to Reclaim
     * @param applicationName - name of the application
     * @param claims - providers to get claims
     * @returns {Promise<Connection>}
     */
    connect = async (applicationName: string, claims: TemplateClaim[], callbackUrl: string): Promise<Connection> => {
        const template: Template = {
            id: generateUuid(),
            name: applicationName,
            callbackUrl: callbackUrl,
            claims: claims,
        }

        return new Connection(template, 'creatorPrivateKey')
    }

    /**
     * 
     * @param proofs proofs returned by the callback URL
     * @returns {msg: boolean} boolean value denotes if the verification was successful or failed
     */
    verifyWitnessSignatures = (proofs: Proof[]): {"msg": boolean} => {
        proofs.forEach(proof => {
            const claim: Claim = {
                id: proof.onChainClaimId,
                ownerPublicKey: Buffer.from(proof.ownerPublicKey, 'base64'),
                provider: proof.provider,
                timestampS: proof.timestampS,
                witnessAddresses: proof.witnessAddresses,
                redactedParameters: proof.redactedParameters
            }

            const decryptedProof: ClaimProof = {
                parameters: JSON.stringify(proof.params),
                signatures: proof.signatures.map(signature => {
                    return Buffer.from(signature)
                })
            }
            try {
                verifyWitnessSignature(claim, decryptedProof)
            } catch (error) {
                return { "msg": false }
            }
        })

        return {"msg": true}
    }

}