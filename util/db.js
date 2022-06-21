// import admin from "firebase-admin";

// import ServiceAccount from "../node-project-c4942-firebase-adminsdk-eu7v1-4d1e939534.json" assert { type: "json" };

// admin.initializeApp({
//   credential: admin.credential.cert(ServiceAccount),
//   databaseURL: "https://node-project-c4942-default-rtdb.firebaseio.com",
// });

// var db = admin.database();

// export default db;

import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";

let databaseRef = undefined;
let storageBucket = undefined;

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  FIREBASE_BUCKET_URL,
  FIREBASE_DATABASE_URL,
} = process.env;

const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: FIREBASE_PROJECT_ID,
  private_key_id: FIREBASE_PRIVATE_KEY_ID,
  private_key: FIREBASE_PRIVATE_KEY,
  client_email: FIREBASE_CLIENT_EMAIL,
  client_id: FIREBASE_CLIENT_ID,
  auth_uri: FIREBASE_AUTH_URI,
  token_uri: FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
};

const ADMIN_CONFIG = {
  credential: cert(SERVICE_ACCOUNT),
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_BUCKET_URL,
};

const initializeFirebaseApp = () => {
  const firebaseApp = initializeApp(ADMIN_CONFIG);
  databaseRef = getDatabase(firebaseApp).ref();
  storageBucket = getStorage().bucket();
};

const getDatabaseReference = () => {
  return databaseRef;
};

const getStorageBucket = () => {
  return storageBucket;
};

export { initializeFirebaseApp, getDatabaseReference, getStorageBucket };
