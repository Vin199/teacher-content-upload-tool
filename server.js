var admin = require("firebase-admin");
const { getStorage } = require('firebase-admin/storage');
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const { init } = require('./util/db')

const app = express();
const dirname = __dirname;

var serviceAccount = require("/Users/vinay/Desktop/node project/node-project-c4942-firebase-adminsdk-eu7v1-4d1e939534.json");

const ADMIN_CONFIG = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://node-project-c4942-default-rtdb.firebaseio.com",
}

const fbAdmin = admin.initializeApp(ADMIN_CONFIG);
init(fbAdmin);


app.set("view engine", "ejs");
app.use("/assets",express.static(path.join(dirname, '/assets')))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


const router = require('./routes/userRoutes')
app.use("", router)

// app.get("/", function(req, res){
//     res.render("login");
// });

// app.post("/dashboard", function(req, res){
//     res.render("dashboard");
// });

// app.post("/Assessment", function(req, res){
//     res.render("Assessment");
// })

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), () => {
    console.log("Server Running on port " + app.get("port"));
});