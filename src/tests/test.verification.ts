import { SubmittedProof } from '../types'
import { reclaimprotocol } from '../'

jest.setTimeout(15000)

describe('Verification', () => {
	it('should pass signature verification', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [CORRECT_PROOF])
		expect(result).toBe(true)
	})

	it('should fail signature verification for incorrect signature', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [INCORRECT_SIGNATURE_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect owner public key', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [INCORRECT_OWNER_PUBLIC_KEY_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect timestamp', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [INCORRECT_TIMESTAMP_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect parameter', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [INCORRECT_PARAMETER_PROOF])
		expect(result).toBe(false)
	})

	it('should fail signature verification for incorrect claim id', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [INCORRECT_CLAIM_ID_PROOF])
		expect(result).toBe(false)
	})

	it('should fail for incorrect provider', async() => {
		const reclaim = new reclaimprotocol.Reclaim()
		const result = await reclaim.verifyCorrectnessOfProofs(EXPECTED_SESSION_ID, [INCORRECT_PROVIDER_PROOF])
		expect(result).toBe(false)
	})
})
const EXPECTED_SESSION_ID = ''

const CORRECT_PROOF: SubmittedProof = {
	templateClaimId: '8ba32de9-4ada-44ba-9adf-0916c62ea03e',
	provider: 'google-login',
	parameters: '{"emailAddress":"amanzrx4@gmail.com"}',
	ownerPublicKey: '02d0fb133ce9b2ebe26e91310a4554acf95afd72d68855fee1999b3ead8ae0a744',
	timestampS: '1694771941',
	witnessAddresses: ['https://reclaim-node.questbook.app'],
	signatures: [
		'0x9b0122c84780224eea0e9a61291bab3c7bc041ccd022fe2dea06d17d4262289a15f728f2e2e0e75c3a602ab94df827bcabe199510ca40753cbd281e7234be5ad1b'
	],
	context: '',
	redactedParameters: '{"emailAddress":"********@gmail.com"}',
	epoch: 2,
	identifier: '0x6316682c203b1257be4d09498096d03106bf44649c54888e01273b97be36e3ee'
}

// const CORRECT_PROOF: SubmittedProof = {
// 	'templateClaimId': '0',
// 	'provider': 'google-login',
// 	'parameters': '{"emailAddress":"sweta@creatoros.co"}',
// 	'ownerPublicKey': '03f9d34be41e082528d5e8541cf1d77bc88a1727612479b16e29e80810a1c8e1be',
// 	'timestampS': '1691839255',
// 	'witnessAddresses': [
// 	  'https://reclaim-node.questbook.app'
// 	],
// 	'signatures': [
// 	  '0xbbafd90ff1fa6e40fbae421a44a4d1cb84b48067d2407245fd46aa02633b8a21716a6ebe2f8cca22b8f96b0f3d78847c677755e95e2cf18abef492d0019e28f71b'
// 	],
// 	'redactedParameters': '{"emailAddress":"*****@creatoros.co"}',
// 	'context': '{"contextAddress":"0x0","contextMessage":"0xe37a4cb1f11d7989933d53d8c243b03701a887ed26c0d37e752e0749b463cf67","sessionId":"2a61da2f-e3b8-4ce5-a4cc-22964890aea0"}',
// 	'epoch': 2,
// 	'identifier': '0x57c8e8c8a1765afcfd5667d8a6465ebb8bcf5218f33a717f2138a3ba22bf1549'
// }

// const CORRECT_PROOF: SubmittedProof = {
// 	'chainId': 420,
// 	'context': '0xd05fc78ec74a76bcbb3ac656174b922a8b817f35a1bba793da26a058291ebc250x0',
// 	'epoch': 1,
// 	'extractedParameterValues': {
// 		  'YC_USER_ID': '182853'
// 	},
// 	'identifier': '0x76b12e5ad42cc9a26156436ba5ce2148b1826eb8964efbd491b87a995e68a8d7',
// 	'ownerPublicKey': '03f9d34be41e082528d5e8541cf1d77bc88a1727612479b16e29e80810a1c8e1be',
// 	'parameters': "{\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//*[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}],\"url\":\"https://bookface.ycombinator.com/home\"}",
// 	'provider': 'http',
// 	'redactedParameters': "{\"url\":\"*************************************\",\"method\":\"***\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"xPath\":\"//*[@id='js-react-on-rails-context']\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\"},{\"jsonPath\":\"$.hasBookface\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\",\"responseMatch\":\"\\\"hasBookface\\\":true\"}]}",
// 	'signatures': [
// 		  '0x4d8299cd0a45b173ab8ad57e5b3779e18c068a6701fa6ea88c3534a7fd6de0cb3dc8e376385efb04fd603cbc77d0877b2d2f50e5d4f0c280ee069bf0aca543b91c'
// 	],
// 	'templateClaimId': '0',
// 	'timestampS': '1690776029',
// 	'witnessAddresses': [
// 		  'reclaim-node.questbook.app'
// 	]
// }

// const CORRECT_PROOF: SubmittedProof = {
// 	'chainId': 420,
// 	'context': '0xb6d6fb002c789cae7ee1bb3b184dbcbe53d20357f824466057c7e3f1579c7c800x0',
// 	'extractedParameterValues': {
// 	  'YC_USER_ID': '182853'
// 	},
// 	'onChainClaimId': '7492',
// 	'ownerPublicKey': '03f9d34be41e082528d5e8541cf1d77bc88a1727612479b16e29e80810a1c8e1be',
// 	'parameters': "{\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//*[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}],\"url\":\"https://bookface.ycombinator.com/home\"}",
// 	'provider': 'http',
// 	'redactedParameters': "{\"method\":\"***\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//*[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}],\"url\":\"https://bookface.ycombinator.com/home\"}",
// 	'sessionId': '9a927b04-6443-4db9-94fc-9077f766b74b',
// 	'signatures': [
// 	  '0x7005795aedaf2c092efc9f8af8dc3c37ebd3acec59ae3b91a450f525125f528c56ff16351ab4aee308e3c6b66f202bfe643a2024963b69ac86b2a4165eb39bed1c'
// 	],
// 	'templateClaimId': '0',
// 	'timestampS': '1689564494',
// 	'witnessAddresses': [
// 	  'reclaim-node.questbook.app'
// 	]
// }

// const CORRECT_PROOF_1: Proof = {
// 	'onChainClaimId': '7485',
// 	'context': '0xb6d6fb002c789cae7ee1bb3b184dbcbe53d20357f824466057c7e3f1579c7c800x0',
// 	'owner': '0x24d68478e8568c27b72ded794d55338a115234b4',
// 	'parameters': "{\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//*[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}],\"url\":\"https://bookface.ycombinator.com/home\"}", 'provider': 'http', 'timestampS': 1689502428 }

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

const INCORRECT_SIGNATURE_PROOF: SubmittedProof = {
	...CORRECT_PROOF,
	signatures: ['0x86846dc92c08f27c646f87b9e58e3abd20005621c9113ae9c3718a6f71d882511b43b3f373b4e941d7d5636106dfdcf9807496d6b9f1a5be8320fe2a1afebf521c'],
}

const INCORRECT_OWNER_PUBLIC_KEY_PROOF: SubmittedProof = {
	...CORRECT_PROOF,
	ownerPublicKey: '038549ccde10c559c979eb826075e9274ed8d9439e299e46f752fc8e9cd1e0647f',
}

const INCORRECT_TIMESTAMP_PROOF: SubmittedProof = {
	...CORRECT_PROOF,
	timestampS: '1681968149',
}

const INCORRECT_PARAMETER_PROOF: SubmittedProof = {
	...CORRECT_PROOF,
	parameters: '{"emailAddress": "sweta@gmail.com"}',
}

const INCORRECT_CLAIM_ID_PROOF: SubmittedProof = {
	...CORRECT_PROOF,
	identifier: '0x1234',
}

const INCORRECT_PROVIDER_PROOF: SubmittedProof = {
	...CORRECT_PROOF,
	provider: 'yc-login',
}