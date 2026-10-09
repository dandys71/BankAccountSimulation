import crypto from "crypto";

export const createTriggeredEventObject = (data) => {
    return {
        event: {
            eventId: crypto.randomUUID(),
            templateId: "random-event-01",
            accountId: data.accountId,
            happenedAt: new Date().toISOString(),
            amount: 500,
            currency: "CZK",
            note: "Náhodná událost ze simulace"
        },
        transaction: {
            transactionId: crypto.randomUUID(),
            accountId: data.accountId,
            counterpartyAccount: "CZ990000000012345678",
            amount: 500,
            currency: "CZK",
            direction: "income",
            status: "pending",
            vs: "123456",
            ks: "0308",
            ss: "",
            note: "Platba z náhodné události",
            createdAt: new Date().toISOString(),
            postedAt: new Date().toISOString()
        }
    };
};


export const createPreviewWindowObject = () => {
    return {
        items: [
            {
                templateId: "interest-payout",
                probability: 0.95,
                expectedAmount: 150.50
            },
            {
                templateId: "account-fee",
                probability: 1.0,
                expectedAmount: -20.0
            }
        ]
    };
};



export const createEventsListObject = (filters = {}) => {
    return [
        {
            eventId: crypto.randomUUID(),
            templateId: "periodic-fee-2026",
            accountId: filters.accountId || "acc-123456",
            happenedAt: new Date().toISOString(),
            amount: -50,
            currency: "CZK",
            note: "Měsíční poplatek za vedení účtu"
        },
        {
            eventId: crypto.randomUUID(),
            templateId: "interest-deposit",
            accountId: filters.accountId || "acc-123456",
            happenedAt: new Date().toISOString(),
            amount: 12.50,
            currency: "CZK",
            note: "Připsání úroku"
        }
    ];
};

export const createPauseEventsObject = () => {
    return {
        status: "paused",
        message: "Generování náhodných událostí bylo pozastaveno."
    }
}

export const createResumeEventsObject = () => {
    return {
        status: "active",
        message: "Generování náhodných událostí bylo obnoveno."
    }
}

