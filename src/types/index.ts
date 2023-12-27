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
	/**
	 * master wallet address of the requestor
	 */
	requestorAddress?: string
	/**
	 * ephemeral public key of the requestor
	 */
	requestorPublicKey?: string
}

export type Context = {
	sessionId: string
	contextMessage: string
	contextAddress: string
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
	urlType?: UrlType
	/**
	 * Login url of the website
	 */
	loginUrl: string
	/**
	 * Login cookies of the website
	 */
	loginCookies?: string[]
	/**
	 * Regex to extract the required data from the response
	 */
	responseSelection: responseSelection[]

	/**
	 * Use ZK for this provider
	*/
	useZK: boolean
	headers?: HeadersType
	method?: 'GET' | 'POST'
	customInjection?: string
	parameters?: {
		[key: string]: string
	}
	bodySniff?: {
		enabled: boolean
		regex?: string
	}
	userAgent?: {
		ios?: string
		android?: string
	}
}

export type HeaderMap = { [key: string]: string }
export type UrlType = 'CONSTANT' | 'REGEX'

export type HttpsProviderParamsV2 = {
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
	 * which portions to select from a response.
	 * These are selected in order, xpath => jsonPath => regex
	 *
	 * These redactions are done client side and only the selected
	 * portions are sent to the witness. The witness will only be able
	 * to see the selected portions alongside the first line of the HTTP
	 * response (i.e. "HTTP/1.1 200 OK")
	 *
	 * To disable any redactions, pass an empty array
	 * */
	responseRedactions: ResponseRedactions[]
	/**
	 * The witness will use this list to check
	 * that the redacted response does indeed match
	 * all of the provided strings/regexes
	*/
	responseMatches: ResponseMatches[]
	method?: 'GET' | 'POST'
	bodySniff?: BodySniff
	customInjection?: string
	/**
	 * Specify the geographical location from where
	 * to proxy the request
	 */
	geoLocation?: string
}

export type BodySniff = {
	enabled: boolean
	regex: string
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
	| {
		provider: 'tumblr-follower'
		payload: {
			followingAccount: string
		}
	}
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
	| { provider: 'kaggle-username', payload: {} }
	| { provider: 'uber-rides', payload: {} }
	| {
		provider: 'http'
		payload: {
			metadata: {
				name: string
				logoUrl: string
			}
			url: string
			urlType: UrlType
			headers?: HeadersType
			method: 'GET' | 'POST'
			login: {
				url: string
			}
			responseSelections: {
				responseMatch: string
				xPath?: string
				jsonPath?: string
			}[]
			customInjection?: string
			parameters: {
				[key: string]: string
			}
			bodySniff?: {
				enabled: boolean
				regex?: string
			}
			userAgent?: {
				ios?: string
				android?: string
			}
			useZK: boolean
		}
	}


export type responseSelection = {
	jsonPath?: string
	xPath?: string
	responseMatch: string
}

export type ResponseRedactions = {
	/**
	* expect an HTML response, and to contain a certain xpath
	* for eg. "/html/body/div.a1/div.a2/span.a5"
	*/
	xPath?: string
	/**
	 * expect a JSON response, retrieve the item at this path
	 * using dot notation
	 * for e.g. 'email.addresses.0'
	 */
	jsonPath?: string
	/**
	 * select a regex match from the response
	 */
	regex?: string
}

export type ResponseMatches = {
	/**
	* "regex": the response must match the regex
	* "contains": the response must contain the provided
	*  string exactly
	*/
	type: 'regex' | 'contains'
	/**
	 * The string/regex to match against
	 */
	value: string
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
	/** master wallet address of the requestor */
	requestorAddress?: string
	/** ephemeral public key of the requestor */
	requestorPublicKey?: string
}

export type HeadersType = { [key: string]: string }

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
	ownerPublicKey: string
	timestampS: string
	witnessAddresses: string[]
	signatures: string[]
	redactedParameters: string
	epoch: number
	identifier: string
	extractedParameterValues?: {
		[key: string]: string | number
	}
} & (ProofClaim | httpProof)

export type SubmittedProof = {
	parameters: string
} & Proof

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


export type Options = {
	shortened?: boolean
}