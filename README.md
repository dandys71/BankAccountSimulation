# BankAccountSimulation

Webová aplikace pro výuku finanční gramotnosti. V jednom repozitáři jsou dvě backendové služby, statický frontend a podklady k produktu.

| Část | Složka | Adresa |
| --- | --- | --- |
| Frontend | `apps/web` | http://localhost:3000 |
| AuthManager | `services/auth` | http://localhost:5000 |
| TransactionManager | `services/transactions` | http://localhost:5001 |

AuthManager drží uživatele, organizace a instituce v MongoDB. TransactionManager drží účty, transakce, spořicí účty a trvalé příkazy v PostgreSQL. Služby se později propojí společným JWT. Podrobnosti jsou v [AGENTS.md](AGENTS.md) a ve [docs/README.md](docs/README.md).

## Spuštění

Potřebujete Docker Desktop.

```bash
copy .env.example .env
docker compose up --build
```

Ověření:

- http://localhost:3000 otevře přihlášení
- http://localhost:5000/v1/health/ping
- http://localhost:5001/v1/health/ping

Zastavení: `docker compose down`. Smazání databází: `docker compose down -v`.

Spouštějte tento kořenový compose. Soubory `services/auth/compose.yaml` a `services/transactions/docker-compose.yml` jsou původní studentské soubory a na stejných portech by se s kořenovým composem srazily.

## Vývoj

Zdrojáky jsou do kontejnerů připojené, takže úprava souboru v `services/auth` nebo `services/transactions` službu restartuje. Frontend je statické HTML v `apps/web`; nginx ho servíruje přímo.

Po přidání npm balíčku znovu sestavte danou službu (`docker compose up --build auth` nebo `transactions`) a nechte znovu vytvořit její volume `node_modules`, jinak v kontejneru zůstanou staré závislosti.

Původní repozitáře škol se tímto repozitářem nemění. Odkud kód pochází, je v [SOURCES.md](SOURCES.md).

## Větve studentů

Přesné větve z TransactionManageru jsou `transaction-manager/Flégl-Docker`, `transaction-manager/Flégl-Events`, `transaction-manager/Jasa`, `transaction-manager/standingOrderSchema.js` a `transaction-manager/veverka`. Jejich checkout vrátí původní podobu té služby.

Na aktuálním monorepu navíc leží `transactions/standingOrderSchema` a `transactions/Flegl-Docker`.
