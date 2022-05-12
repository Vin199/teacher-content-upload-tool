import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";

let databaseRef = undefined
let storageBucket = undefined

const SERVICE_ACCOUNT = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}
    
const ADMIN_CONFIG = {
    credential: cert(SERVICE_ACCOUNT),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_BUCKET_URL
}

const initializeFirebaseApp = () => {
    const firebaseApp = initializeApp(ADMIN_CONFIG)
    databaseRef = getDatabase(firebaseApp).ref()
    storageBucket = getStorage().bucket()
}

const getDatabaseReference = () => {
    return databaseRef
}

const getStorageBucket = () => {
    return storageBucket
}

export {
    initializeFirebaseApp,
    getDatabaseReference,
    getStorageBucket
}