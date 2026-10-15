
import { Router } from 'express';
import * as UserController from '../controllers/userController.js'; //

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
export const router = Router();

// GET /v1/users/getUserById
router.get('/getUserById', UserController.getUserById);

// GET /v1/users/listUsers
router.get('/listUsers', UserController.listUsers);

// POST /v1/users/createUser
router.post('/createUser', UserController.createUser);

// POST /v1/users/updateUser
router.post('/updateUser', UserController.updateUser);

// POST /v1/users/deactivateUser
router.post('/deactivateUser', UserController.deactivateUser);

// POST /v1/users/deleteUser
router.post('/deleteUser', UserController.deleteUser);

// POST /v1/users/assignRole
router.post('/assignRole', UserController.assignRole);

// POST /v1/users/revokeRole
router.post('/revokeRole', UserController.revokeRole);