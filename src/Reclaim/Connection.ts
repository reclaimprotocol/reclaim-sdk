import { verifyEncryptedClaims } from "@questbook/reclaim-crypto-sdk";
import { RECLAIM_APP_URL } from "../config";
import { Link, Template } from "../types";
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
    
    verifyEncryptedClaimProofs = (link: Link) => {
        const claims = link.claims.map(claim => omit(claim, ['params', 'signatures']));
        const signatures = link.claims.map(claim => ({
            id: claim.id,
            enc: claim.signatures
        }));

        return verifyEncryptedClaims(claims, signatures, ethers.utils.arrayify(this.creatorPrivateKey));
    }
}