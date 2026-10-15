import {Router} from 'express';
import * as UserController from '../controllers/userController.js'; //

export const router = Router();

// POST /v1/users/create
router.post('/create', UserController.createUser);
// POST /v1/users/login
router.post('/login', UserController.loginUser);
