import { create } from "domain";
import appSectionModel from "../model/User.js";
const model = new appSectionModel();

class Controller {
    constructor() {}

    login = (req, res) => {
        res.render("login");
    }

    dashboard = (req, res) => {
        res.render("dashboard");
    }

    Assessment = (req, res) => {
        res.render("Assessment");
    }

    // loginData = (req, res) => {
    //     const uid = req.body.uid;
    //     const email = req.body.email;
    //     const emailVerified = req.body.emailVerified;
    //     const displayName = req.body.displayName;
    //     const createdAt = req.body.createdAt;
    //     const lastLoginAt = req.body.lastLoginAt;
    //     console.log('>> ', req.body);
    // }

    getUsers = async (req, res) => {
        const path = "users"
        const data = await model.getter(path);
        res.send(data)
    }

    setUsers = async (req, res) => {
        const path = "users/teachers"
        await model.setter(path, req.body)
        res.send();
    }

    updateUser = async (req, res) => {
        const uid = req.body;
        const path = "users/teachers/" + uid;
        //const arr = [req.body.option_a, req.body.option_b, req.body.option_c, req.body.option_d,];

        // console.log('>>> ', req.body)

        await model.update(path, req.body)
        res.send("<h1>Content Uploaded Successfully!!</h1>");
    }
}


export default Controller