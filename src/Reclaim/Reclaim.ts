import { Template, TemplateClaim } from "../types";
import { generateTemplateId } from "../utils";
import Connection from "./Connection";
import { Wallet } from 'ethers'
import { signatures } from "@questbook/reclaim-crypto-sdk";

export class Reclaim { 

    private creatorWallet: Wallet
    private callbackUrl: string

    constructor(callbackUrl: string) {
        this.callbackUrl = callbackUrl
        this.creatorWallet = Wallet.createRandom()
    }

    getConsent = async (templateName: string, templateClaims: TemplateClaim[]) => {
        const template: Template = {
            id: generateTemplateId(),
            name: templateName,
            callbackUrl: this.callbackUrl,
            publicKey: this.creatorWallet.publicKey,
            claims: templateClaims
        }

        return new Connection(template, this.creatorWallet.privateKey)
    }

}