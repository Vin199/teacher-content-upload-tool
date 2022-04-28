const { getDatabaseRef, getAdmin } = require('../util/db');

class appSectionModel {
    constructor() {
        this.databaseRef = getDatabaseRef()
        this.admin = getAdmin()
    }

    getter = (path) => {
        return new Promise((resolve, reject) => {
            this.databaseRef.child(path).once('value').then(snapshot => {
                // console.log(snapshot.val());
                resolve(snapshot.val())
            }).catch(error => {
                reject(error)
            })
        })
    }

    setter = (path, data) => {
        return new Promise((resolve, reject) => {
            this.databaseRef.child(path).set(data).then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            });
        })
    }

    update = (path, data) => {
        return new Promise((resolve, reject) => {
            this.databaseRef.child(path).update(data).then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            });
        })
    }
}

module.exports = appSectionModel;