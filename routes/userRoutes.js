const express = require('express')
const Controller = require('../controllers/userController')
const controller = new Controller()

const router = express.Router()

// router.post('/api', controller.loginData);
router.get('/', controller.login);
router.get('/dashboard', controller.dashboard);
router.get('/users', controller.getUsers);
router.post('/teachers', controller.updateUser);

module.exports = router