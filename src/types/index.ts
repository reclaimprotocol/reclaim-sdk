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
			provider: 'github-commits'
			parameters: GithubParams<'github-commits'>
	  }
	| {
			provider: 'github-issues'
			parameters: GithubParams<'github-issues'>
	  }
	| {
			provider: 'github-pull-requests'
			parameters: GithubParams<'github-pull-requests'>
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
} & Claim

export type RequestClaim = {
	infoHash: string
	owner: string
	timestampS: number
	claimId: BigNumber
}

export const CLAIM_TYPE = [
	'github-issues',
	'github-commits',
	'github-pull-requests',
] as const
type GithubClaimType = (typeof CLAIM_TYPE)[number]

type GithubParams<T extends GithubClaimType> = {
	type: T
	repository: string
	searchQuery: SearchQueryObject
}

type SearchQueryObject = {
	keywords: string[]
	qualifiers: Record<string, string[]>
}
