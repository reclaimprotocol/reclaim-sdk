import { HttpsProviderParams, ProviderParams } from '../types'


export class HttpsProvider {

	// params for the provider
	private _params: ProviderParams = {
		provider: 'http',
		payload: {
			metadata: {
				name: '',
				logoUrl: ''
			},
			method: 'GET',
			urlType: 'REGEX',
			url: '',
			login: {
				url: ''
			},
			responseSelections: [{
				jsonPath: '',
				xPath: '',
				responseMatch: ''
			}],
			useZK: true,
			parameters: {},
		}
	}

	// regex to match the response
	private _regex: string[]

	constructor(params: HttpsProviderParams) {
		// check if params are of type HttpsProviderParams
		if(!params.name || !params.logoUrl || !params.url || !params.loginUrl || !params.responseSelection) {
			throw new Error('Invalid parameters passed to HttpsProvider')
		}

		// check if user has passed useZK as true or false
		if(params.useZK !== true && params.useZK !== false) {
			throw new Error('Invalid value for useZK')
		}

		// set params
		this._params.payload = {
			...this._params.payload,
			metadata: {
				name: params.name,
				logoUrl: params.logoUrl
			},
			url: params.url,
			urlType: params.urlType ? params.urlType : 'REGEX',
			headers: params.headers ? params.headers : {},
			method: params.method ? params.method : 'GET',
			login: {
				url: params.loginUrl,
			},
			responseSelections: params.responseSelection,
			parameters: {},
			customInjection: params.customInjection ? params.customInjection : null,
			bodySniff: params.bodySniff ? params.bodySniff : null,
			userAgent: params.userAgent ? params.userAgent : null,
			useZK: params.useZK,
		}

		// set regex
		this._regex = params.responseSelection.map((selection) => {
			return selection.responseMatch
		})
	}

	// getters
	get params(): ProviderParams {
		return this._params
	}

	get regex(): string[] {
		return this._regex
	}
}
