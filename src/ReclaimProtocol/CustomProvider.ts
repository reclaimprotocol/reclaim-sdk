import { ProviderParams } from '../types'


export class CustomProvider {
	// params for the provider
	private _params: ProviderParams

	constructor(params: ProviderParams) {
		// check if params are of type ProviderParams
		if(!params.provider || !params.payload) {
			throw new Error('Invalid parameters passed to CustomProvider')
		}

		this._params = params
	}

	// getters
	get params(): ProviderParams {
		return this._params
	}

	get regex(): string[] {
		return ['']
	}
}