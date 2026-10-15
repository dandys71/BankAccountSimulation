# Dokumentace produktu

Složka `original/` obsahuje zadání tak, jak vzniklo. Ber ji jako zdroj požadavků. Tento soubor je jen rejstřík, aby šlo zadání najít bez otevírání Wordu.

## Originály

- `FG_Pozadavky_pro_webovou_aplikaci.docx` a stejnojmenné PDF — funkční a nefunkční požadavky, návrh tabulek a scénáře pro AuthManager, TransactionManager a frontend (klient, operátor, administrátor).
- `FG_Entity_DB.docx` — entity: bankovní účet, spořicí účet, transakce, účet uživatele, tokeny, trvalé příkazy.
- `FG_faze_vyvoje.docx` — postup od mock API přes napojení databáze po propojení s frontendem. Větve `dev`, `test` a `production` popisuje pro původní oddělené repozitáře.
- `FG App - aktuální stav.docx` — domluvené mikroslužby a tehdejší harmonogram. Databáze se v textu zmiňuje jako MySQL/MariaDB; implementace už je jiná (MongoDB a PostgreSQL) a ta se nemění zpět.
- `Požadavky na aplikaci pro výuku Finanční gramotnosti.docx` — otevřené otázky k produktům, registraci, QR platbám, administraci a fiktivnímu času.
- `Schůzka_7_10_2025_nástroje_endpointy.docx` — Node 22, REST pod `/v1/`, AuthManager na portu 5000, TransactionManager na portu 5001, společný JWT secret.

## Co má aplikace dělat

Student pracuje s fiktivní bankou: vidí běžný a spořicí účet, zůstatek, historii a zadá platbu (částka, účty, variabilní, specifický a konstantní symbol, komentář, poznámka). Trvalé příkazy spravuje instituce, ne klient. Spořicí účet má úrokovou sazbu podle výše vkladu. Aplikace má fiktivní čas, který může obsluha zrychlit, a v něm běží výplaty a trvalé příkazy.

Role v zadání jsou `SYSTEM`, `SYSTEM_ADMIN` a `USER`. Frontend má klientskou část, operátorskou část a administraci. Dnešní HTML pokrývá přihlášení, přehled účtů, detail a dvě obrazovky platby a na API ještě není napojené.

## Hranice kódu

- Uživatel, organizace, instituce a vydání JWT: `services/auth`
- Účty, transakce, spoření a trvalé příkazy: `services/transactions`
- Obrazovky: `apps/web`
