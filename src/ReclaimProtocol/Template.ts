import { RECLAIM_APP_URL, RECLAIM_HANDSHAKE_URL } from '../config'
import { Options, Template } from '../types'
import { encodeBase64, getCallbackIdFromUrl, getShortenedUrl } from '../utils'

/** Template instance */
export default class TemplateInstance {
	/**
   * Property template
   * @type {Template}
   */
	private _template: Template

	/**
   * Property regexes: base64 encoded regexes
   * @type {string}
   */
	private _regexes: string

	/**
   * Constructor
   * @param {Template} template
   */
	constructor(template: Template, regexes: string[][]) {
		this._template = template
		this._regexes = encodeBase64(regexes)
	}

	/**
   * Getter template
   * @return {Template}
   */
	get template(): Template {
		return this._template
	}

	/**
   * Getter id
   * @return {string}
   */
	get id(): string {
		return this._template.id
	}

	/**
   * Getter callbackId
   * @return {string}
   */
	get callbackId(): string {
		return getCallbackIdFromUrl(this._template.callbackUrl)
	}

	/**
   * Getter regexes: base64 encoded regexes
   * @return {string}
   */
	get expectedProofsInCallback(): string {
		return this._regexes
	}

	/**
   * function to get the reclaim url
   * @return {string}
   */
	getReclaimUrl = async({ shortened = true }: Options = { shortened: true }): Promise<string> => {
		if(!shortened) {
			return (
				RECLAIM_APP_URL + encodeURIComponent(JSON.stringify(this._template))
			)
		}

		const url = await getShortenedUrl(
			RECLAIM_APP_URL + encodeURIComponent(JSON.stringify(this._template))
		)
		return url
	}

	/**
	 * function to get the reclaim handshake url
	 * @return {string}
	 */
	getReclaimHandshakeUrl = async({ shortened = true }: Options = { shortened: true }): Promise<string> => {
		if(!shortened) {
			return (
				RECLAIM_HANDSHAKE_URL + encodeURIComponent(JSON.stringify(this._template))
			)
		}

		const url = await getShortenedUrl(
			RECLAIM_HANDSHAKE_URL + encodeURIComponent(JSON.stringify(this._template))
		)
		return url
	}
}
