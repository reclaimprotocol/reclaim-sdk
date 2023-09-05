import { SubmittedProof } from '../types'

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