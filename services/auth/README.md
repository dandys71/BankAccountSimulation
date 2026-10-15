
# TransactionManager – startovací balíček (Express)

Tento projekt je připraven pro tým, který bude vytvářet jednotlivé cesty (endpointy) pro TransactionManager.

## Jak spustit lokálně
```bash
npm install
npm run dev
# služba poběží na http://localhost:5001
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
