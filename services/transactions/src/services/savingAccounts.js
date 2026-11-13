import * as savingAccounts from "../models/savingAccounts.js";

export const getAllSavingAccounts = async () => {
  return savingAccounts.getAllSavingAccounts();
};

export const getSavingAccountById = async (id) => {
  return savingAccounts.findById(id);
};

export const createSavingAccount = async (data) => {
  return savingAccounts.createSavingAccount(data);
};

export const getALLBalance = async (id) => {
  return savingAccounts.getBalance(id);
};

export const getALLHistory = async (id) => {
  return savingAccounts.getHistory(id);
};

export const getInterestSettings = async (id) => {
  return savingAccounts.getInterestSettings(id);
};

export const transferALLToCurrent = async (savingId, currentId, amount) => {
  return savingAccounts.transferToCurrent(savingId, currentId, amount);
};

export const transferALLFromCurrent = async (savingId, currentId, amount) => {
  return savingAccounts.transferFromCurrent(savingId, currentId, amount);
};

export const updateInterestRate = async (id, interestRate) => {
  return savingAccounts.updateSavingAccount(id, { interestRate });
};

export const updateSavingAccountById = async (id, data) => {
  return savingAccounts.updateSavingAccount(id, data);
};

export const closeSavingAccountById = async (id) => {
  return savingAccounts.closeSavingAccount(id);
};

export const applyInterest = async (institutionId, accountId, asOf, mode) => {
  return savingAccounts.applyInterest(institutionId, accountId, asOf, mode);
};
