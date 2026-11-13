import { EventTemplates } from "../models/eventTemplates.js";
import { Payments } from "../models/payments.js";
import { Accounts } from "../models/accounts.js";
import * as TransactionModel from "../models/transactions.js";

export async function listFates(req, res, next) {
  try {
    const items = await EventTemplates.list({
      organizationId: req.query.organizationId,
      active: req.query.active,
    });
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

export async function getFateById(req, res, next) {
  try {
    const item = await EventTemplates.get(req.query.fateId);
    if (!item) return res.status(404).json({ message: "Fate not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createFate(req, res, next) {
  try {
    const created = await EventTemplates.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function triggerFate(req, res, next) {
  try {
    const { fateId, accountId } = req.body;
    const fate = await EventTemplates.get(fateId);
    if (!fate) return res.status(404).json({ message: "Fate not found" });

    const account = await Accounts.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const amount = await Payments.resolveAmount(fate.paymentId);
    const payment = await Payments.get(fate.paymentId);
    const isIncome = payment?.paymentType === "PRIJEM";

    if (!isIncome && account.balance < amount) {
      return res.status(400).json({ message: "Nedostatečný zůstatek pro osud" });
    }

    const postedAt = new Date();
    const tx = await TransactionModel.create({
      fromAccountId: isIncome ? "SYSTEM" : accountId,
      toAccountId: isIncome ? accountId : null,
      accountId,
      counterpartyAccount: "OSUD",
      amount,
      currency: payment?.currency || account.currency,
      direction: isIncome ? "INCOMING" : "OUTGOING",
      status: "COMPLETED",
      comment: fate.name,
      note: fate.description,
      postedAt,
      simulatedAt: postedAt,
    });

    await Accounts.adjustBalance(accountId, isIncome ? amount : -amount);
    res.status(201).json({ fate, transaction: tx, amount });
  } catch (e) {
    next(e);
  }
}
