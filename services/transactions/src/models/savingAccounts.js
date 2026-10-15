import crypto from "crypto";

const savingAccounts = new Map([
    ["sa-001", {
        id: "sa-001",
        userId: "u-001",
        accountNumber: "123456789",
        balance: 15000,
        interestRate: 1.8,
        createdAt: "2024-01-10T10:00:00Z",
        history: []
    }],
    ["sa-002", {
        id: "sa-002",
        userId: "u-002",
        accountNumber: "987654321",
        balance: 42000,
        interestRate: 2.1,
        createdAt: "2024-02-01T12:30:00Z",
        history: []
    }]
]);



export function getAllSavingAccounts() {
    return Array.from(savingAccounts.values());
}

export function find(predicate) {
    for (const acc of savingAccounts.values()) {
        if (predicate(acc)) {
            return acc;
        }
    }
    return null;
}
export function getBalance(id) {
    const acc = savingAccounts.get(id);
    if (!acc) return null;
    return { id: acc.id, balance: acc.balance };
}

export function getHistory(id) {
    const acc = savingAccounts.get(id);
    if (!acc) return null;
    return acc.history; // zatím []
}

export function getInterestSettings(id) {
    const acc = savingAccounts.get(id);
    if (!acc) return null;
    return { id: acc.id, interestRate: acc.interestRate };
}

export function createSavingAccount(data) {
    const id = `sa_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    const account = {
        id,
        userId: data.userId,
        accountNumber: data.accountNumber,
        balance: data.balance ?? 0,
        interestRate: data.interestRate ?? 0,
        createdAt,
        isClosed: false,
        history: []
    };

    savingAccounts.set(id, account);
    return account;
}

export function updateSavingAccount(id, data) {
    const existing = savingAccounts.get(id);
    if (!existing) return null;

    const updated= {
        ...existing,
        ...data,
        id: existing.id,
        createAt: existing.createAt,
    };

    savingAccounts.set(id, updated);
    return updated;
}

export function applyInterest(institutionId, accountId, asOf, mode) {
    const acc = savingAccounts.get(accountId);
    if (!acc) return null;

    const interestRate = acc.interestRate / 100 / 12;
    const balance = acc.balance;

    const interest = balance * interestRate;

    if (mode === "execute") {
        acc.balance += interest;
        acc.lastInterestAppliedAt = asOf;
        savingAccounts.set(accountId, acc);
    }

    return {
        institutionId,
        accountId,
        asOf,
        interest,
        newBalance: mode === "execute" ? acc.balance : balance
    };
}

export function transferToCurrent(savingId, currentAccount, amount) {
    const saving = savingAccounts.get(savingId);
    if (!saving) return null;

    if (saving.balance < amount){
        return "INSUFFICIENT_FUNDS";
    }

    // odečíst
    saving.balance -= amount;
//todo uložit na účet

    // uložit zpět
    savingAccounts.set(savingId, saving);

    // zapsat do historie
    saving.history.push({
        type: "transfer-out",
        amount,
        date: new Date().toISOString(),
        to: currentAccount.id
    });

    return {
        from: saving,
        to: currentAccount
    };
}
