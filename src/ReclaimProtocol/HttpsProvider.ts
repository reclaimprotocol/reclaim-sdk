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
			url: '',
			login: {
				url: '',
				checkLoginCookies: ['']
			},
			responseSelections:  [{
				responseMatch: ''
			}],
			parameters: {},
		}
	}

	// regex to match the response
	private _regex: string

	constructor(params: HttpsProviderParams) {
		// check if params are of type HttpsProviderParams
		if(!params.name || !params.logoUrl || !params.url || !params.loginUrl || !params.loginCookies || !params.selectionRegex) {
			throw new Error('Invalid parameters passed to HttpsProvider')
		}

		// set params
		this._params.payload = {
			metadata: {
				name: params.name,
				logoUrl: params.logoUrl
			},
			url: params.url,
			login: {
				url: params.loginUrl,
				checkLoginCookies: params.loginCookies
			},
			responseSelections:  [
				 { responseMatch: params.selectionRegex }
			],
			parameters: {},
		}

		// set regex
		this._regex = params.selectionRegex
	}

	// getters
	get params(): ProviderParams {
		return this._params
	}

	get regex(): string {
		return this._regex
	}
}