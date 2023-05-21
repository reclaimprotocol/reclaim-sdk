import { HttpsProviderParams, ProviderParams } from '../types'


export class HttpsProvider {

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

	constructor(params: HttpsProviderParams) {
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
	}

	get params(): ProviderParams {
		return this._params
	}
}