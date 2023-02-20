import { RECLAIM_APP_URL } from "../config";
import { messaging, onMessage, MessagePayload } from "../firebase";
import { Template, TemplateLinkNotificationData } from "../types";
import { isTemplateLinkNotificationData } from "../utils/typeGuards";


export default class Connection {

    private template: Template
    private creatorPrivateKey: string
    private onFirebaseNotification: (payload: TemplateLinkNotificationData | string) => void

    constructor(template: Template, creatorPrivateKey: string) {
        this.creatorPrivateKey = creatorPrivateKey
        this.template = template

        onMessage(messaging, (payload) => {

            const notification = {
                title: payload.notification?.title,
                body: payload.notification?.body,
                data: {
                    link: JSON.parse(payload?.data?.link || ""),
                    templateId: payload?.data?.templateId,
                    templateName: payload?.data?.templateName,
                    signatures: JSON.parse(payload?.data?.signatures || ""),
                }
            }

            // @TODO: decrypt signatures with the private key of the template creator

            if(isTemplateLinkNotificationData(notification))
                this.onFirebaseNotification(notification)
            else {
                this.onFirebaseNotification("Invalid link was submitted - ignoring...")
            }
        })

    }

    get link() {
        return RECLAIM_APP_URL + encodeURIComponent(JSON.stringify(this.template))
    }

    onSubmit = (func: (payload: TemplateLinkNotificationData) => void) => {
        this.onFirebaseNotification = func
    }
}