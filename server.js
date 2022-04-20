import express, { static as Static } from "express";
// import firebaseApp from './util/db.js';
// import {refFromURL, set} from 'firebase/database';
const app = express();

app.set("view engine", "ejs")
app.use("/assets",Static("assets"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.render("signup");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/dashboard", function(req, res){
    res.render("dashboard");
})

app.post('/assessment', async function(req, res){
    res.render("Assessment");
 });

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), () => {
    console.log("Server Running on port " + app.get("port"));
});