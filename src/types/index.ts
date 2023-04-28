import { BigNumber } from 'ethers'

export type ProviderParams = {
    provider: 'google-login',
    parameters: {}
} |
{
    provider: 'yc-login',
    parameters: {}
} |

{
    provider: 'github-contributor',
    parameters: { repoName: string }
}
  |

{
    provider: 'github-commits',
    parameters: { repoName: string }
} |
{
    provider: 'github-issues',
    parameters: { repoName: string }
} |

{
    provider: 'github-contributed',
    parameters: { repoName: string }
} |
{
    provider: 'github-languages',
    parameters: { repoName: string }
} |
{
    provider: 'github-pullRequests',
    parameters: { repoName: string }
}

export type ProviderName = ProviderParams['provider']

export type Claim = {
    templateClaimId: number
} & ProviderParams

export type Template = {
    id: string
    name: string
    callbackUrl: string
    claims: Claim[]
}

export type Proof = {
    onChainClaimId: number
    templateClaimId: number
    ownerPublicKey: string
    timestampS: number
    witnessAddresses: string[]
    signatures: string[]
    redactedParameters: string
    chainId: number
} & Claim

export type RequestClaim = {
    infoHash: string
    owner: string
    timestampS: number
    claimId: BigNumber
}