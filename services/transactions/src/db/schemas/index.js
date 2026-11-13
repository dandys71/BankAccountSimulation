export { accounts } from "./accountSchema.js";
export { savingsAccounts } from "./savingsAccountSchema.js";
export { transactions } from "./transactionSchema.js";
export { payments } from "./paymentSchema.js";
export { templates } from "./templateSchema.js";
export { standingOrders } from "./standingOrderSchema.js";
export { fates } from "./fateSchema.js";
export { interestRateBands } from "./interestRateBandSchema.js";
export { simulationSettings } from "./simulationSettingsSchema.js";
export { accountCounters } from "./accountCounterSchema.js";

// zpětná kompatibilita se staršími importy
export { templates as paymentTemplates } from "./templateSchema.js";
export { fates as eventTemplates } from "./fateSchema.js";
