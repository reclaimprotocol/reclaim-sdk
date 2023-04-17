export type PROVIDER = 'google-login' | 'yc-login' | 'github-contributor'

export type Claim = {
    templateClaimId: number
    provider: PROVIDER
    params: { [key: string]: string }
}

export type Template = {
    id: string
    name: string
    callbackUrl: string
    claims: Claim[]
}
export interface Link {
    claims: Claim[]
}

export interface Proof extends Claim{
    onChainClaimId: number
    templateClaimId: number
    ownerPublicKey: string
    timestampS: number
    witnessAddresses: string[]
    signatures: string[]
    templateUrl: string
    redactedParameters: string
}