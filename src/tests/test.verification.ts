import { Proof, responseSelection } from '../types'
import { generateUuid } from '../utils'
import { reclaimprotocol } from '../'

describe('Verification', () => {
	it('should pass signature verification', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([CORRECT_PROOF])
		expect(result).toBe(true)
	})

	it('should fail signature verification for incorrect signature', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([INCORRECT_SIGNATURE_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect owner public key', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([INCORRECT_OWNER_PUBLIC_KEY_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect timestamp', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([INCORRECT_TIMESTAMP_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect parameter', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([INCORRECT_PARAMETER_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect claim id', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([INCORRECT_CLAIM_ID_PROOF])
		expect(result).toBe(false)
	})

	it('should fail for incorrect provider', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs([INCORRECT_PROVIDER_PROOF])
		expect(result).toBe(false)
	})
})

describe('Extract parameters', () => {
	it('should extract parameters', () => {
		const responseSelection: responseSelection[] = [
			{
				responseMatch: '<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>{{username}}</span>.*?<span>{{karma}} karma</span>'
			},
			{
				responseMatch: '<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>{{user}}</span>.*?<span>{{dharma}} karma</span>'
			}
		]
		const proof: Proof = {
			'onChainClaimId': '2617',
			'templateClaimId':'0',
			'provider':'http',
			'parameters': {
				'url':'https://www.reddit.com',
				'method':'GET',
				'responseSelections':[
					{ 'responseMatch':'<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>Hairy-Firefighter</span>.*?<span>10 karma</span>' },
					{ 'responseMatch':'<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>Hairy</span>.*?<span>20 karma</span>' }
				]
			},
			'chainId':420,
			'ownerPublicKey':'03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
			'timestampS':'1684343138',
			'witnessAddresses':['reclaim-node.questbook.app'],
			'signatures':['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
			'redactedParameters':'{"url":"**********************@undefined"}'
		}
		const parametersExtracted = reclaimprotocol.utils.extractValuesFromParameters(responseSelection, proof)

		expect(Object.keys(parametersExtracted).length).toBe(4)
		// expect(parametersExtracted['username']).toBe('Hairy-Firefighter')
		// expect(parametersExtracted['karma']).toBe('10')

	})

	it('should return empty parameter object', () => {
		const responseSelection: responseSelection[] = [
			{
				responseMatch: '<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“></span>.*?<span> karma</span>'
			}
		]
		const proof: Proof = {
			'onChainClaimId': '2617',
			'templateClaimId':'0',
			'provider':'http',
			'parameters': {
				'url':'https://www.reddit.com',
				'method':'GET',
				'responseSelections':[
					{ 'responseMatch':'<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>Hairy-Firefighter</span>.*?<span>10 karma</span>' }
				]
			},
			'chainId':420,
			'ownerPublicKey':'03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
			'timestampS':'1684343138',
			'witnessAddresses':['reclaim-node.questbook.app'],
			'signatures':['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
			'redactedParameters':'{"url":"**********************@undefined"}'
		}
		const parametersExtracted = reclaimprotocol.utils.extractValuesFromParameters(responseSelection, proof)
		expect(Object.keys(parametersExtracted).length).toBe(0)
	})

	it('should throw incorrect response selection', () => {
		const responseSelection: responseSelection[] = [
			{
				responseMatch: '<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>{{username}}</span>.*?<span>{{karma}} karma</span>'
			},
			{
				responseMatch: '<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>{{username}}</span>.*?<span>{{karma}} karma</span>'
			}
		]
		const proof: Proof = {
			'onChainClaimId': '2617',
			'templateClaimId':'0',
			'provider':'http',
			'parameters': {
				'url':'https://www.reddit.com',
				'method':'GET',
				'responseSelections':[
					{ 'responseMatch':'<span class=\“_2BMnTatQ5gjKGK5OWROgaG\“>Hairy-Firefighter</span>.*?<span>10 karma</span>' }
				]
			},
			'chainId':420,
			'ownerPublicKey':'03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
			'timestampS':'1684343138',
			'witnessAddresses':['reclaim-node.questbook.app'],
			'signatures':['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
			'redactedParameters':'{"url":"**********************@undefined"}'
		}
		expect(() => reclaimprotocol.utils.extractValuesFromParameters(responseSelection, proof)).toThrow('Invalid response selections')
	})
})


const CORRECT_PROOF: Proof = {
	onChainClaimId: '1560',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'google-login',
	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968148',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_SIGNATURE_PROOF: Proof = {
	onChainClaimId: '1560',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'google-login',
	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968148',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x86846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_OWNER_PUBLIC_KEY_PROOF: Proof = {
	onChainClaimId: '1560',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'google-login',
	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
	ownerPublicKey: '038549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968148',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_TIMESTAMP_PROOF: Proof = {
	onChainClaimId: '1560',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'google-login',
	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968149',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_PARAMETER_PROOF: Proof = {
	onChainClaimId: '1560',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'google-login',
	parameters: { 'emailAddress': 'sweta@gmail.com' },
	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968148',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_CLAIM_ID_PROOF: Proof = {
	onChainClaimId: '1561',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'google-login',
	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968148',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}

const INCORRECT_PROVIDER_PROOF: Proof = {
	onChainClaimId: '1560',
	templateClaimId: generateUuid(),
	chainId: 420,
	provider: 'yc-login',
	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
	timestampS: '1681968148',
	witnessAddresses: ['reclaim-node.questbook.app'],
	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
}