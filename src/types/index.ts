export type TemplateClaim = {
    provider: string
    params: { [key: string]: string }
}

export type Template = {
    id: string
    name: string
    firebaseToken: string
    walletAddress: string
    claims: TemplateClaim[]
}


