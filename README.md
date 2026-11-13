# BankAccountSimulation

Webová aplikace pro výuku finanční gramotnosti. V jednom repozitáři jsou dvě backendové služby, statický frontend a podklady k produktu.

| Část | Složka | Adresa |
| --- | --- | --- |
| Frontend | `apps/web` | http://localhost:3000 |
| AuthManager | `services/auth` | http://localhost:5000 |
| TransactionManager | `services/transactions` | http://localhost:5001 |

AuthManager drží uživatele, organizace a instituce v MongoDB. TransactionManager drží účty, transakce, spořicí účty a trvalé příkazy v PostgreSQL. Po přihlášení Auth vydá JWT (včetně `roles`); TransactionManager ho ověřuje stejným `JWT_SECRET`. Frontend volá API přes nginx proxy. Podrobnosti jsou v [AGENTS.md](AGENTS.md) a ve [docs/README.md](docs/README.md).

## GitHub remotes (dandys71)

```bash
bash scripts/add-dandys-remotes.sh
```

Přidá remotes `dandys` (BankAccountSimulation), `transaction-manager` a `auth-manager`. Detaily jsou v [SOURCES.md](SOURCES.md).

## Spuštění

Potřebujete Docker Desktop.

```bash
copy .env.example .env
docker compose up --build
```

Ověření:

- http://localhost:3000 otevře přihlášení (frontend volá API přes `/api/auth` a `/api/transactions`)
- Demo login: `student` / `heslo123` (admin: `admin` / `heslo123`)
- Na detailu účtu jde převádět mezi spořením a běžným účtem
- Transaction API: `/v1/templates`, `/v1/fates`, `/v1/time`, `/v1/payroll` (+ cron na pozadí)
- http://localhost:5000/v1/health/ping
- http://localhost:5001/v1/health/ping

Zastavení: `docker compose down`. Smazání databází: `docker compose down -v`.

Spouštějte tento kořenový compose. Soubory `services/auth/compose.yaml` a `services/transactions/docker-compose.yml` jsou původní studentské soubory a na stejných portech by se s kořenovým composem srazily.

## Vývoj

Zdrojáky jsou do kontejnerů připojené, takže úprava souboru v `services/auth` nebo `services/transactions` službu restartuje. Frontend je statické HTML v `apps/web`; nginx ho servíruje přímo.

Po přidání npm balíčku znovu sestavte danou službu (`docker compose up --build auth` nebo `transactions`) a nechte znovu vytvořit její volume `node_modules`, jinak v kontejneru zůstanou staré závislosti.

### Databáze

- Auth (MongoDB): User, Organization, Institution — při startu se připojí samo.
- Transactions (PostgreSQL): při startu běží migrace tabulek `accounts`, `savings_accounts`, `transactions`, `standing_orders`, `payment_templates`, `event_templates`, `simulation_settings`, `account_counters`.

Seed demo dat:

```bash
docker compose exec auth npm run seed
docker compose exec transactions npm run seed
```

Auth seed vytvoří uživatele `admin` / `student` s heslem `heslo123`. Transactions seed naplní účty, spoření, transakce, trvalé příkazy a šablony.

Původní repozitáře škol se tímto repozitářem nemění. Odkud kód pochází, je v [SOURCES.md](SOURCES.md).

## Větve studentů

Přesné větve z TransactionManageru jsou `transaction-manager/Flégl-Docker`, `transaction-manager/Flégl-Events`, `transaction-manager/Jasa`, `transaction-manager/standingOrderSchema.js` a `transaction-manager/veverka`. Jejich checkout vrátí původní podobu té služby.

Na aktuálním monorepu navíc leží `transactions/standingOrderSchema` a `transactions/Flegl-Docker`.
