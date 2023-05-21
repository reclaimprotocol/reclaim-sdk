import { ProviderParams } from '../types'


export class CustomProvider {
	private _params: ProviderParams

	constructor(params: ProviderParams) {
		this._params = params
	}

	get params(): ProviderParams {
		return this._params
	}
}