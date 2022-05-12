import Utilities from '../util/db.js'
const { ref } = Utilities

class appSectionModel {
    constructor() {
        this.databaseRef = ref;
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
            const usersRef = this.databaseRef.child(path);
            usersRef.update(data).then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            });
        })
    }
}

export default appSectionModel;