const { create } = require("domain");
const appSectionModel = require("../model/User");
const model = new appSectionModel();

class Controller {
    constructor() {}

    login = (req, res) => {
        res.render("login");
    }

    dashboard = (req, res) => {
        res.render("dashboard");
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
        const uid = req.body.uid
        const path = "users/teachers/" + uid

        // console.log('>>> ', req.body)

        await model.update(path, req.body)
        res.send();
    }
}


module.exports = Controller