import { Template, ClaimProvider } from "../types";
import { generateUuid } from "../utils";
import Connection from "./Connection";
import { Wallet } from 'ethers'

/** Reclaim class */
export class Reclaim { 

    /**
     * Property creatorWallet
     * @type {Wallet}
     */
    private creatorWallet: Wallet

    /**
     * Property callbackUrl
     * @type {string}
    */
    private callbackUrl: string

    /**
     * Constructor
     * @param callbackUrl - callback url called when user submits the claim
     */
    constructor(callbackUrl: string) {
        this.callbackUrl = callbackUrl
        this.creatorWallet = Wallet.createRandom()
    }

    /**
     * Connect to Reclaim
     * @param applicationName - name of the application
     * @param claimProviders - providers to get claims
     * @returns {Promise<Connection>}
     */
    connect = async (applicationName: string, claimProviders: ClaimProvider[]): Promise<Connection> => {
        const template: Template = {
            id: generateUuid(),
            name: applicationName,
            callbackUrl: this.callbackUrl,
            publicKey: this.creatorWallet.publicKey,
            claims: claimProviders
        }

        return new Connection(template, this.creatorWallet.privateKey)
    }

}