
import { Router } from 'express';
import * as AuthController from '../controllers/authController.js'; //

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
export const router = Router();

// POST /v1/auth/login
router.post('/login', AuthController.loginUser);

// GET /v1/auth/me
router.get('/me', AuthController.me);

// POST /v1/auth/introspect
router.post('/introspect', AuthController.introspect);

// POST /v1/auth/logout
router.post('/logout', AuthController.logout);