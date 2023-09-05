import { Proof } from '../types'
import { decodeBase64 } from '.'

export function validateParameterValuesFromRegex(expectedProofsInCallback: string, proofs: Proof[]) {
	// parse expectedProofsInCallback
	const templateRegexes = decodeBase64(expectedProofsInCallback)

	const proofsParams = proofs.map(p => Object.entries(p?.extractedParameterValues ?? {}))
	const params = new Map<string, string|number>(...proofsParams)
	const unusedParams = new Map(params)

	//replace placeholders with params
	const selectionRegexes: string[][] = []
	templateRegexes.forEach(regexes => {
		const rxs: string[] = []
		regexes.forEach(rx => {
			let updatedRegex = rx
			for(const [paramsKey, paramsValue] of params) {
				const m = `{{${paramsKey}}}`
				if(updatedRegex.includes(m)) {
					updatedRegex = updatedRegex.replace(m, paramsValue.toString())
					unusedParams.delete(paramsKey)
				}
			}

			rxs.push(updatedRegex)
		})
		selectionRegexes.push(rxs)
	})


	if(unusedParams.size > 0) {
		throw new Error(`Not all parameters were used in response selections: ${JSON.stringify(Object.fromEntries(unusedParams))}`)
	}

	if(selectionRegexes.length !== proofs.length) {
		throw new Error(`Number of proofs (${proofs.length}) does not match number of response selections (${selectionRegexes.length})`)
	}

	//get all responseMatches from all proofs
	const proofSelections = proofs.map(proof => {
		if(Array.isArray(proof.parameters.responseSelections)) {
			return new Set<string>(proof.parameters.responseSelections.map(selection => {
				return selection.responseMatch
			}))
		} else {
			return new Set<string>([''])
		}
	})

	// make sure that ALL selectionRegexes are proven

	selectionRegexes.forEach(rxs => {
		//go through all proofs
		let found = false
		for(const ps of proofSelections) {
			let ok = false
			// try only those proofs which have same number of elements
			if(ps.size === rxs.length) {
				ok = true
				// try to find match for each selection regex
				rxs.forEach(rx => {
					ok = ok && ps.has(rx)
				})
			}

			if(ok) {
				found = true
				break
			}
		}

		if(!found) {
			throw new Error('Response match not found')
		}
	})
}