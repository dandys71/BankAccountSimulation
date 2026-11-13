# Dokumentace produktu

## Pracovní dokumenty

- [TODO.md](TODO.md) — co je hotové, co zbývá, bezpečnostní nálezy (P0 opravit jako první).
- [OTAZKY.md](OTAZKY.md) — otevřené otázky na zadavatele. Odpovědi se pak přenesou sem a do TODO.
- [LOKALNI-PROSTREDI.md](LOKALNI-PROSTREDI.md) — jak aplikaci spustit na vlastním PC.
- [PRO-KOLEGYNI.md](PRO-KOLEGYNI.md) — otevřené ekonomické otázky a úkol připravit katalog institucí, šablon a osudů.
- [HOSTING.md](HOSTING.md) — požadavky na server a varianty hostingu v ČR i zdarma na test.

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

Role v zadání jsou `SYSTEM`, `SYSTEM_ADMIN` a `USER`. Frontend má klientskou část, operátorskou část a administraci. Dnešní HTML pokrývá přihlášení, přehled účtů, detail a dvě obrazovky platby (klientská část) a volá API přes nginx proxy. Operátorská a administrátorská část zatím chybí.

## Upřesnění zadání

Odpovědi zadavatele na [OTAZKY.md](OTAZKY.md). Mají přednost před `original/`, kde si s nimi odporují.

**Role** (otázky 1–2)

| Role | Kdo | Poznámka |
| --- | --- | --- |
| `SYSTEM_ADMIN` | správce celé aplikace (jeden) | zakládá organizace a jejich adminy, globální nastavení |
| `ORG_ADMIN` | vyučující, admin organizace (školy) | čas a mzda své školy, instituce, uživatelé |
| `OPERATOR` | student OA, spravuje jednu instituci | jen operátor, nemá vlastní bankovní účet |
| `CLIENT` | student SOU | běžný a spořicí účet |
| `SYSTEM` | technický aktér, nikdo se pod ním nepřihlašuje | označuje automatické operace (cron: mzda, trvalé příkazy, úroky, osud) v historii a auditu |

Jeden uživatel má jednu z rolí `OPERATOR`/`CLIENT`. Kdo potřebuje obojí, dostane dva účty.

**Operátor a klienti** (otázka 3): priorita je rychlé ovládání bez ručního zapisování. Operátor vyhledá kteréhokoli klienta své organizace podle jména, čísla účtu nebo **kódu klienta** a vidí jen základní údaje (jméno, číslo účtu, kód klienta). Zůstatek a transakce vidí jen u klientů, kteří mají u jeho instituce službu. Kód klienta je krátký identifikátor použitelný jako VS.

**Ruční změna zůstatku** (otázka 4): `ORG_ADMIN` smí zůstatek přepsat. Checkbox „Zaznamenat v historii“ je defaultně zapnutý, s doporučením ho nechat. Když ho vypne, klient změnu v historii nevidí, ale vždy se zapíše do auditního logu pro adminy.

**Oddělení škol** (otázka 5): organizace jsou oddělené, platby mezi školami nejdou. Povolení plateb mezi školami je volitelné nastavení `SYSTEM_ADMIN` (defaultně vypnuto, nízká priorita). **Každá organizace má vlastní fiktivní čas** (datum i rychlost) a vlastní nastavení mzdy.

**Částky** (otázka 6): jen celé koruny.

**Plánované platby** (otázka 11): klient smí zadat platbu se splatností do budoucna (nízká priorita). Běžně je zadávají instituce trvalým příkazem.

**Vrácení platby** (otázka 12): smí instituce (u plateb, kde je stranou), příjemce (vrátí přijatou platbu odesílateli) a výjimečně `ORG_ADMIN` u jakékoli platby své školy (podvod). Vrácení je nová protitransakce pro obě strany. Původní platba zůstává v historii.

**Průběh hry** (otázka 17): hra je jednorázová akce na několik hodin. Studenti přijedou, dostanou přihlašovací údaje, hrají a na konci se hra vyhodnotí. Čas se pozastavuje jen ručně (pauza/pokračovat).

**Studenti a data** (otázky 24–26): žádné reálné údaje. Loginy `student01`, `student02`… s jednoduchými hesly vygeneruje systém podle zadaného počtu (k vytištění). Bez importu a bez povinné změny hesla. Student si může nastavit přezdívku a volitelně e-mail pro souhrn po hře. Po hře se data **archivují** a hra se **resetuje** pro další skupinu.

**Technika** (otázky 27–30): frontend zůstává statické HTML + JS (Handlebars není nutné). Zatím běží jedna škola najednou, více škol je výhled (model s `organizationId` zachovat). Hosting (školní server nebo Roští) a doména zatím nejsou priorita. Git: `main` + větev na úkol + pull request.

**Mzda a termíny** (otázky 18–19): mzda chodí **měsíčně ve fiktivním čase**. Všechny termíny (trvalé příkazy, mzda, úroky) se ukládají ve fiktivním čase, takže změna rychlosti nevyžaduje přepočet. Checkbox „přepočet příkazů“ se zatím nedělá.

## Hranice kódu

- Uživatel, organizace, instituce a vydání JWT: `services/auth`
- Účty, transakce, spoření a trvalé příkazy: `services/transactions`
- Obrazovky: `apps/web`
