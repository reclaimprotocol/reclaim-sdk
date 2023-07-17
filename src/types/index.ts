import { BigNumber } from 'ethers'
import { CustomProvider } from '../ReclaimProtocol/CustomProvider'
import { HttpsProvider } from '../ReclaimProtocol/HttpsProvider'


export type ProofRequest = {
	/**
	 * Title of the request
	 */
	title: string
	/**
	 * Base callback url
	 */
	baseCallbackUrl: string
	/**
	 * Proofs requested by the application using HTTPsProvider or CustomProvider
	 */
	requestedProofs: (HttpsProvider | CustomProvider)[]
	/**
	 * Callback id
	 */
	callbackId?: string
	/**
	 * Context message for the proof request
	 */
	contextMessage?: string
	/**
	 * Context address for the proof request
	 * This is your users' ethereum wallet address
	 */
	contextAddress?: string
}

export type HttpsProviderParams = {
	/**
	 * Name of the website to be displayed on the UI
	 */
	name: string
	/**
	 * Logo url of the website to be displayed on the UI
	 */
	logoUrl: string
	/**
	 * Url of the website
	 */
	url: string
	/**
	 * Login url of the website
	 */
	loginUrl: string
	/**
	 * Login cookies of the website
	 */
	loginCookies: string[]
	/**
	 * Regex to extract the required data from the response
	 */
	responseSelection: responseSelection[]
}

export type ProviderParams =
	{
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
	| { provider: 'outlook-login', payload: {} }
	| { provider: 'codeforces-rating', payload: {} }
	| { provider: 'dunzo-last-order', payload: {} }
	| { provider: 'tinder-match-count', payload: {} }
	| { provider: 'mastodon-user', payload: {} }
	| { provider: 'spotify-premium', payload: {} }
	| { provider: 'spotify-account-type', payload: {} }
	| { provider: 'spotify-username', payload: {} }
	| { provider: 'spotify-email', payload: {} }
	| { provider: 'tumblr-follower', payload: {} }
	| { provider: 'swiggy-total-count', payload: {} }
	| { provider: 'wikipedia-user', payload: {} }
	| { provider: 'facebook-friends-count', payload: {} }
	| { provider: 'binance-asset-balance', payload: {} }
	| { provider: 'ebay-user', payload: {} }
	| { provider: 'flickr-user', payload: {} }
	| { provider: 'instagram-user', payload: {} }
	| { provider: 'blind-user', payload: {} }
	| { provider: 'chess-user', payload: {} }
	| { provider: 'codechef-rating', payload: {} }
	| { provider: 'bybit-balance', payload: {} }
	| { provider: 'groww-stock-balance', payload: {} }
	| { provider: 'devfolio-hackathon-count', payload: {} }
	| { provider: 'quora-user', payload: {} }
	| { provider: 'medium-followers-count', payload: {} }
	| { provider: 'lichess-username', payload: {} }
	| { provider: 'proton-mail', payload: {} }
	| { provider: 'soundcloud-username', payload: {} }
	| { provider: 'letterboxd-user', payload: {} }
	| { provider: 'uidai-aadhar', payload: {} }
	| { provider: 'uidai-dob', payload: {} }
	| { provider: 'uidai-address', payload: {} }
	| { provider: 'twitter-followers-count', payload: {} }
	| { provider: 'twitter-username', payload: {} }
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


export type responseSelection = {
	jsonPath?: string
	xPath?: string
	responseMatch: string
}

export type Claim = {
	templateClaimId: string
	context: string
} & ProviderParams

export type Template = {
	id: string
	sessionId: string
	name: string
	callbackUrl: string
	claims: Claim[]
}

export type ProofClaim = Omit<Claim, 'payload'> & {
	parameters: {
		[key: string]: string | number
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
	sessionId: string
	ownerPublicKey: string
	timestampS: string
	witnessAddresses: string[]
	signatures: string[]
	redactedParameters: string
	chainId: number
	extractedParameterValues?: {
		[key: string]: string | number
	}
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

export type ProofParameters = {
	[key: string]: string
}
