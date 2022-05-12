import { getDatabaseReference } from '../util/db.js';

// import { getDatabaseRef, getAdmin
//     // , getChild, getGetFunction, getSetFunction, getUpdateFunction 
// } from '../util/db.js'

class appSectionModel {
    constructor() {
        // this.databaseRef = new Database().getDatabaseReference()
        // console.log('<<< model constructor >>> ', this.databaseRef)
        // this.admin = getAdmin()
    }

    getter = (path) => {
        return new Promise((resolve, reject) => {
            // const databaseRef = getDatabaseReference()
            getDatabaseReference().child(path).once('value').then(snapshot => {
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

    _update = (path, data) => {
        return new Promise((resolve, reject) => {
            this.databaseRef.child(path).update(data).then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            });
        })
    }
}

export default appSectionModel