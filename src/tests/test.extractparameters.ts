import { Proof } from '../types'
import { encodeBase64 } from '../utils'
import { reclaimprotocol } from '..'

describe('Extract parameters', () => {
	it('should extract parameters', () => {
		const selectionRegex = encodeBase64(CORRECT_REGEXES)
		const parametersExtracted = reclaimprotocol.utils.extractParameterValuesFromRegex(selectionRegex, proofs)

		expect(Object.keys(parametersExtracted!).length).toBe(2)
		expect(parametersExtracted['qb-empid']).toBe('9845')
		expect(parametersExtracted['creatoros-empid']).toBe('128356')

	})

	it('should return one parameter instead of two for incorrect regex', () => {
		const selectionRegex = encodeBase64(INCORRECT_REGEXES)

		const parametersExtracted = reclaimprotocol.utils.extractParameterValuesFromRegex(selectionRegex, proofs)
		expect(Object.keys(parametersExtracted).length).toBe(1)
	})

	it('should throw error for inconsistent regexes passed through the proof', () => {
		const selectionRegex = encodeBase64([])

		expect(() => reclaimprotocol.utils.extractParameterValuesFromRegex(selectionRegex, proofs)).toThrowError('Invalid number of proofs')
	})
})

const CORRECT_REGEXES = [
	"<span id='empid'>{{creatoros-empid}}</span>",
	'',
	"<span id='empid'>{{qb-empid}}</span>"
]

const INCORRECT_REGEXES = [
	"<span id='empid'>{{creatoros-empid}}</span>",
	'',
	"<span id='no-empid'>{{qb-empid}}</span>"
]


// const selectionRegex = 'WyI8c3BhbiBpZD0nZW1waWQnPnt7Y3JlYXRvcm9zLWVtcGlkfX08L3NwYW4+IiwiIiwiPHNwYW4gaWQ9J2VtcGlkJz57e3FiLWVtcGlkfX08L3NwYW4+Il0='
const proofs: Proof[] = [
	{
		'onChainClaimId': '2617',
		'templateClaimId':'0',
		'provider':'http',
		'parameters': {
			'url':'https://www.reddit.com',
			'method':'GET',
			'responseSelections':[
				{ 'responseMatch':"<span id='empid'>128356</span>" },
			]
		},
		'chainId':420,
		'ownerPublicKey':'03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
		'timestampS':'1684343138',
		'witnessAddresses':['reclaim-node.questbook.app'],
		'signatures':['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
		'redactedParameters':'{"url":"**********************@undefined"}'
	},
	{
		'onChainClaimId': '2617',
		'templateClaimId':'0',
		'provider':'http',
		'parameters': { 'emailAddress': 'abc@gmail.com' },
		'chainId':420,
		'ownerPublicKey':'03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
		'timestampS':'1684343138',
		'witnessAddresses':['reclaim-node.questbook.app'],
		'signatures':['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
		'redactedParameters':'{"url":"**********************@undefined"}'
	},
	{
		'onChainClaimId': '2617',
		'templateClaimId':'0',
		'provider':'http',
		'parameters': {
			'url':'https://www.reddit.com',
			'method':'GET',
			'responseSelections':[
				{ 'responseMatch':"<span id='empid'>9845</span>" },
			]
		},
		'chainId':420,
		'ownerPublicKey':'03057dd1b36d108cc0d9bced0565b6363ed910bc6522aa937092e1dc344614ddde',
		'timestampS':'1684343138',
		'witnessAddresses':['reclaim-node.questbook.app'],
		'signatures':['0xea2b6a7f7183ddea565a0cb569ce4ff2896f3b6f4dcdd2b5da5be1e67f8865086fcff48227336636a3a32c9cbf801d946351b00b411b2e129ad4b005acfb4fed1b'],
		'redactedParameters':'{"url":"**********************@undefined"}'
	},
]
