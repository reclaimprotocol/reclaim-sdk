import { Reclaim } from '../Reclaim'
import { Proof } from '../types'

describe('Verification', () => {
	it('should verify a valid signature', async() => {
		const reclaim = new Reclaim()
		const result = await reclaim.verifyCorrectnessOfProof([CORRECT_PROOF])
		expect(result).toBe(true)
	})

	it('should not verify an invalid signature', async() => {
		const reclaim = new Reclaim()
		const result = await reclaim.verifyCorrectnessOfProof([INCORRECT_PROOF])
		expect(result).toBe(false)
	})
})

const CORRECT_PROOF: Proof = {
	onChainClaimId: 1560,
	templateClaimId: 0,
	chainId: 420,
	provider: 'google-login',
	'parameters': { 'emailAddress': 'swetasunofficial@gmail.com' },
	'ownerPublicKey': '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	'timestampS': 1681968148,
	'witnessAddresses': ['reclaim-node.questbook.app'],
	'signatures': ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	'redactedParameters': '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_PROOF: Proof = {
	onChainClaimId: 1560,
	templateClaimId: 0,
	chainId: 420,
	provider: 'google-login',
	'parameters': { 'emailAddress': 'swetasunofficial@gmail.com' },
	'ownerPublicKey': '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	'timestampS': 1681968148,
	'witnessAddresses': ['reclaim-node.questbook.app'],
	'signatures': ['0x86846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	'redactedParameters': '{"emailAddress":"****************@gmail.com"}'
}