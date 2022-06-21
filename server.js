import express, { static as Static, json, urlencoded } from "express";
import { join } from "path";
import router from "./routes/userRoutes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Middleware from "./Middleware/middleware.js";
import { initializeFirebaseApp } from "./util/db.js";

initializeFirebaseApp();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.use("/assets", Static(join(__dirname, "/assets")));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(Middleware);

app.use("", router);

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log("Server Running on port " + app.get("port"));
});
