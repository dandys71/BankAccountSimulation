# TODO — stav implementace a co zbývá

Seznam vznikl porovnáním zadání v `docs/original/` s kódem (stav k 13. 11. 2026, commit `9b150fd`).
Bezpečnostní body jsem ověřil proti běžícímu stacku, ne jen čtením kódu.

Jak s tím pracovat (pro lidi i AI — Cursor, Claude):

- Jeden bod = jedna větev a jeden PR. Do PR napište ID bodu (např. `SEC-03`).
- Hotový bod odškrtněte `[x]` ve stejném PR.
- Nejdřív sekce **P0 Bezpečnost**. Bez ní nemá smysl aplikaci dávat studentům ani na test.
- Body označené ❓ čekají na odpověď zadavatele v [OTAZKY.md](OTAZKY.md).

Legenda: ✅ hotovo · 🟡 částečně · ❌ chybí

---

## 1. Přehled: co už je hotové

| Oblast | Stav | Poznámka |
| --- | --- | --- |
| Monorepo, kořenový `docker-compose.yml`, seed | ✅ | Auth (Mongo) + Transactions (Postgres) + nginx frontend |
| AuthManager: login, JWT (`userId`, `username`, `roles`) | ✅ | Platnost 8 h, zadání chce **min. 24 h** |
| AuthManager: CRUD uživatelů, organizací, institucí | 🟡 | Funguje, ale **bez jakékoli autorizace** (viz SEC-01) |
| Hashovaná hesla (bcrypt) | ✅ | |
| TransactionManager: ověření JWT na `/v1/*` | ✅ | |
| Běžný účet: seznam, detail, zůstatek, historie | 🟡 | Historie bez filtrů, `total` vrací jen velikost stránky |
| Generování čísla účtu | 🟡 | Formát `RRRRMMxxx/0100`, bez kontrolní číslice (mod 11) |
| Jednorázová platba | 🟡 | Peníze odejdou, ale **příjemci v téže bance nedorazí** (FUN-01) |
| Převod mezi vlastními účty | 🟡 | Funguje, ale nekontroluje vlastnictví (SEC-03) |
| Spořicí účet: vklad/výběr z/na běžný účet | 🟡 | Funguje, bez kontroly vlastnictví; úrok je jedna pevná sazba |
| Pásmové úročení | ❌ | Tabulka `interest_rate_bands` je naplněná seedem, ale kód ji nepoužívá |
| Připisování úroků | 🟡 | Ruční endpoint `applyInterest`; `runInterestBatch` existuje, cron ho **nevolá** |
| Trvalé příkazy: CRUD, `runNow`, cron dle `nextRunAt` | 🟡 | Jen výdaje, interval jen daily/weekly/monthly, příjemce nedostane peníze |
| Šablony plateb (`templates`, `payments`) | 🟡 | CRUD bez validace, jedna šablona = jedna platba (zadání chce víc příkazů) |
| Osud (`fates`) | 🟡 | Vytvoření a ruční spuštění; náhodné spouštění v čase chybí |
| Fiktivní čas (`simulation_settings`, `/v1/time`) | 🟡 | `speedFactor` posouvá čas po minutách; transakce ale ukládají **reálný** čas |
| Výplata (`/v1/payroll`, cron) | 🟡 | Interval v reálných minutách, vyplácí **všem** účtům (i adminovi), stav v paměti |
| QR platba (SPD) | ✅ | Bonus. Generování ano, načítání ne |
| Výpis do PDF/CSV | ❌ | `generateStatement` vrací jen zástupný objekt |
| Vrácení platby (refund) | 🟡 | Jen jedna strana transakce, bez oprávnění (SEC-05) |
| Frontend — klient | 🟡 | Login, přehled, detail, platba 1/2, QR; napojený na API přes nginx |
| Frontend — operátor (instituce) | ❌ | Žádná obrazovka |
| Frontend — administrace organizace | ❌ | Žádná obrazovka |
| Unit testy | 🟡 | Transactions: 12 testů (validace). Auth: žádné |
| HTTPS, produkční build, nasazení | ❌ | Dev Dockerfile s `nodemon`/`--watch`, viz [HOSTING.md](HOSTING.md) |

---

## 2. P0 — Bezpečnost (opravit před jakýmkoli nasazením)

Vše níže jsem 13. 11. 2026 ověřil požadavky přes `curl` na lokálně běžícím stacku se seed daty.

- [ ] **SEC-01 AuthManager nemá žádnou autentizaci ani autorizaci.**
  `src/app.js` má `authMiddleware` zakomentovaný. Kdokoli bez přihlášení může volat `POST /v1/users/createUser` s `"roles":["SYSTEM_ADMIN"]`, přihlásit se a ovládat celý systém. Stejně tak `listUsers` (jména a e-maily všech studentů), `deleteUser`, `assignRole`, `deleteOrganization`…
  *Oprava:* zapnout auth middleware na všech cestách kromě `/v1/auth/login` a `/v1/health`, přidat `allowRoles` (správa organizací jen `SYSTEM_ADMIN`, uživatelé v rámci organizace admin organizace). Omezit admina organizace na jeho `organizationIds`.
- [ ] **SEC-02 Rozbitý `authMiddleware` v auth službě.** `services/auth/src/middlewares/auth.js` volá `next()` i po neúspěšném `jwt.verify` (řádek na konci funkce). Po zapnutí by propustil i neplatný token. Totéž `allowRoles` v auth kontroluje `req.user.role` (jednotné číslo), ale token nese `roles` (pole).
- [ ] **SEC-03 IDOR: student pracuje s cizími účty.** TransactionManager kontroluje jen to, že je token platný, ne komu účet patří. Ověřeno:
  - `createTransaction` a `createInternalTransfer` s cizím `fromAccountId` → peníze odejdou z cizího účtu,
  - `accounts/getHistory`, `transactions/getTransactionById`, `transactions/listTransactions` (bez filtru vrací transakce **všech**),
  - `savingsAccounts/listAccounts` vrací všechny spořicí účty (frontend je filtruje až v prohlížeči),
  - `savingsAccounts/*` nekontroluje vlastníka vůbec.
  *Oprava:* v service vrstvě vždy porovnat `account.userId === req.user.userId` (výjimka pro role admin/operátor dle instituce). Napsat na to testy.
- [ ] **SEC-04 Student si může nastavit zůstatek a úrok.** `POST /v1/savingsAccounts/updateAccount` přijme `balance` i `interestRate` od běžného uživatele (ověřeno: zůstatek 9 999 999). `updateInterestRate`, `applyInterest`, `createAccount`, `closeAccount` (spoření) a `accounts/updateAccount`, `accounts/closeAccount` nemají `allowRoles`.
  *Oprava:* tyto cesty jen pro admin/systém. `balance` nepřijímat z běžných update endpointů; ruční změna zůstatku jen přes dedikovanou admin operaci s auditem (FUN-23).
- [ ] **SEC-05 Refund a rušení plateb bez oprávnění.** Kdokoli může refundovat jakoukoli transakci; student si takto vrátí vlastní odchozí platbu. Refund interního převodu vrací peníze jen jedné straně (vznikají peníze z ničeho). Zadání: vrácení platby je akce **instituce/admina**.
- [ ] **SEC-06 Trvalé příkazy může zakládat/měnit/mazat/spouštět student**, i na cizím účtu. Zadání výslovně říká, že klient trvalé příkazy nespravuje. Přidat `allowRoles` + kontrolu instituce. Totéž `templates/createTemplate` (povolena role `USER`).
- [ ] **SEC-07 Souběh (race condition) → záporný zůstatek.** Kontrola zůstatku a odečtení nejsou v jedné DB transakci. Ověřeno: 20 paralelních plateb po 1000 Kč z účtu s 1000 Kč → zůstatek **−10 000 Kč**. Platí pro platby, převody, spoření, trvalé příkazy, osud, výplatu.
  *Oprava:* `db.transaction()` + `SELECT … FOR UPDATE`, nebo atomický `UPDATE accounts SET balance = balance - $1 WHERE account_id = $2 AND balance >= $1 RETURNING *`. Navíc `CHECK (balance >= 0)` v tabulce.
- [ ] **SEC-08 Známý / výchozí `JWT_SECRET`.** Oba `const.js` mají fallback `'topsecret'` a `.env.example` hodnotu `dev-secret-change-me`. Kdo hodnotu zná, podepíše si token s `SYSTEM_ADMIN` (ověřeno). V produkci: při chybějícím secretu službu **nespustit**, secret generovat (`openssl rand -hex 32`), fixovat algoritmus `HS256` při `verify`.
- [ ] **SEC-09 `.env` je commitnutý v gitu** přestože je v `.gitignore`. Teď obsahuje jen vývojové hodnoty, ale jakmile tam někdo dá produkční heslo, unikne. `git rm --cached .env`.
- [ ] **SEC-10 Únik dat v odpovědích.** `createUser` vrací hash hesla; `login` vrací celý objekt uživatele. Poznámka (`note`) se kopíruje i do příchozí transakce příjemce, ale podle zadání ji vidí **jen odesílatel**.
- [ ] **SEC-11 Login:** deaktivovaný uživatel (`isActive: false`) se dál přihlásí (ověřeno). Rozdílné hlášky „Uživatel neexistuje“ / „Špatné heslo“ umožňují zjišťovat existující jména. Chybí limit pokusů (`express-rate-limit`). `username` není validovaný jako string (Mongo operátor injection — přidat zod).
- [ ] **SEC-12 XSS ve frontendu.** `details.html` a `main.html` skládají HTML přes `innerHTML` z dat API (komentář/poznámka transakce, název účtu). Komentář zadává jiný uživatel → uložené XSS, které ukradne token z `localStorage`. Používat `textContent` nebo escapovat.
- [ ] **SEC-13 CORS `*`** na obou službách. Frontend jde přes nginx proxy (stejný origin), takže CORS lze vypnout nebo omezit na doménu frontendu.
- [ ] **SEC-14 Vstupní validace.** Částka je `integer` v DB, ale zod přijme `0.5` → HTTP 500 (ověřeno). Používat `z.number().int().positive()` a horní limit. Šablony, osudy, čas a výplata nemají validaci vůbec (`SimulationSettings.update(req.body)` zapíše cokoli).
- [ ] **SEC-15 Produkční provoz.** Porty Mongo (27017) a Postgres (5432) jsou v compose vystavené ven a Mongo nemá heslo. Dockerfily běží jako root s dev režimem (`nodemon`, `--watch`). Chybí HTTPS (zadání ho vyžaduje). Chyby 500 vrací vnitřní `err.message` klientovi.
- [ ] **SEC-16 Refresh token** se ukládá v DB v čitelné podobě a neexistuje endpoint, který by ho uměl vyměnit za nový access token. Buď refresh dodělat (a ukládat hash), nebo ho odstranit a dát access tokenu 24 h dle zadání.
- [ ] **SEC-17 Závislosti:** `npm audit` v obou službách, přidat do CI. `moment` v auth se nepoužívá — odstranit. Auth `engines.node` je `22.2.0`, Dockerfile bere `node:22` — sjednotit.

---

## 3. P1 — Funkční chyby v tom, co už existuje

- [ ] **FUN-01 Platba na účet v téže bance nepřipíše peníze příjemci** (ověřeno). `createExternal` jen odečte. Pokud `toAccountNumber` patří účtu v DB, vytvořit i příchozí transakci a přičíst. Totéž trvalé příkazy (`runNow`).
- [ ] **FUN-02 Konzistence zůstatku a transakcí** (zadání: „pozor na konzistenci“). Každá změna zůstatku musí mít transakci a obojí v jedné DB transakci. Teď `adjustBalance` a `insert` běží odděleně.
- [ ] **FUN-20 Fiktivní čas a mzda per organizace.** Rozhodnuto: každá škola má vlastní čas, rychlost a mzdu. `simulation_settings` má teď jeden globální řádek (`settingsId = 'global'`) → klíč `organizationId`, cron prochází organizace zvlášť, účet musí znát svou organizaci.
- [ ] **FUN-21 Oddělení organizací.** Platba ani převod nesmí projít mezi účty různých organizací. Volitelný přepínač `SYSTEM_ADMIN` „povolit platby mezi školami“ (default vypnuto, nízká priorita).
- [ ] **FUN-22 Kód klienta.** Krátký unikátní kód klienta (v rámci organizace), použitelný jako VS; vyhledávání klienta pro operátora podle jména / čísla účtu / kódu, odpověď jen se základními údaji.
- [ ] **FUN-23 Ruční změna zůstatku adminem** s checkboxem „Zaznamenat v historii“ (default zapnuto + doporučení). Vždy zapsat do auditního logu (nová tabulka `audit_log`: kdo, kdy, účet, původní a nová hodnota, důvod, viditelné v historii ano/ne). Jen `ORG_ADMIN` / `SYSTEM_ADMIN` vlastní organizace.
- [ ] **FUN-24 Řízení hry (otázka 17).** Hra trvá několik hodin. Pro `ORG_ADMIN` přidat: **pauza / pokračovat** (ruční), **nová hra / reset** (smazat transakce a příkazy, obnovit zůstatky a čas), **vyhodnocení** (pořadí a přehled studentů: zůstatky, úspory, dluhy, export CSV/PDF). Navazuje na hromadné založení studentů s **tiskem přihlašovacích kartiček**, aby se 30 studentů přihlásilo za pár minut.
- [ ] **FUN-25 Vrácení platby podle rolí (otázka 12).** Instituce u plateb, kde je stranou; příjemce vrací přijatou platbu; `ORG_ADMIN` výjimečně cokoli ve své škole. Vrácení = nová dvojice transakcí s `relatedTransactionId`, původní se nemění (nahrazuje současné `refund`, viz SEC-05).
- [ ] **FUN-26 Hromadné generování studentů (otázky 24–25).** `ORG_ADMIN` zadá počet → vzniknou uživatelé `studentNN` s jednoduchými hesly, role `CLIENT`, běžný (a spořicí?) účet; výstup k tisku (kartičky login + heslo). Totéž pro operátory instituce. Nahrazuje „hromadný import ze souboru“ ze zadání.
- [ ] **FUN-27 Profil studenta.** Přezdívka / zobrazované jméno a volitelný e-mail. Po hře volitelně odeslat souhrn e-mailem (potřebuje SMTP; e-mail po odeslání smazat).
- [ ] **FUN-28 Archivace a reset hry (otázka 26).** Uložit snapshot hry (výsledky, transakce) jako archiv k nahlédnutí, pak reset pro novou skupinu. Navazuje na FUN-24.
- [ ] **FUN-29 Import katalogu institucí, šablon a osudů** z podkladů kolegyně (otázka 21, `docs/PRO-KOLEGYNI.md`): navrhnout JSON formát + seed/import skript.
- [ ] **FUN-03 Fiktivní čas se nepoužívá v transakcích.** `simulatedAt` se plní reálným `new Date()`, ne `simulation_settings.currentSimTime`. Frontend ukazuje reálné datum (`formatNow`). Zadání: „1 rok ≈ 4 h“, tj. `speedFactor` ≈ 2190.
- [ ] **FUN-04 Cron a fiktivní čas.** `tick` posune čas, ale trvalé příkazy vyhodnocuje se *starým* časem; `nextRunAt` se počítá od `asOf`, ne od původního termínu (posouvání). Výplata běží v reálných minutách a `lastPayrollAt` se po restartu ztratí → rozhodnuto: mzda **měsíčně ve fiktivním čase**, termín další výplaty uložit v DB (`nextPayrollAt`). Pauza času musí zastavit cron (mzdu, příkazy, úroky). Při běhu více instancí poběží cron vícekrát (zámek přes `pg_advisory_lock`).
- [ ] **FUN-05 Úroky:** pásmové úročení podle `interest_rate_bands` (zadání: větší částka → menší sazba), automatické připisování v cronu (měsíčně ve fiktivním čase), volba připsat na spořicí vs. běžný účet ❓, transakce „Připsaný úrok“ v historii.
- [ ] **FUN-06 Ze spořicího účtu jen na vlastní běžný účet** — `transferToCurrent` nekontroluje, že běžný účet patří stejnému majiteli. Uzavřený spořicí účet jde dál vybírat.
- [ ] **FUN-07 Trvalé příkazy:** příjem i výdaj (`PRIJEM`/`VYDAJ`), náhodná částka min–max, intervaly ze zadání (jednorázový, denní, týdenní, měsíční, čtvrtletní, pololetní, roční), první platba „ihned / následující období“, konec po datu nebo počtu plateb, VS a komentář. Pole `customCron` je povinné, ale nic nedělá. `previewNextExecutions` ignoruje `windowDays` a vrací vždy 2 položky. Při nedostatku peněz ❓.
- [ ] **FUN-08 Šablona s více příkazy** (půjčka = jednorázový příjem + trvalá splátka). Teď má šablona jen jedno `paymentId`. Šablona patří instituci; aplikace šablony na účet vytvoří příkazy.
- [ ] **FUN-09 Výplata:** vyplácet jen klientům (ne operátorům/adminům) a jen v rámci organizace; výše a interval ve fiktivním čase; zdrojový „účet zaměstnavatele“ ❓.
- [ ] **FUN-10 Osud:** náhodné spouštění „někde v průběhu“ (pravděpodobnost/frekvence ❓), osudy per organizace, příjem i výdaj; co při nedostatku peněz ❓.
- [ ] **FUN-11 Filtrování a stránkování historie**: příchozí/odchozí, částka od–do, datum od–do, VS, protiúčet. `total` musí být celkový počet (`count(*)`), ne délka stránky.
- [ ] **FUN-12 Čekající platby (budoucí splatnost)** — rozhodnuto: klient je zadat smí (nízká priorita): `executeImmediately: false` vytvoří PENDING, ale nic ji později neprovede. Přidat datum splatnosti a provádění v cronu.
- [ ] **FUN-13 Výpis do PDF/CSV** (`generateStatement`) — zatím jen zástupný objekt.
- [ ] **FUN-14 Validace čísla účtu** (mod 11 dle vyhlášky ČNB) a kód banky. Číslo spořicího účtu (`SA-…`) má jiný formát než běžný účet.
- [ ] **FUN-15 Vazba Auth ↔ Transactions:** založení uživatele v Auth má založit běžný (a spořicí?) účet v Transactions ❓. Teď se účty vytváří jen seedem. (AGENTS.md zatím HTTP volání mezi službami zakazuje — rozhodnout.)
- [ ] **FUN-16 Role:** sjednotit na `SYSTEM_ADMIN`, `ORG_ADMIN`, `OPERATOR`, `CLIENT` + technický aktér `SYSTEM` (rozhodnuto, viz `docs/README.md` → Upřesnění zadání). Kód teď míchá `admin`, `boss`, `SYSTEM`, `SYSTEM_ADMIN`, `USER` — přejmenovat v `allowRoles`, seedu a modelu `User`; doplnit migraci existujících uživatelů. Automatické transakce označovat `performedBy: SYSTEM`.
- [ ] **FUN-17 Odstranit pozůstatky:** `services/transactions/src/routes/users.js` + `userController.js` (demo login v paměti, 15 min token) — kolize s AuthManagerem. `services/auth/testStrankaAuth*.html`, `spousteni.txt`, `TestyAPI.odt`, staré compose soubory ve službách.
- [ ] **FUN-18 Dokumentace API:** `TransactionManager_API_v1.html` neodpovídá kódu; `AuthManager_API` chybí úplně. Vygenerovat OpenAPI (např. `zod-to-openapi`) a servírovat přes Swagger UI.
- [ ] **FUN-19 Peníze jako celá čísla:** rozhodnuto — **celé koruny**. DB už je `integer`; zbývá validace `z.number().int()` všude (viz SEC-14) a frontend bez desetinných míst.

---

## 4. P2 — Chybějící funkce podle zadání

### Frontend — společné
- [ ] Na všech obrazovkách: přihlášený uživatel, odhlášení, **aktuální fiktivní datum** (z `/v1/time/getCurrentSimTime`).
- [ ] Jednotné chybové a informační hlášky, stránkování u všech výpisů, tlačítka Uložit/Storno.
- [ ] Platba: pole kód banky, KS, SS, komentář vs. poznámka (vysvětlit rozdíl studentům).
- [x] Technologie rozhodnuta (otázka 27): **statické HTML + JS**, bez Handlebars. Doplnit sdílené helpery (escapování, tabulka, stránkování) do `apps/web/js/`.
- [ ] Mobile-first responzivita (otestovat na telefonu), přístupnost.
- [ ] Token v `localStorage` → zvážit httpOnly cookie (kód je už připravený zakomentovaný v auth).

### Frontend — klient (student SOU)
- [ ] Detail účtu: filtry (viz FUN-11), čekající platby, tlačítko výpisu PDF.
- [ ] Zobrazení trvalých příkazů (jen čtení).
- [ ] Spořicí účet: připsané úroky, aktuální sazba podle pásma.

### Frontend — operátor (student OA, instituce)
- [ ] Přehled transakcí instituce + filtr dle jména/účtu + **vrácení platby**.
- [ ] Přehled a editor šablon (více příkazů v šabloně, pevná/náhodná částka, interval).
- [ ] Přehled a editor trvalých příkazů (výběr šablony, VS, komentář, první platba, konec).
- [ ] Jednorázová platba/inkaso od instituce na klienta (prodej, půjčka).

### Frontend — administrátor organizace
- [ ] Globální nastavení: aktuální den, rychlost (1 měsíc = X min), výše a interval mzdy, „přepočet aktuálně zadaných příkazů“ — zatím **nedělat** (termíny jsou ve fiktivním čase, otázka 19), vrátit se po odpovědi na otázku 20.
- [ ] Instituce: přehled, vytvoření, editace, přiřazení operátora (i s automatickým vytvořením uživatele).
- [ ] Uživatelé: přehled se zůstatkem, vytvoření, editace, **generování N studentů** (FUN-26), hromadné výpisy.
- [ ] Šablony, trvalé příkazy a transakce napříč institucemi.
- [ ] Osudy: správa a ruční/automatické spouštění.

### Backend
- [ ] Organizační hranice: admin organizace vidí jen svou organizaci; instituce jen své klienty/příkazy.
- [ ] Hromadný import uživatelů (Auth) + založení účtů (Transactions).
- [ ] Operátorské endpointy: transakce instituce, vrácení platby instituce.
- [ ] Bonus: platební karta, půjčky a investice (Bitcoin) ❓, načítání QR.

---

## 5. P3 — Kvalita, testy, provoz

- [ ] Integrační testy proti reálné DB (Postgres v Dockeru / Testcontainers) — hlavně peníze: platba, převod, refund, souběh, trvalý příkaz, úrok.
- [ ] Testy pro AuthManager (žádné neexistují; `npm test` padá na „No test files found“).
- [ ] GitHub Actions: `npm ci`, `npm test`, `npm audit` na každý PR. Chránit `main` (merge jen přes PR) — rozhodnuto v otázce 30.
- [ ] ESLint + Prettier (teď `lint` jen vypisuje `(lint)`).
- [x] `.dockerignore` v obou službách (bez něj se na Windows kopíruje lokální `node_modules` do image a nativní `bcrypt` pak nefunguje v Linuxu). Doplněno 13. 11. 2026, zbývá ověřit build na Windows.
- [ ] Produkční `Dockerfile` (multi-stage, `npm ci --omit=dev`, `USER node`, `CMD node src/app.js`) a `docker-compose.prod.yml` (bez vystavených DB portů, s reverse proxy a HTTPS).
- [ ] Health check s kontrolou DB, strukturované logy, zálohy DB (cron `pg_dump`/`mongodump`).
- [ ] Migrace: teď ruční SQL v `migrate.js` (`CREATE … IF NOT EXISTS`). Přejít na `drizzle-kit generate/migrate`, ať se schéma a migrace nerozjedou.
- [ ] nginx proxy míří na `host.docker.internal:5000/5001` — v produkci použít názvy služeb `auth:5000` / `transactions:5001`.
- [ ] Aktualizovat `AGENTS.md`, `.cursor/rules/product.mdc` a `docs/README.md` po každé větší změně (AI asistenti z nich vychází).
