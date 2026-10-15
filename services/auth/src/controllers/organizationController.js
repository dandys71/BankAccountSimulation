//import { validate } from '../services/validationService.js';
//import * as ValidationSchemas from '../config/validationSchemas.js';

import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import User from '../models/User.js';

class OrganizationController {

  async createOrganization(req, res, next) {
    try {
      const { name, note } = req.body;

      const newOrganization = new Organization({ name, note });
      await newOrganization.save();

      res.status(201).json({ message: "Vytvořeno", organization: newOrganization });
    } catch (e) {
      next(e);
    }
  }

  async listOrganizations(req, res, next) {
    try {
      const organizations = await Organization.find();
      res.json(organizations);
    } catch (e) {
      next(e);
    }
  }

  async getOrganizationById(req, res, next) {
    try {
      const id = req.query.organizationId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Neplatný formát ID organizace" });
      }

      const organization = await Organization.findById(id);

      if (!organization) {
        return res.status(404).json({ message: "Nenalezeno" });
      }

      res.json({ message: "OK", organization });
    } catch (e) {
      next(e);
    }
  }

  async updateOrganization(req, res, next) {
    try {
      const { organizationId, name, note } = req.body;

      if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ message: "Neplatný formát ID organizace" });
      }

      const updatedOrganization = await Organization.findByIdAndUpdate(
        organizationId,
        { name, note },
        { new: true }
      );

      if (!updatedOrganization) {
        return res.status(404).json({ message: "Organizace s tímto ID neexistuje." });
      }

      res.json({ message: "OK", organization: updatedOrganization });
    } catch (e) {
      next(e);
    }
  }

  async deleteOrganization(req, res, next) {
    try {
      const { organizationId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ message: "Neplatný formát ID organizace" });
      }

      const deletedOrganization = await Organization.findByIdAndDelete(organizationId);

      if (!deletedOrganization) {
        return res.status(404).json({ message: "Organizace s tímto ID neexistuje." });
      }

      res.status(200).json({ message: `Organizace ${deletedOrganization.name} byla smazána.` });

    } catch (e) {
      next(e);
    }
  }

  async addUser(req, res, next) {
      try {
        const { organizationId, userId } = req.body;
  
        // 1. Kontrola formátu ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Neplatný formát ID uživatele" });
        }
        if (!mongoose.Types.ObjectId.isValid(organizationId)) {
          return res.status(400).json({ message: "Neplatný formát ID organizace" });
        }

        // Kontrola organizace
        const organization = await Organization.findById(organizationId);
        if (!organization) {
          return res.status(404).json({ message: "Neexistující organizace." });
        }
          
        const updatedUser = await User.findByIdAndUpdate(
          userId, 
        { $addToSet: { organizationIds: organizationId }  });
        if (!updatedUser) {
          return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
        }
          res.status(200).json({ message: "OK" });
      } catch (e) {
        next(e);
      }
    }

    async removeUser(req, res, next) {
      try {
        const { organizationId, userId } = req.body;
  
        // 1. Kontrola formátu ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Neplatný formát ID uživatele" });
        }
        if (!mongoose.Types.ObjectId.isValid(organizationId)) {
          return res.status(400).json({ message: "Neplatný formát ID organizace" });
        }

        // Kontrola organizace
        const organization = await Organization.findById(organizationId);
        if (!organization) {
          return res.status(404).json({ message: "Neexistující organizace." });
        }
          
        const updatedUser = await User.findByIdAndUpdate(
          userId, 
        { $pull: { organizationIds: organizationId }  });
        if (!updatedUser) {
          return res.status(404).json({ message: 'Uživatel s tímto ID neexistuje.'});
        }
          res.status(200).json({ message: "OK" });
      } catch (e) {
        next(e);
      }
      }
}

const controller = new OrganizationController();

export const getOrganizationById = controller.getOrganizationById.bind(controller);
export const listOrganizations = controller.listOrganizations.bind(controller);
export const createOrganization = controller.createOrganization.bind(controller);
export const updateOrganization = controller.updateOrganization.bind(controller);
export const addUser = controller.addUser.bind(controller);
export const removeUser = controller.removeUser.bind(controller);



export const deleteOrganization = controller.deleteOrganization.bind(controller);