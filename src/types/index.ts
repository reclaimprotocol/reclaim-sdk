export type TemplateClaim = {
    provider: string
    params: { [key: string]: string }
}

export type Template = {
    id: string
    name: string
    firebaseToken: string
    publicKey: string
    claims: TemplateClaim[]
}

export type TemplateLinkNotificationData = {
    title: string
    body: string
    data: {
        link: any
        templateId: string
        templateName: string
        signatures: Array<string>
    }
}
