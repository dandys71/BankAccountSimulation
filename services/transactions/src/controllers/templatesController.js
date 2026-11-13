import { PaymentTemplates } from "../models/paymentTemplates.js";

export async function listTemplates(req, res, next) {
  try {
    const items = await PaymentTemplates.listWithPayments({
      institutionId: req.query.institutionId,
      active: req.query.active,
    });
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

export async function getTemplateById(req, res, next) {
  try {
    const item = await PaymentTemplates.get(req.query.templateId);
    if (!item) return res.status(404).json({ message: "Template not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createTemplate(req, res, next) {
  try {
    const created = await PaymentTemplates.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function updateTemplate(req, res, next) {
  try {
    const { templateId, ...rest } = req.body;
    const updated = await PaymentTemplates.update(templateId, rest);
    if (!updated) return res.status(404).json({ message: "Template not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteTemplate(req, res, next) {
  try {
    const deleted = await PaymentTemplates.delete(req.body.templateId);
    if (!deleted) return res.status(404).json({ message: "Template not found" });
    res.json({ message: "Deleted", template: deleted });
  } catch (e) {
    next(e);
  }
}
