import { config } from "dotenv";
import assert from "assert";
 
config();
 
const {
  PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  DATABASE_URL,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
} = process.env;
 
// adding init assertions
assert(PORT, "Application port is required");
assert(HOST_URL, "Service endpoint is required");
assert(PROJECT_ID, "Firebase project id is required");
assert(APP_ID, "Firebase app id is required");
 
export const port = PORT;
export const host = HOST;
export const url = HOST_URL;
export const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
    databaseURL: DATABASE_URL
}