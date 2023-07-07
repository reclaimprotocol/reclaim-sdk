import {Proof, ProofParameters} from '../types'
import { encodeBase64 } from '../utils'
import { reclaimprotocol } from '..'

describe('Validate parameters', () => {
	it('should validate parameters', () => {
		const selectionRegex = encodeBase64(CORRECT_REGEXES)
		expect(()=>reclaimprotocol.utils.validateParameterValuesFromRegex(selectionRegex, PROOFS_WITHOUT_XPATH, REGEX_PARAMS)).not.toThrowError()

	})

	it('should validate parameters with xPath', () => {
		const selectionRegex = encodeBase64(CORRECT_XPATH_REGEXES)
		expect(()=>reclaimprotocol.utils.validateParameterValuesFromRegex(selectionRegex, PROOFS_WITH_XPATH, REGEX_XPATH_PARAMS)).not.toThrowError()

	})

	it('should throw error with bad parameters with xPath', () => {
		const selectionRegex = encodeBase64(CORRECT_XPATH_REGEXES)
		expect(()=>reclaimprotocol.utils.validateParameterValuesFromRegex(selectionRegex, PROOFS_WITH_XPATH, INCORRECT_REGEX_XPATH_PARAMS)).toThrowError()

	})

	it('should throw error with bad parameters with xPath', () => {
		const selectionRegex = encodeBase64(CORRECT_XPATH_REGEXES)
		expect(()=>reclaimprotocol.utils.validateParameterValuesFromRegex(selectionRegex, PROOFS_WITH_XPATH, INCORRECT_REGEX_XPATH_PARAMS_1)).toThrowError()

	})

	it('should not find match', () => {
		const selectionRegex = encodeBase64(INCORRECT_REGEXES)
		expect(()=>reclaimprotocol.utils.validateParameterValuesFromRegex(selectionRegex, PROOFS_WITHOUT_XPATH, REGEX_PARAMS)).toThrowError("Response match not found")
	})

	it('should throw error for inconsistent regexes passed through the proof', () => {
		const selectionRegex = encodeBase64([])
		expect(() => reclaimprotocol.utils.validateParameterValuesFromRegex(selectionRegex, PROOFS_WITHOUT_XPATH, REGEX_PARAMS)).toThrowError('Not all parameters were used in response selections')
	})
})

const CORRECT_REGEXES = [
	["<div>abc{{some_value}}def</div>", "<span id='empid'>{{creatoros-empid}}</span>"],
	[''],
	["<span id='empid'>{{qb-empid}}</span>"]
]

const REGEX_PARAMS:ProofParameters = {
	"creatoros-empid":"128356",
	"qb-empid":"9845",
	"some_value":"123",
}

const INCORRECT_REGEXES = [
	["<span id='empid'>{{creatoros-empid}}</span>", "<div>abc{{some_value}}deg</div>"],
	[''],
	["<span id='no-empid'>{{qb-empid}}</span>"]
]

const CORRECT_XPATH_REGEXES = [
	['\\{"id":{{YC_USER_ID}},.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}',
		'"hasBookface":true'],
]

const REGEX_XPATH_PARAMS:ProofParameters = {
	"YC_USER_ID":"182853",
}

const INCORRECT_REGEX_XPATH_PARAMS:ProofParameters = {
	"YC_USER_ID":"182854",
}

const INCORRECT_REGEX_XPATH_PARAMS_1:ProofParameters = {
	"YC_USER_ID":"182853",
	"hasBookface":"true" // there is no parameter "hasBookface" in regex match
}

// const selectionRegex = 'WyI8c3BhbiBpZD0nZW1waWQnPnt7Y3JlYXRvcm9zLWVtcGlkfX08L3NwYW4+IiwiIiwiPHNwYW4gaWQ9J2VtcGlkJz57e3FiLWVtcGlkfX08L3NwYW4+Il0='
const PROOFS_WITHOUT_XPATH: Proof[] = [
	{
		'onChainClaimId': '2617',
		'templateClaimId': '0',
		'provider': 'http',
		'parameters': {
			'url': 'https://www.reddit.com',
			'method': 'GET',
			'responseSelections': [
				{ 'responseMatch': "<span id='empid'>9845</span>" },
			]
		},
		'chainId': 420,
		'ownerPublicKey': '03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
		'timestampS': '1684343138',
		'witnessAddresses': ['reclaim-node.questbook.app'],
		'signatures': ['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
		'redactedParameters': '{"url":"**********************@undefined"}'
	},
	{
		'onChainClaimId': '2617',
		'templateClaimId': '0',
		'provider': 'http',
		'parameters': {
			'url': 'https://www.reddit.com',
			'method': 'GET',
			'responseSelections': [
				{ 'responseMatch': "<div>abc123def</div>" },
				{ 'responseMatch': "<span id='empid'>128356</span>" },

			]
		},
		'chainId': 420,
		'ownerPublicKey': '03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
		'timestampS': '1684343138',
		'witnessAddresses': ['reclaim-node.questbook.app'],
		'signatures': ['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
		'redactedParameters': '{"url":"**********************@undefined"}'
	},
	{
		'onChainClaimId': '2617',
		'templateClaimId': '0',
		'provider': 'http',
		'parameters': { 'emailAddress': 'abc@gmail.com' },
		'chainId': 420,
		'ownerPublicKey': '03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
		'timestampS': '1684343138',
		'witnessAddresses': ['reclaim-node.questbook.app'],
		'signatures': ['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
		'redactedParameters': '{"url":"**********************@undefined"}'
	},

]

const PROOFS_WITH_XPATH: Proof[] = [
	{
		'chainId': 420,
		'onChainClaimId': '6607',
		'ownerPublicKey': '0217aff403993ec235b028c89e7148927a971fc1b6bcdc01d276ca48659f76b404',
		'parameters': {
			'method': 'GET',
			'responseSelections': [
				{
					'jsonPath': '$.currentUser',
					'responseMatch': '\\{"id":182853,.*?waas_admin.*?:{.*?}.*?:\\{.*?}.*?(?:full_name|first_name).*?}',
					'xPath': "//script[@id='js-react-on-rails-context']"
				},
				{
					'jsonPath': '$.hasBookface',
					'responseMatch': '"hasBookface":true',
					'xPath': "//script[@data-component-name='BookfaceCsrApp']"
				}],
			'url': 'https://bookface.ycombinator.com/home'
		},
		'provider': 'http',
		'redactedParameters': "{\"url\":\"*************************************\",\"method\":\"GET\",\"responseSelections\":[{\"jsonPath\":\"$.currentUser\",\"responseMatch\":\"\\\\{\\\"id\\\":182853,.*?waas_admin.*?:{.*?}.*?:\\\\{.*?}.*?(?:full_name|first_name).*?}\",\"xPath\":\"//script[@id='js-react-on-rails-context']\"},{\"jsonPath\":\"$.hasBookface\",\"responseMatch\":\"\\\"hasBookface\\\":true\",\"xPath\":\"//script[@data-component-name='BookfaceCsrApp']\"}]}",
		'signatures': ['0xcb039fd715e58d08ee4f03aa3705fc8bf7a3cbef414456703a3940a2bee2703546de577e976bfadcfa4e26cab25d647d5913042d95ff5a336eba74d5ee6007851b'],
		'templateClaimId': '0',
		'timestampS': '1688383636',
		'witnessAddresses': ['reclaim - node.questbook.app'],
	},
]
