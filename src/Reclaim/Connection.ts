import { WEB_APP_URL } from "../config";
import { messaging, onMessage, MessagePayload } from "../firebase";
import { Template } from "../types";


export default class Connection {

    private template: Template
    private onFirebaseNotification: (payload: MessagePayload) => void

    constructor(template: Template) {
        this.template = template

        onMessage(messaging, (payload) => {
            this.onFirebaseNotification(payload)
        })

    }

    get link() {
        return WEB_APP_URL + '/' + encodeURIComponent(JSON.stringify(this.template))
    }

    onSubmit = (func: (payload: MessagePayload) => void) => {
        this.onFirebaseNotification = func
    }
}