export type TemplateClaim = {
    provider: string
    params: { [key: string]: string }
}

export type Template = {
    id: string
    name: string
    callbackUrl: string
    publicKey: string
    claims: TemplateClaim[]
}
