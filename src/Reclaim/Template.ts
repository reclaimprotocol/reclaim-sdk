import { RECLAIM_APP_URL } from "../config";
import { Template } from "../types";


export default class TemplateInstance {

    private _template: Template

    constructor(template: Template) {
        this._template = template
    }

    get template () {
        return this._template;
    }

    get id () {
        return this._template.id
    }

    get url () {
        return RECLAIM_APP_URL + encodeURIComponent(JSON.stringify(this._template))
    }

}