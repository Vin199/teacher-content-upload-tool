import { getDatabaseReference, getAdmin } from "../util/db.js";

export default {
  getter: (path) => {
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
  },

  setter: (path, data) => {
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
  },

  update: (path, data) => {
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
  },

  setHistory: (path, data) => {
    return new Promise((resolve, reject) => {
      console.log(path);
      resolve();
      // getDatabaseReference().child(path).update();
    });
  },

  getUserWithEmail: (email) => {
    return new Promise((resolve, reject) => {
      getAdmin()
        .getUserByEmail(email)
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          resolve(userRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getUserWithPhoneNumber: (phoneNumber) => {
    return new Promise((resolve, reject) => {
      getAdmin()
        .getUserByPhoneNumber(phoneNumber)
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          resolve(userRecord);
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
          reject(error);
        });
    });
  },

  getUserWithUid: (uid) => {
    return new Promise((resolve, reject) => {
      getAdmin()
        .getUser(uid)
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          resolve(userRecord);
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
          reject(error);
        });
    });
  },

  updatePassword: async (uid, password) => {
    return new Promise((resolve, reject) => {
      getAdmin()
        .updateUser(uid, { password })
        .then((userRecord) => {
          resolve(userRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getResetPasswordLink: async (email, actionCodeSettings) => {
    return new Promise((resolve, reject) => {
      getAdmin()
        .generatePasswordResetLink(email, actionCodeSettings)
        .then((link) => {
          // Construct password reset email template, embed the link and send
          // using custom SMTP server.
          //return sendCustomPasswordResetEmail(userEmail, displayName, link);
          resolve(link);
        })
        .catch((error) => {
          // Some error occurred.
          reject(error);
        });
    });
  },
};
