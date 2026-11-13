# Lokální prostředí pro testování (Windows)

Cíl: na vlastním PC spustit celou aplikaci (frontend, AuthManager, TransactionManager a obě databáze) a mít ji připravenou pro práci s AI asistentem (Claude Code / Cursor).

Totéž funguje na macOS a Linuxu, jen místo `winget` použijte balíčkovač systému a místo `.ps1` skript `scripts/dev-setup.sh`.

## 1. Co nainstalovat (jednou)

V PowerShellu (jako běžný uživatel):

```
winget install Git.Git
winget install Docker.DockerDesktop
winget install OpenJS.NodeJS.LTS
```

- **Docker Desktop** — po instalaci restart PC, spustit Docker Desktop a nechat ho zapnout WSL 2 (nabídne to sám). V nastavení *Resources* dejte alespoň 4 GB RAM.
- **Node.js 22 LTS** — v kontejnerech se nepotřebuje, ale hodí se pro `npm test` a pro editor. Zkontrolujte `node -v` (má být `v22.x`).
- Volitelně: **Insomnia** nebo **Bruno** na ruční testování API (`winget install Insomnia.Insomnia`). Ve `services/transactions/tests/Insomnia/` jsou připravené kolekce studentů.

AI asistent:

- **Claude Code**: `irm https://claude.ai/install.ps1 | iex` (případně `npm install -g @anthropic-ai/claude-code`), pak v kořeni repozitáře spustit `claude`. Pravidla projektu si načte z `AGENTS.md`.
- **Cursor** (studenti): pravidla jsou v `.cursor/rules/product.mdc`.

## 2. Stažení a spuštění

```
git clone https://github.com/dandys71/BankAccountSimulation.git
cd BankAccountSimulation
powershell -ExecutionPolicy Bypass -File scripts\dev-setup.ps1
```

Skript zkontroluje Git a Docker, vytvoří `.env` (pokud chybí), sestaví a spustí kontejnery, počká, až jsou zdravé, a nahraje demo data.
Opakované spuštění je bezpečné. `-Reset` smaže databáze a začne znovu.

Pak otevřete:

| Co | Adresa |
| --- | --- |
| Aplikace | http://localhost:3000 — `student` / `heslo123` |
| Admin | `admin` / `heslo123` |
| AuthManager | http://localhost:5000/v1/health/ping |
| TransactionManager | http://localhost:5001/v1/health/ping |
| PostgreSQL | `localhost:5432`, uživatel/heslo/DB z `.env` (např. DBeaver, pgAdmin) |
| MongoDB | `mongodb://localhost:27017/auth_manager` (MongoDB Compass) |

## 3. Každodenní práce

```
docker compose up -d                        # spustit
docker compose logs -f auth transactions    # sledovat logy
docker compose down                         # zastavit
```

- Úprava souboru ve `services/*/src` službu sama restartuje (zdrojáky jsou do kontejneru připojené).
- Frontend (`apps/web`) stačí v prohlížeči obnovit.
- Po přidání npm balíčku: `docker compose up --build -d auth` (nebo `transactions`). Když se nový balíček v kontejneru neprojeví, smažte volume `node_modules`: `docker compose down` a `docker volume rm bank-account-simulation_auth_node_modules`.
- Testy: `cd services/transactions` → `npm install` → `npm test`.

## 4. Testování na mobilu

Zadání je „mobile-first“. Dvě možnosti:

- Telefon ve stejné Wi-Fi: zjistěte IP počítače (`ipconfig`) a otevřete `http://<IP>:3000`. Windows Firewall se zeptá na povolení Dockeru — povolit pro *soukromé* sítě.
- Odkudkoli přes HTTPS: `winget install Cloudflare.cloudflared` a `cloudflared tunnel --url http://localhost:3000`. Vypíše dočasnou adresu `https://….trycloudflare.com`. **Používejte jen s demo daty** — viz bezpečnostní body v [TODO.md](TODO.md).

## 5. Když něco nejde

| Příznak | Řešení |
| --- | --- |
| `port is already allocated` (3000/5000/5001/5432/27017) | Port drží jiný program (lokální PostgreSQL, MongoDB, jiný projekt). Zastavte ho, nebo změňte levé číslo portu v `docker-compose.yml`. |
| Auth: `Chyba připojení k DB` | Počkejte na healthcheck Monga, nebo `docker compose restart auth`. |
| Na frontendu „Nemáte žádné účty“ | Neproběhl seed: `docker compose exec auth npm run seed` a `docker compose exec transactions npm run seed`. |
| `bcrypt` / `invalid ELF header` | Do image se dostal Windows `node_modules`. Nově to brání `.dockerignore`; pomůže `docker compose build --no-cache`. |
| Pomalé ukládání souborů / restart | Naklonujte repozitář do WSL (`\\wsl$\Ubuntu\home\…`) místo na `C:\`. |
