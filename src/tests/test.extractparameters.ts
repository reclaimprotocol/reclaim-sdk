import { Proof, responseSelection } from '../types'
import { reclaimprotocol } from '..'

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
		const parametersExtracted = reclaimprotocol.utils.extractParameterValues(responseSelection, proof)

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
		const parametersExtracted = reclaimprotocol.utils.extractParameterValues(responseSelection, proof)
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
		expect(() => reclaimprotocol.utils.extractParameterValues(responseSelection, proof)).toThrow('Invalid response selections')
	})
})