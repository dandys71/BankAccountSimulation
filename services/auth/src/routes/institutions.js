import { Router } from 'express';
import * as InstitutionController from '../controllers/institutionController.js'; //

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
export const router = Router();

// GET /v1/institutions/getInstitutionById
router.get('/getInstitutionById', InstitutionController.getInstitutionById);

// GET /v1/institutions/listInstitutions
router.get('/listInstitutions', InstitutionController.listInstitutions);

// POST /v1/institutions/createInstitution
router.post('/createInstitution', InstitutionController.createInstitution);

// POST /v1/institutions/updateInstitution
router.post('/updateInstitution', InstitutionController.updateInstitution);

// POST /v1/institutions/deleteInstitution
router.post('/deleteInstitution', InstitutionController.deleteInstitution);