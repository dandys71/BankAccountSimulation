import { Router } from 'express';

import * as OrganizationController from '../controllers/organizationController.js';

export const router = Router();

// GET /v1/organizations/getOrganizationById
router.get('/getOrganizationById', OrganizationController.getOrganizationById);

// GET /v1/organizations/listOrganizations
router.get('/listOrganizations', OrganizationController.listOrganizations);

// POST /v1/organizations/createOrganization
router.post('/createOrganization', OrganizationController.createOrganization);

// POST /v1/organizations/updateOrganization
router.post('/updateOrganization', OrganizationController.updateOrganization);

// POST /v1/organizations/addUser
router.post('/addUser', OrganizationController.addUser);

// POST /v1/organizations/removeUser
router.post('/removeUser', OrganizationController.removeUser);


// POST /v1/organizations/deleteOrganization
router.post('/deleteOrganization', OrganizationController.deleteOrganization);