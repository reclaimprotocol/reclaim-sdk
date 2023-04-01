import { RECLAIM_APP_URL } from "../config";
import { Template } from "../types";

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
        return this._template;
    }

    /**
     * Getter id
     * @return {string}
     */
    get id(): string {
        return this._template.id
    }

    /**
     * Getter template url
     * @return {string}
    */
    get url(): string {
        return RECLAIM_APP_URL + encodeURIComponent(JSON.stringify(this._template))
    }

}