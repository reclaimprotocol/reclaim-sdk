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
			payload: GithubParams<'github-commits'>
	  }
	| {
			provider: 'github-issues'
			payload: GithubParams<'github-issues'>
	  }
	| {
			provider: 'github-pull-requests'
			payload: GithubParams<'github-pull-requests'>
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

export type ProofClaim = Omit<Claim, 'payload'> & {
	parameters: {
		[key: string]: string
	}
}

export type httpProof = Omit<Claim, 'payload'> & {
	parameters: {
		url?: string
		method?: 'GET' | 'POST'
		responseSelections?: responseSelection[]
	}
}

export type Proof = {
	onChainClaimId: string
	ownerPublicKey: string
	timestampS: string
	witnessAddresses: string[]
	signatures: string[]
	redactedParameters: string
	chainId: number
} & (ProofClaim | httpProof)

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
export type GithubClaimType = (typeof CLAIM_TYPE)[number]

export type GithubParams<T extends GithubClaimType> = {
	type: T
	repository: string
	searchQuery: SearchQueryObject
}

export type SearchQueryObject = {
	keywords: string[]
	qualifiers: Record<string, string[]>
}
