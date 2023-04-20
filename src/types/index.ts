import { BigNumber } from 'ethers'

export type PROVIDER = 'google-login' | 'yc-login' | 'github-contributor'

export type Claim = {
    templateClaimId: number
    provider: PROVIDER
    parameters: { [key: string]: string }
    chainId: number
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
    redactedParameters: string
}

export type RequestClaim = {
	infoHash: string
	owner: string
	timestampS: number
	claimId: BigNumber
}