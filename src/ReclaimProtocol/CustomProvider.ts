import { ProviderParams } from '../types'


export class CustomProvider {
	private _params: ProviderParams

	constructor(params: ProviderParams) {
		// check if params are of type ProviderParams
		if(!params.provider || !params.payload) {
			throw new Error('Invalid parameters passed to CustomProvider')
		}

		this._params = params
	}

	get params(): ProviderParams {
		return this._params
	}
}