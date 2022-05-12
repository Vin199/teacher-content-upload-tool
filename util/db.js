import admin from "firebase-admin";

import ServiceAccount from "../node-project-c4942-firebase-adminsdk-eu7v1-4d1e939534.json" assert {type:"json"};

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://node-project-c4942-default-rtdb.firebaseio.com"
  });


var db = admin.database();

var ref = db.ref("users/teachers");

export default {
    ref
}

// let admin
// let databaseRef

// const init = (fbAdmin) => {
//     admin = fbAdmin
//     databaseRef = admin.database()
// }

// const getAdmin = () => {
//     return admin
// }

// const getDatabaseRef = () => {
//     return databaseRef
// }