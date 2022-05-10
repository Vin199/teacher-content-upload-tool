let admin
let databaseRef

const init = (fbAdmin) => {
    admin = fbAdmin
    // databaseRef = admin.database().ref()
}

const getAdmin = () => {
    return admin
}

const getDatabaseRef = () => {
    return databaseRef
}

export default {
    init, getAdmin, getDatabaseRef
}