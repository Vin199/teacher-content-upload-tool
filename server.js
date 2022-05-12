import { getStorage } from 'firebase-admin/storage';
import express, { static as Static, json, urlencoded } from "express";
import { join } from "path";
import Utilities from './util/db.js';
import router from './routes/userRoutes.js';
import { dirname } from "path";
import { fileURLToPath } from "url";

const {init} = Utilities

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import ServiceAccount from "./node-project-c4942-firebase-adminsdk-eu7v1-4d1e939534.json" assert {type:"json"};

// const ADMIN_CONFIG = {
//     credential: admin.credential.cert(ServiceAccount),
//     databaseURL: "https://node-project-c4942-default-rtdb.firebaseio.com",
// }

// const fbAdmin = ADMIN_CONFIG.initializeApp();
// init(fbAdmin);

app.set("view engine", "ejs");
app.use("/assets",Static(join(__dirname, '/assets')))
app.use(json());
app.use(urlencoded({extended: true}));


app.use("", router)

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), () => {
    console.log("Server Running on port " + app.get("port"));
});