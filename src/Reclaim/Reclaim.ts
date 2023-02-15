import { initialiseUser } from "../firebase";
import { Template, TemplateClaim } from "../types";
import generateTemplateId from "../utils/generateUuid";
import Connection from "./Connection";

export class Reclaim { 

    private firebaseInitPromise: Promise<string>;
    creatorWalletAddress: string;

    constructor( 
        creatorWalletAddress: string 
    ) {
        this.firebaseInitPromise = initialiseUser()
        this.creatorWalletAddress = creatorWalletAddress
    }

    getConsent = async (templateName: string, templateClaims: TemplateClaim[]) => {
        const firebaseToken = await this.firebaseInitPromise

        const template: Template = {
            id: generateTemplateId(),
            name: templateName,
            firebaseToken,
            walletAddress: this.creatorWalletAddress,
            claims: templateClaims
        }

        return new Connection(template)
    }

}