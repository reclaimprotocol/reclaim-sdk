import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from "firebase/auth";
import { getMessaging, MessagePayload, onMessage } from "firebase/messaging";
import { 
    FIREBASE_PROJECT_ID, 
    FIREBASE_PROJECT_API_KEY, 
    FIREBASE_APP_ANDROID_APP_ID, 
    FIREBASE_APP_SENDER_ID 
} from '../config';

const firebaseAppConfig = {
    projectId: FIREBASE_PROJECT_ID,
    apiKey: FIREBASE_PROJECT_API_KEY,
    appId: FIREBASE_APP_ANDROID_APP_ID,
    messagingSenderId: FIREBASE_APP_SENDER_ID,
}

const firebaseApp = initializeApp(firebaseAppConfig, 'templates-client-sdk')

const messaging = getMessaging(firebaseApp);

const initialiseUser = async (): Promise<string> => {

    const auth = getAuth(firebaseApp)

    const { user } = await signInAnonymously(auth);

    return await user.getIdToken();
};

export default firebaseApp

export { initialiseUser, messaging, onMessage, MessagePayload }

