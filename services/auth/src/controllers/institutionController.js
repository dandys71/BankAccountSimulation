import mongoose from 'mongoose';
import Institution from '../models/Institution.js';

class InstitutionController {

  async createInstitution(req, res, next) {
    try {
      const { name, bic, country } = req.body;

      const newInstitution = new Institution({
        name,
        bic,
        country
      });

      await newInstitution.save();

      res.status(201).json({
        message: 'Vytvořeno',
        institution: newInstitution
      });

    } catch (e) {
      next(e);
    }
  }

  async listInstitutions(req, res, next) {
    try {
      const institutions = await Institution.find();
      res.json(institutions);
    } catch (e) {
      next(e);
    }
  }

  async getInstitutionById(req, res, next) {
    try {
      const id = req.query.institutionId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Neplatný formát ID instituce"
        });
      }

      const institution = await Institution.findById(id);

      if (!institution) {
        return res.status(404).json({
          message: "Nenalezeno"
        });
      }

      res.json({
        message: 'OK',
        institution
      });

    } catch (e) {
      next(e);
    }
  }

  async updateInstitution(req, res, next) {
    try {
      const { institutionId, name, bic, country } = req.body;

      if (!mongoose.Types.ObjectId.isValid(institutionId)) {
        return res.status(400).json({
          message: "Neplatný formát ID instituce"
        });
      }

      const updatedInstitution = await Institution.findByIdAndUpdate(
        institutionId,
        { name, bic, country },
        { new: true }
      );

      if (!updatedInstitution) {
        return res.status(404).json({
          message: "Instituce s tímto ID neexistuje"
        });
      }

      res.status(200).json({
        message: "OK",
        institution: updatedInstitution
      });

    } catch (e) {
      next(e);
    }
  }

  async deleteInstitution(req, res, next) {
    try {
      const { institutionId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(institutionId)) {
        return res.status(400).json({ message: "Neplatný formát ID instituce" });
      }

      const deletedInstitution = await Institution.findByIdAndDelete(institutionId);

      if (!deletedInstitution) {
        return res.status(404).json({ message: "Instituce s tímto ID neexistuje." });
      }

      res.status(200).json({ message: `Instituce ${deletedInstitution.name} byla smazána.` });

    } catch (e) {
      next(e);
    }
  }

}



const controller = new InstitutionController();

export const getInstitutionById = controller.getInstitutionById.bind(controller);
export const listInstitutions = controller.listInstitutions.bind(controller);
export const createInstitution = controller.createInstitution.bind(controller);
export const updateInstitution = controller.updateInstitution.bind(controller);
export const deleteInstitution = controller.deleteInstitution.bind(controller);