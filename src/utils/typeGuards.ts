import { TemplateLinkNotificationData } from "../types";

export const isTemplateLinkNotificationData =
    (templateLinkNotificationData: any):
        templateLinkNotificationData is TemplateLinkNotificationData => {

        if (typeof (templateLinkNotificationData?.title) !== "string"
            || templateLinkNotificationData?.title === "")
            return false;

        if (typeof (templateLinkNotificationData?.body) !== "string"
            || templateLinkNotificationData?.body === "")
            return false;

        if (!templateLinkNotificationData?.data || 
            typeof(templateLinkNotificationData?.data) !== "object")
            return false;
        
        if (!templateLinkNotificationData?.data?.link)
            return false;

        if (typeof(templateLinkNotificationData?.data?.templateId) !== "string"
            || templateLinkNotificationData?.data?.templateId === ""
        )
            return false;

        if (typeof(templateLinkNotificationData?.data?.templateName) !== "string"
            || templateLinkNotificationData?.data?.templateName === "")
            return false;

        if (!templateLinkNotificationData?.data?.signatures
            || !templateLinkNotificationData?.data?.signatures?.length)
            return false;

        return true;
    }