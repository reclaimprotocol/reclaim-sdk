import { initialiseUser } from "../firebase";
import { Template, TemplateClaim } from "../types";
import generateTemplateId from "../utils/generateUuid";
import Connection from "./Connection";
import { Wallet } from 'ethers'

export class Reclaim { 

    private firebaseInitPromise: Promise<string>;
    private creatorWallet: Wallet

    constructor() {
        this.firebaseInitPromise = initialiseUser()
        this.creatorWallet = Wallet.createRandom()
    }

    getConsent = async (templateName: string, templateClaims: TemplateClaim[]) => {
        const firebaseToken = await this.firebaseInitPromise

        const template: Template = {
            id: generateTemplateId(),
            name: templateName,
            firebaseToken,
            publicKey: this.creatorWallet.publicKey,
            claims: templateClaims
        }

        return new Connection(template, this.creatorWallet.privateKey)
    }

}