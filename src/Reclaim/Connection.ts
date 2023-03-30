import { Template } from "../types";
import TemplateInstance from "./Template";

export default class Connection {

    private template: Template
    private creatorPrivateKey: string

    constructor(template: Template, creatorPrivateKey: string) {
        this.creatorPrivateKey = creatorPrivateKey
        this.template = template
    }

    generateTemplate = (callbackId: string) => {
        
        const templateInstance = {
            ...this.template,
            callbackUrl: this.template.callbackUrl + callbackId
        }
        
        return new TemplateInstance(templateInstance)
    }
}