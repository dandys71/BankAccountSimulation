import {StandingOrder} from '../models/standingOrder.js';

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
//Normální funkce vrací hodnotu hned.
//Async funkce vrací Promise (slib), protože dělá něco „na pozadí“ (čeká na síť/DB/časovač).
//Pokud chceme počkat na výsledek, musíme tam, kde funkci voláme použít před konkrétní funkcí klíčové slovo await
export async function getStandingOrderById(standingOrderId) {
    return StandingOrder.get(standingOrderId);

}
export async function updateStandingOrder(standingOrder) {
    return StandingOrder.update(standingOrder);
}
export async function deleteStandingOrder(standingOrderId) {
    return StandingOrder.delete(standingOrderId);
}

export async function createStandingOrder(standingOrder) {
    return StandingOrder.create(standingOrder);

}

export async function listStandingOrders(filters) {
    return StandingOrder.list(filters);
}

export async function runNow(standingOrderId, asOf) {
    // 1. Najdeme si ten trvalý příkaz
    const order = await StandingOrder.get(standingOrderId);
    if (!order) return null;

    // 2. Vytvoříme objekt transakce podle toho, co chce Swagger
    const transaction = {
        transactionId: `tx_${crypto.randomUUID()}`,
        accountId: order.accountId,
        counterpartyAccount: "string", // Tady by normálně byl cílový účet
        amount: order.amount,
        currency: order.currency,
        direction: "outcome", // Trvalý příkaz je většinou odchozí platba
        status: "pending",
        vs: "string",
        ks: "string",
        ss: "string",
        note: "Okamžité provedení trvalého příkazu",
        createdAt: new Date().toISOString(),
        postedAt: asOf || new Date().toISOString()
    };

    // V reálné aplikaci bys tady zavolal:
    // await TransactionService.create(transaction);

    return [transaction]; // Swagger očekává pole
}


export async function previewNextExecutions(standingOrderId, windowDays) {
    const order = await StandingOrder.get(standingOrderId);
    if (!order) return null;

    // Vrátíme prostě dva fixní termíny, aby uživatel něco viděl
    return {
        items: [
            { date: "2026-04-01", expectedAmount: order.amount },
            { date: "2026-05-01", expectedAmount: order.amount }
        ]
    };
}