# BankAccountSimulation

Aplikace učí finanční gramotnost na simulaci banky. Student vidí běžný a spořicí účet, zůstatek, historii plateb a zadá jednorázovou platbu. Obsluha a administrátor spravují klienty, produkty a systémové události (fiktivní čas, výplata, trvalé příkazy). Samostatná systémová služba zatím neexistuje; cron, čas a výplaty jsou budoucí práce uvnitř TransactionManageru.

Před změnou chování čtěte [docs/README.md](docs/README.md) a soubory ve `docs/original/`. To jsou zadání, ne vygenerované poznámky.

## Služby

- `services/auth` — AuthManager, Express, MongoDB, port 5000. Kolekce User, Organization, Institution. Cesty: `/v1/auth`, `/v1/users`, `/v1/organizations`, `/v1/institutions`, `/v1/health/ping`. Seed: `npm run seed` (`admin`/`student`, heslo `heslo123`).
- `services/transactions` — TransactionManager, Express, PostgreSQL 16 a Drizzle, port 5001. Schémata ve `src/db/schemas/` podle `FG_Entity_DB`: `accounts`, `savings_accounts`, `transactions`, `payments`, `templates`, `standing_orders`, `fates`, `interest_rate_bands`, `simulation_settings`, `account_counters`. Migrace při startu. Cesty: `/v1/accounts`, `/v1/transactions`, `/v1/savingsAccounts`, `/v1/standingOrders`, `/v1/users`, `/v1/health/ping`. Seed: `npm run seed`.
- `apps/web` — statické HTML (Materialize). Obrazovky `login.html`, `main.html`, `details.html`, `pay-1.html`, `pay-2.html`. Na API se ještě nenapojuje.

Každá služba má vlastní databázi. Auth zůstává na MongoDB, transakce na PostgreSQL. Databáze neslučovat.

Sdílený kontrakt je `JWT_SECRET` z kořenového `.env`. Obě služby ho čtou v `src/config/const.js`. Auth po přihlášení vydá JWT (`userId`, `username`, `roles`); TransactionManager ho ověřuje v `authMiddleware` na `/v1/*` (kromě health). Role hlídá `allowRoles` u admin operací (účty, šablony, osudy, čas, výplata). HTTP volání mezi službami zatím nestavět, dokud na to není konkrétní úkol.

TransactionManager navíc běží s jednoduchým cronem (trvalé příkazy dle `nextRunAt`, volitelná výplata dle `simulation_settings`).

## API

Nové cesty dávejte do trojice `src/routes`, `src/controllers`, `src/services` a registrujte je v `src/app.js`.

- prefix `/v1/`
- anglické názvy, množné číslo entity a operace v camelCase, například `/v1/users/getUser/:id`
- metody hlavně GET a POST
- úspěch vrací 200 a tělo, chyba vrací chybový kód a zprávu přes `errorHandler`

## Spuštění

Jediný podporovaný compose je kořenový `docker-compose.yml`: `copy .env.example .env` a `docker compose up --build`. Frontend je na portu 3000, auth na 5000, transakce na 5001.

Původní GitHuby `dandys71/AuthManager`, `dandys71/TransactionManager` a `the-CYCLE-bin/fg-frontend` tímto repozitářem neměň. Nová práce patří sem. Zdrojové commity jsou v [SOURCES.md](SOURCES.md).
