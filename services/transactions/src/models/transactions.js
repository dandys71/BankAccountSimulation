// Pomocná funkce pro náhodná ID (only for simulaci)
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Šablona pro novou transakci (createTransaction & createInternalTransfer)
export const createTransactionObject = (data, type = 'external') => {
    return {
        transactionId: generateId('TXN'),
        accountId: data.fromAccountId,
        counterpartyAccount: type === 'internal' ? data.toAccountId : data.toAccountNumber,
        amount: data.amount,
        currency: data.currency || "CZK",
        direction: "OUTGOING",
        status: "PENDING",
        vs: data.vs || "",
        note: data.note || "",
        createdAt: new Date().toISOString(),
        postedAt: null
    };
};


// Šablona pro detail jedné transakce (getTransactionById)
export const createTransactionDetailObject = (id) => {
    return {
        transactionId: id,
        accountId: "ACC-999",
        counterpartyAccount: "CZ000111222333",
        amount: 1500,
        currency: "CZK",
        status: "COMPLETED",
        note: "Detail transakce z modelu",
        createdAt: new Date().toISOString(),
        postedAt: new Date().toISOString()
    };
};


// Šablona pro seznam transakcí (listTransactions)
export const createTransactionListObject = (filters) => {
    return {
        items: [
            { transactionId: generateId('TXN'), amount: 500, status: "COMPLETED" },
            { transactionId: generateId('TXN'), amount: 1200, status: "COMPLETED" }
        ],
        total: 2,
        page: filters.page,
        pageSize: filters.pageSize
    };
};


// Šablona pro refundaci (refundTransaction)
export const createRefundObject = (transactionId, note) => {
    return {
        transactionId: transactionId,
        status: "REFUNDED",
        note: note || "Reversal / Refund",
        refundedAt: new Date().toISOString()
    };
};


// Šablona pro výpis (generateStatement)
export const createStatementObject = (data) => {
    return {
        accountId: data.accountId,
        format: data.format || "PDF",
        url: `https://api.banka.cz/download/statement-${Date.now()}.${(data.format || 'pdf').toLowerCase()}`,
        createdAt: new Date().toISOString()
    };
};


// Šablona pro čekající platby (getPending)
export const createPendingTransactionObject = (accountId, amount, note) => {
    return {
        transactionId: generateId('TXN-PEND'),
        accountId: accountId,
        amount: amount,
        status: "PENDING",
        note: note,
        createdAt: new Date().toISOString(),
        postedAt: null
    };
};


// Šablona pro zrušenou platbu (cancelPending)
export const createCancelledTransactionObject = (transactionId) => {
    return {
        transactionId: transactionId,
        status: "CANCELLED",
        note: "Platba byla úspěšně zrušena",
        updatedAt: new Date().toISOString()
    };
};