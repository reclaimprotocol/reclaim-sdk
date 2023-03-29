import { EncryptedClaimProof, verifyEncryptedClaims } from "@reclaimprotocol/reclaim-crypto-sdk";
import { RECLAIM_APP_URL } from "../config";
import { Claim, Link, Template } from "../types";
import TemplateInstance from "./Template";
import { omit } from "lodash";
import { ethers } from "ethers";
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