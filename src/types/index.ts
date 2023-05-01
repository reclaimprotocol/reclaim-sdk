import { BigNumber } from 'ethers'
import { GithubCommits, GithubPullRequests, GithubRepository, GithubRepositoryLang, GithubRepositoryTopics, KeyOf, QueryStringObject } from './utils'

export type ProviderParams =
	| {
			provider: 'google-login'
			parameters: {}
	  }
	| {
			provider: 'yc-login'
			parameters: {}
	  }
	| {
			provider: 'github-claim'
			parameters: GithubParams
	  }
	| {
			provider: 'github-contributed'
			parameters: GithubLoginParams<'github-contributed'>
	  }
	| {
			provider: 'github-commits'
			parameters: GithubLoginParams<'github-commits'>
	  }
	| {
			provider: 'github-issues'
			parameters: GithubLoginParams<'github-issues'>
	  }
	| {
			provider: 'github-languages'
			parameters: GithubLoginParams<'github-languages'>
	  }
	| {
			provider: 'github-pullRequests'
			parameters: GithubLoginParams<'github-pullRequests'>
	  }
      | {
        provider: 'http'
        parameters: {
            id: string
            urlParameters: {
                [key: string]: string
            }
        }
    }


export type ProviderName = ProviderParams['provider']

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

export type ApiType = keyof GithubApiProvider

export type GithubApi = {
    'github-topics': GithubRepositoryTopics
    'github-contributed': GithubRepository[]
    'github-languages': GithubRepositoryLang
    'github-commits': GithubCommits[]
    'github-pullRequests': GithubPullRequests[]
    'github-issues': GithubPullRequests[]
}

export type PartialObj<T> = {
    readonly [K in keyof T]: T[K] extends Array<infer U> ? Partial<U>[] : T[K]
}

export type GithubApiProvider = PartialObj<GithubApi>

export type GithubLoginParams<T extends ApiType> = {
    /** the github repo in the format `owner/repo` */
    repo: string
    /** query string for the path eg: per_page: 100 */
    qs?: QueryStringObject
    /** type of the provider eg: `github-commits` */
    type: T
    /** the response object to match with the provider */
    response?: GithubApiProvider[T]
    /** the array of keys which user wants to verify eg: ['sha', 'node_id'] in case of github-commits `type` */
    keys: KeyOf<GithubApiProvider[T]>[]
}

type GithubClaimType = 'issues' | 'commits' | 'repositories'

export type GithubParams = {
	/** github `url` type eg: `commits` */
	type: GithubClaimType

	/** repository name eg: {owner}/{repo} */
	repository: string

	/** query string for github search */
	queryString: string
}