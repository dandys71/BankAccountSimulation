import * as TransactionModel from '../models/transactions.js';

// [POST] Vytvoření běžné transakce
export const createTransaction = async (data) => {
    return TransactionModel.createTransactionObject(data, 'external');
};


// [POST] Vytvoření interního převodu
export const createInternalTransfer = async (data) => {
    return TransactionModel.createTransactionObject(data, 'internal');
};


// [GET] Detail jedné transakce podle ID
export const getTransactionById = async (id) => {
    return TransactionModel.createTransactionDetailObject(id);
};


// [GET] Seznam transakcí s filtry
export const listTransactions = async (filters) => {
    return TransactionModel.createTransactionListObject(filters);
};


// [POST] Vrácení platby (Refund)
export const refundTransaction = async (id, note) => {
    return TransactionModel.createRefundObject(id, note);
};


// [POST] Generování výpisu
export const generateStatement = async (data) => {
    return TransactionModel.createStatementObject(data);
};


// [GET] Seznam čekajících plateb
export const getPendingTransactions = async (accountId) => {
    return [
        TransactionModel.createPendingTransactionObject(accountId, 1500, "Nájem"),
        TransactionModel.createPendingTransactionObject(accountId, 299, "Spotify")
    ];
};


// [POST] Zrušení čekající platby
export const cancelPending = async (id) => {
    return TransactionModel.createCancelledTransactionObject(id);
};