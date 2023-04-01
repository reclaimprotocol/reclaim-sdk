export type PROVIDER = 'google-login' | 'yc-login' | 'github-contributor'

export type ClaimProvider = {
    provider: PROVIDER
    params: { [key: string]: string }
}

export type Template = {
    id: string
    name: string
    callbackUrl: string
    publicKey: string
    claims: ClaimProvider[]
}

export type Claim = {
    id: number
    provider: string
    redactedParameters: string
    params: {
        [key: string]: string
    }
    ownerPublicKey: Uint8Array
    timestampS: number
    witnessAddresses: string[]
    signatures: string[]
}
export interface Link {
    claims: Claim[]
}