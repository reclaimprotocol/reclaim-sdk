import { Template } from "../types";
import TemplateInstance from "./Template";

/** Connection class */
export default class Connection {

    private template: Template
    private creatorPrivateKey: string

    /**
     * Constructor
     * @param template 
     * @param creatorPrivateKey 
     */
    constructor(template: Template, creatorPrivateKey: string) {
        this.creatorPrivateKey = creatorPrivateKey
        this.template = template
    }

    /**
     * generate Template
     * @param callbackId 
     * @returns {TemplateInstance}
     */
    generateTemplate = (callbackId: string): TemplateInstance => {
        
        const templateInstance = {
            ...this.template,
            callbackUrl: this.template.callbackUrl + callbackId
        }
        
        return new TemplateInstance(templateInstance)
    }
}