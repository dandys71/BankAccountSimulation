# Drizzle schémata (TransactionManager)

Stejný styl jako `accountSchema.js`. Entity podle `docs/original/FG_Entity_DB.docx`.

| Soubor | Tabulka | Entita |
| --- | --- | --- |
| `accountSchema.js` | `accounts` | Bankovní účet |
| `savingsAccountSchema.js` | `savings_accounts` | Spořicí účet |
| `transactionSchema.js` | `transactions` | Transakce |
| `paymentSchema.js` | `payments` | Platba |
| `templateSchema.js` | `templates` | Šablona |
| `standingOrderSchema.js` | `standing_orders` | Trvalé příkazy |
| `fateSchema.js` | `fates` | Osud |
| `interestRateBandSchema.js` | `interest_rate_bands` | Úroková pásma |
| `simulationSettingsSchema.js` | `simulation_settings` | Fiktivní čas + výplata |
| `accountCounterSchema.js` | `account_counters` | Generátor čísla účtu |

Uživatel / organizace / instituce / tokeny jsou v `services/auth` (MongoDB), ne tady.

Migrace: při startu služby (`src/db/migrate.js`) nebo `npm run migrate`.
Seed: `npm run seed`.
