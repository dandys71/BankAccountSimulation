# Hosting — kde aplikaci provozovat

Zadání (`FG_Pozadavky…`) chce „plán pro hostování a minimální požadavky pro běh“. Tady je.
Stav k 13. 11. 2026. **Ceny a limity free tierů se často mění — před objednáním je ověřte na webu poskytovatele.**

## Co aplikace potřebuje

| Komponenta | Technologie | RAM (orientačně) |
| --- | --- | --- |
| Frontend | nginx, statické soubory | 10–20 MB |
| AuthManager | Node.js 22 | 80–150 MB |
| TransactionManager | Node.js 22 + cron uvnitř procesu | 80–150 MB |
| Databáze Auth | MongoDB 7 | 300–600 MB (WiredTiger cache) |
| Databáze Transakce | PostgreSQL 16 | 100–200 MB |

**Minimum pro 50 současných uživatelů** (zadání): 1–2 vCPU, **2 GB RAM** (4 GB s rezervou), 20 GB disk, HTTPS certifikát (Let's Encrypt zdarma), doména nebo subdoména.
Dat bude málo (desítky MB za školní rok).

Omezení, které ovlivňuje výběr:

- **Dvě různé databáze** (MongoDB + PostgreSQL). Sdílené webhostingy obvykle nabízejí jen MySQL/MariaDB, nanejvýš PostgreSQL. MongoDB tam nebývá → potřebujete buď Docker/VPS, nebo externí MongoDB (Atlas).
- **Cron běží uvnitř TransactionManageru** → služba musí běžet trvale. Free tiery, které aplikaci po nečinnosti uspí (Render), budou trvalé příkazy a výplaty vynechávat.
- **Osobní údaje studentů** (jméno, e-mail) → hosting v EU, ideálně ČR (GDPR, viz otázka 24 v [OTAZKY.md](OTAZKY.md)).

## ⚠️ Než cokoli zveřejníte

Aktuální kód má kritické díry (viz [TODO.md](TODO.md), sekce P0): kdokoli z internetu si může bez přihlášení vytvořit administrátora. Dokud nejsou opraveny **SEC-01 až SEC-09**:

- nasazujte jen s **fiktivními daty** (žádná reálná jména a e-maily),
- nastavte vlastní silný `JWT_SECRET` a hesla k DB,
- nevystavujte porty databází,
- ideálně dejte před celou aplikaci heslo (HTTP Basic Auth v nginx / Caddy) nebo ji pouštějte jen přes tunel.

## Varianty v ČR

| Poskytovatel | Typ | Docker | Mongo + Postgres | Cena (orientačně) | Poznámka |
| --- | --- | --- | --- | --- | --- |
| **Roští.cz** | PaaS (Node.js aplikace + Docker „stacky“) | ✅ | ✅ (v kontejnerech stacku; Postgres i jako služba) | **0 Kč pro školní projekty** (kód do konce prázdnin), jinak od ~197 Kč/měs. | Nejlepší shoda. Odpověď Roští je přímo v `Schůzka_7_10_2025…docx`. Každý student má vlastní účet, vyučující je „člen firmy“. |
| Exeon.io | PaaS / hosting s garantovaným výkonem | ověřit | ověřit | ~359 Kč/měs. (dle `FG App - aktuální stav.docx`) | Bez zkušenosti s Mongo — zeptat se. |
| WEDOS (VPS ON / VPS SSD) | VPS | ✅ (sami nainstalujete) | ✅ | stovky Kč/měs. dle konfigurace | Datacentrum v Hluboké n. Vlt. Server spravujete sami. |
| Forpsi, Active24, Master Internet, Thinline aj. | VPS | ✅ | ✅ | ~150–500 Kč/měs. za 2 GB RAM | Obdobné; vybírat podle podpory a ceny. |
| Školní server / partner | vlastní HW | ✅ | ✅ | 0 Kč (elektřina, správa) | Zmíněno v zadání („na OA? Partner?“). Potřebuje veřejnou IP nebo tunel a někoho, kdo ho spravuje. |

Sdílený webhosting (PHP + MySQL) **nestačí** — nepodporuje trvale běžící Node.js ani MongoDB.

## Doporučení

### Teď na testování (zdarma, hned)

1. **Tunel z vašeho PC (nejrychlejší, 5 minut).** Spusťte stack podle [LOKALNI-PROSTREDI.md](LOKALNI-PROSTREDI.md) a pak:
   ```
   cloudflared tunnel --url http://localhost:3000
   ```
   Dostanete dočasnou HTTPS adresu `https://…trycloudflare.com`, kterou otevřou studenti na mobilu. Běží, jen dokud běží váš počítač. Vhodné na hodinu / ukázku. Instalace: `winget install Cloudflare.cloudflared`.
2. **Roští.cz se školním kódem.** Požádejte Roští o kód pro školní projekt (viz e-mail v zadání) a nasaďte kořenový `docker-compose.yml` jako stack. Je to česká firma, data zůstanou v ČR a stejné místo může sloužit i pro ostrý provoz. Doporučuji jako hlavní cestu.
3. **Free cloud mimo ČR (záloha):**
   - **Oracle Cloud Always Free** — VM (ARM) s několika GB RAM zdarma, region Frankfurt. Pojme celý `docker compose`. Vyžaduje platební kartu při registraci.
   - **GitHub Student Developer Pack** — kredit na DigitalOcean (zmiňuje ho `FG_faze_vyvoje.docx`). Studenti si mohou pustit vlastní testovací VPS.
   - **Render + MongoDB Atlas + Neon** — Node služby na Render free, Mongo na Atlas Free (512 MB), Postgres na Neon Free (0,5 GB), vše s regionem v EU. **Nevhodné pro tuto aplikaci:** Render free službu po 15 minutách nečinnosti uspí (cron nepoběží) a free Postgres na Renderu po 30 dnech vyprší. Hodí se maximálně na ukázku API.

### Ostrý provoz (od jara)

- **Roští.cz** (pokud bude školní kód pokračovat, případně placený tarif), nebo
- **VPS v ČR se 2–4 GB RAM** (WEDOS, Forpsi, Master…) s:
  - `docker compose` (produkční varianta — viz TODO P3: bez dev režimu, bez vystavených portů DB),
  - **Caddy** nebo nginx + Let's Encrypt jako reverse proxy s HTTPS,
  - denní zálohou `pg_dump` + `mongodump` mimo server,
  - automatickými bezpečnostními aktualizacemi OS.

Před ostrým provozem doplnit: produkční Dockerfily, `docker-compose.prod.yml`, správu tajemství (`.env` jen na serveru), monitoring dostupnosti (např. UptimeRobot zdarma na `/v1/health/ping`).
