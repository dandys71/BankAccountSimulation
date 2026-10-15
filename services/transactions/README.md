
# TransactionManager – startovací balíček (Express)

Tento projekt je připraven pro tým, který bude vytvářet jednotlivé cesty (endpointy) pro TransactionManager.

## Jak spustit lokálně 
```bash
npm install
npm run dev
# služba poběží na http://localhost:5001
```

## Jak ovládat Docker
```bash
docker compose up --build # při změně image (např. při npm install balíček)
docker compose up #pro běžné spuštění, zablokuje terminál pro další příkazy (ale můžete si otevřít další terminál), ale jsou vidět logy
docker compose up -d  #pro běžné spuštění, detachne (spustí kontejnery na pozadí), terminál je možné dál používat, ale nejsou vidět logy
docker compose down #pro zastavení kontejnerů
docker compose down -v #pro zastavení kontejnerů a smazání všech volumes (např. DB), potřeba znovu udělat build
docker compose exec app npm run seed #pro spuštění seedu db (nahrání nějakých defaultních dat po smazání DB), musítě upravit seed ve scripts v package.json, aby spouštěl Váš seed soubor
```
## Drizzle
```bash
docker compose exec app npx drizzle-kit generate #vygeneruje migrační soubor (.sql) podle schématu v rámci Dockeru
docker compose exec app npx drizzle-kit migrate #spustí vytvořenou migraci (.sql) - např. smaže staré tabulky a vytvoří nové podle nového schématu v rámci Dockeru
```

## Struktura složek
```
/service-name/
├── src/
│   ├── config/          # Konfigurace (např. připojení k DB, env proměnné)
│   ├── controllers/     # Logika jednotlivých endpointů
│   ├── routes/          # Definice REST API cest
│   ├── services/        # Aplikační logika (výpočty, validace)
│   ├── models/          # Struktury dat (tvar objektů)
│   ├── middlewares/     # Middleware (autentizace, logování)
│   ├── utils/           # Pomocné funkce
│   └── app.js           # Inicializace Express aplikace
├── tests/               # Jednotkové a integrační testy
├── .env                 # Environment proměnné
├── .gitignore
```

## Kde začít – příklad pro **accounts**
- Přidejte nové cesty do `src/routes/accounts.js`
- Implementujte zpracování v `src/controllers/accountsController.js`
- Doplňte aplikační logiku do `src/services/accountsService.js`
- Tvar dat najdete v `src/models/accounts.js` – později se to napojí na skutečnou DB.

## Další oblasti, které tým rozdělí
- `transactions`, `savingsAccounts`, `standingOrders`, `templates`, `events`, `time`, `payroll`, `cron`…
Vždy vytvořte trojici souborů: `routes/<nazev>.js`, `controllers/<nazev>Controller.js`, `services/<nazev>Service.js`.
```
