import { Router } from 'express';
import Controller from '../controllers/userController.js';
const controller = new Controller()

const router = Router()

// router.post('/api', controller.loginData);
router.get('/', controller.login);
router.get('/dashboard', controller.dashboard);
router.get('/users', controller.getUsers);
router.get('/Assessment', controller.Assessment);
//router.post('/teachers', controller.updateUser);

export default router