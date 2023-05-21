import { RECLAIM_APP_URL } from '../config'
import { Template } from '../types'
import { getCallbackIdFromUrl } from '../utils'

/** Template instance */
export default class TemplateInstance {

	/**
     * Property template
     * @type {Template}
     */
	private _template: Template

	/**
     * Constructor
     * @param {Template} template
    */
	constructor(template: Template) {
		this._template = template
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
	get getCallbackId(): string {
		return getCallbackIdFromUrl(this._template.callbackUrl)
	}

	/**
     * Getter template url
     * @return {string}
    */
	get getReclaimUrl(): string {
		return RECLAIM_APP_URL + encodeURIComponent(JSON.stringify(this._template))
	}

}