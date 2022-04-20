import {initializeApp} from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyC4eT_bNvgz_EmEcAy5a_yVXQpHITCv5XA",
    authDomain: "node-project-fa6c2.firebaseapp.com",
    projectId: "node-project-fa6c2",
    storageBucket: "node-project-fa6c2.appspot.com",
    messagingSenderId: "312214735298",
    appId: "1:312214735298:web:5f7f100b65b59183142e5b",
    measurementId: "G-VBFYW6S2YL",
    databaseURL: "https://node-project-fa6c2-default-rtdb.firebaseio.com"
  };

const app = initializeApp(firebaseConfig)

export default app;