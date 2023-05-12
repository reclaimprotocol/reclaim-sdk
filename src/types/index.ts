import { BigNumber } from 'ethers'

export type ProviderParams =
	| {
		provider: 'google-login'
		payload: {}
	}
	| {
		provider: 'yc-login'
		payload: {}
	}
	| {
		provider: 'github-claim'
		payload: GithubParams
	}
	| {
		provider: 'http'
		payload: {
			metadata: {
				name: string
				logoUrl: string
			}
			method: 'GET' | 'POST'
			url: string
			login: {
				url: string
				checkLoginCookies: string[]
			}
			responseSelections: responseSelection[]
			parameters: {
					[key: string]: string
			}
		}
	}


export type responseSelection = { responseMatch: string }

export type Claim = {
	templateClaimId: string
} & ProviderParams

export type Template = {
	id: string
	name: string
	callbackUrl: string
	claims: Claim[]
}

export type Proof = {
	onChainClaimId: number
	ownerPublicKey: string
	timestampS: number
	witnessAddresses: string[]
	signatures: string[]
	redactedParameters: string
	chainId: number
	provider: string
	parameters: {
		[key: string]: string
	}
}

export type RequestClaim = {
	infoHash: string
	owner: string
	timestampS: number
	claimId: BigNumber
}

type GithubClaimType = 'issues' | 'commits' | 'repositories' | 'pullRequests'

export type GithubParams = {
	/** github `url` type eg: `commits` */
	type: GithubClaimType

	/** repository name eg: {owner}/{repo} */
	repository: string

	/** query string for github search */
	searchQuery: SearchQueryObject
}

export type SearchQueryObject = {
	keywords: string[]
	qualifiers: Record<string, string[]>
}
