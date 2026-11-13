import * as TransactionModel from "../models/transactions.js";

export const createTransaction = async (data) => {
  return TransactionModel.createExternal(data);
};

export const createInternalTransfer = async (data) => {
  return TransactionModel.createInternal(data);
};

export const getTransactionById = async (id) => {
  return TransactionModel.findById(id);
};

export const listTransactions = async (filters) => {
  return TransactionModel.list(filters);
};

export const refundTransaction = async (id, note) => {
  return TransactionModel.refund(id, note);
};

export const generateStatement = async (data) => {
  return TransactionModel.createStatementObject(data);
};

export const getPendingTransactions = async (accountId) => {
  return TransactionModel.listPending(accountId);
};

export const cancelPending = async (id) => {
  return TransactionModel.cancelPending(id);
};
