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
			responseSelections: [{
				jsonPath: '',
				xPath: '',
				responseMatch: ''
			}],
			useZk: true,
			parameters: {},
		}
	}

	// regex to match the response
	private _regex: string[]

	constructor(params: HttpsProviderParams) {
		// check if params are of type HttpsProviderParams
		if(!params.name || !params.logoUrl || !params.url || !params.loginUrl || !params.loginCookies || !params.responseSelection) {
			throw new Error('Invalid parameters passed to HttpsProvider')
		}

		// check if user has passed useZk as true or false
		if(params.useZk !== true && params.useZk !== false) {
			throw new Error('Invalid value for useZk')
		}

		// set params
		this._params.payload = {
			...this._params.payload,
			metadata: {
				name: params.name,
				logoUrl: params.logoUrl
			},
			method: params.method ? params.method : 'GET',
			body: params.body ? params.body : '',
			headers: params.headers ? params.headers : [],
			url: params.url,
			login: {
				url: params.loginUrl,
				checkLoginCookies: params.loginCookies
			},
			responseSelections: params.responseSelection,
			parameters: {},
			useZk: params.useZk,
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