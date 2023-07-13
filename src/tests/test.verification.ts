import { Proof } from '../types'
import { generateUuid } from '../utils'
import { reclaimprotocol } from '../'

jest.setTimeout(10000)

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

// const CORRECT_PROOF: Proof = {
// 	'chainId': 420,
// 	'onChainClaimId': '6607',
// 	'ownerPublicKey': '0217aff403993ec235b028c89e7148927a971fc1b6bcdc01d276ca48659f76b404',
// 	'parameters': {
// 		'method': 'GET',
// 		'responseSelections': [
// 			{ 'jsonPath': '$.currentUser', 'responseMatch': '\\{"id":182853,.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}', 'xPath': "//script[@id='js-react-on-rails-context']" }, { 'jsonPath': '$.hasBookface', 'responseMatch': '"hasBookface":true', 'xPath': "//script[@data-component-name='BookfaceCsrApp']" }], 'url': 'https://bookface.ycombinator.com/home'
// 	},
// 	'provider': 'http',
// 	'redactedParameters': "{\"url\":\"*************************************\",\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//script[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}]}",
// 	 'signatures': ['0xcb039fd715e58d08ee4f03aa3705fc8bf7a3cbef414456703a3940a2bee2703546de577e976bfadcfa4e26cab25d647d5913042d95ff5a336eba74d5ee6007851b'],
// 	 'templateClaimId': '0',
// 	 'timestampS': '1688383636',
// 	 'witnessAddresses': ['reclaim - node.questbook.app']
// }

// const CORRECT_PROOF: Proof = {
// 	chainId: 420,
// 	onChainClaimId: '6287',
// 	ownerPublicKey: '0313764ff3a1d897d57c6a64d8f45c715ddf9d17ceb6077bf882164f3657ec8409',
// 	parameters: { 'method': 'GET', 'responseSelections': [{ 'jsonPath': '$.currentUser', 'responseMatch': '\\{"id":182853,.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}', 'xPath': "//script[@id='js-react-on-rails-context']" }, { 'jsonPath': '$.hasBookface', 'responseMatch': '"hasBookface":true', 'xPath': "//script[@data-component-name='BookfaceCsrApp']" }], 'url': 'https://bookface.ycombinator.com/home' },
// 	provider: 'http',
// 	redactedParameters: "{\"url\":\"*************************************\",\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//script[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}]}",
// 	signatures: ['0xba9b52563c597e5fd48ff813284cc86f17525b629564fa1ab0e746d866a8f4585bb1ae75dde4721b1422cfd6c068f5993f53029f1e019c72407dc711e8d4f89b1c'],
// 	templateClaimId: '0',
// 	timestampS: '1688040806',
// 	witnessAddresses: ['reclaim-node.questbook.app']
// }

// const CORRECT_PROOF: Proof = {
// 	'chainId': 420,
// 	'onChainClaimId': '6313',
// 	'ownerPublicKey': '0313764ff3a1d897d57c6a64d8f45c715ddf9d17ceb6077bf882164f3657ec8409',
// 	'parameters': { 'method': 'GET', 'responseSelections': [{ 'jsonPath': '$.currentUser', 'responseMatch': '\\{"id":182853,.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}', 'xPath': "//script[@id='js-react-on-rails-context']" }, { 'jsonPath': '$.hasBookface', 'responseMatch': '"hasBookface":true', 'xPath': "//script[@data-component-name='BookfaceCsrApp']" }], 'url': 'https://bookface.ycombinator.com/home' },
// 	'provider': 'http',
// 	'redactedParameters': "{\"url\":\"*************************************\",\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//script[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}]}",
// 	'signatures': ['0x94ca093d369dff291901c8afdf819747088e533f4608f53093a2affcd1d7b9483dc4c58095b6ad61e52d60831e6100daa51456b86df1261cfb10cc42fba2d6e01b'],
// 	'templateClaimId': '0',
// 	'timestampS': '1688045858',
// 	'witnessAddresses': ['reclaim-node.questbook.app']
// }

const CORRECT_PROOF: Proof = {
	'chainId': 420,
	'onChainClaimId': '6317',
	'ownerPublicKey': '0313764ff3a1d897d57c6a64d8f45c715ddf9d17ceb6077bf882164f3657ec8409',
	'parameters': { 'emailAddress': 'sweta@creatoros.co' },
	'provider': 'google-login',
	'redactedParameters': '{"emailAddress":"*****@creatoros.co"}',
	'signatures': ['0x472b6e8777229377af2f3d14582fff3d941bef773cd4b98b567d86b652f664a0509f6682128137615d2103260f8217b96b4fbfa8b543c4c4bd4e2f3c711bec331b'],
	'templateClaimId': '0',
	'timestampS': '1688050096',
	'witnessAddresses': ['reclaim-node.questbook.app']
}

// const CORRECT_PROOF: Proof = {
// 	onChainClaimId: '1560',
// 	templateClaimId: generateUuid(),
// 	chainId: 420,
// 	provider: 'google-login',
// 	parameters: { 'emailAddress': 'swetasunofficial@gmail.com' },
// 	ownerPublicKey: '039549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
// 	timestampS: '1681968148',
// 	witnessAddresses: ['reclaim-node.questbook.app'],
// 	signatures: ['0x72846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
// 	redactedParameters: '{"emailAddress":"****************@gmail.com"}'
// }

const INCORRECT_SIGNATURE_PROOF: Proof = {
	...CORRECT_PROOF,
	signatures: ['0x86846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
}

const INCORRECT_OWNER_PUBLIC_KEY_PROOF: Proof = {
	...CORRECT_PROOF,
	ownerPublicKey: '038549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
}

const INCORRECT_TIMESTAMP_PROOF: Proof = {
	...CORRECT_PROOF,
	timestampS: '1681968149',
}

const INCORRECT_PARAMETER_PROOF: Proof = {
	...CORRECT_PROOF,
	parameters: { 'emailAddress': 'sweta@gmail.com' },
}

const INCORRECT_CLAIM_ID_PROOF: Proof = {
	...CORRECT_PROOF,
	onChainClaimId: '1561',
}

const INCORRECT_PROVIDER_PROOF: Proof = {
	...CORRECT_PROOF,
	provider: 'yc-login',
}