import { getDatabaseReference } from "../util/db.js";

class AppSectionModel {
  constructor() {}

  getter = (path) => {
    return new Promise((resolve, reject) => {
      getDatabaseReference()
        .child(path)
        .once("value")
        .then((snapshot) => {
          resolve(snapshot.val());
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  setter = (path, data) => {
    return new Promise((resolve, reject) => {
      getDatabaseReference()
        .child(path)
        .set(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  update = (path, data) => {
    return new Promise((resolve, reject) => {
      const usersRef = getDatabaseReference().child(path);
      usersRef
        .update(data)
        .then(() => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  setHistory = (path, data) => {
    return new Promise((resolve, reject) => {
      console.log(path);
      resolve();
      // getDatabaseReference().child(path).update();
    });
  };
}

export default AppSectionModel;
