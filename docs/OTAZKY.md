# Otevřené otázky na zadavatele

Ze zadání v `docs/original/` nejde jednoznačně poznat, jak se má aplikace v těchto bodech chovat.
Odpovědi prosím zapište přímo pod otázku (`**Odpověď:** …`). Pak je přeneseme do [TODO.md](TODO.md)
a do `docs/README.md`, aby z nich vycházeli studenti i AI asistenti.

Otázky jsou seřazené podle toho, jak moc blokují další vývoj.

Stav (13. 11. 2026): všechny otázky prošel zadavatel. Otevřené zůstávají 7, 8, 9, 10, 13, 14, 15, 16, část 18, 20, 21 (úkol), 22, 23 — souhrn pro kolegyni je v [PRO-KOLEGYNI.md](PRO-KOLEGYNI.md). Shrnutí rozhodnutí je v [README.md](README.md#upřesnění-zadání).

## A. Role a oprávnění (blokuje bezpečnostní opravy)

1. Kolik je úrovní rolí a jak se jmenují? Zadání popisuje *systémového admina* (jeden na celou aplikaci), *admina organizace* a *běžného uživatele* (klient nebo operátor instituce), ale entita „Účet“ uvádí role `SYSTEM`, `SYSTEM_ADMIN`, `USER`. Je `SYSTEM` technický účet pro cron a `SYSTEM_ADMIN` admin organizace? Navrhuji: `SYSTEM_ADMIN`, `ORG_ADMIN`, `OPERATOR`, `CLIENT`.
   **Odpověď:** Souhlas s rolemi `SYSTEM_ADMIN`, `ORG_ADMIN`, `OPERATOR`, `CLIENT`. Navíc `SYSTEM` = technický aktér pro automatické operace (cron: výplata, trvalé příkazy, úroky, osud). Pod `SYSTEM` se nikdo nepřihlašuje, slouží k označení „kdo operaci provedl“ v historii a auditu. *(13. 11. 2026)*
2. Může jeden uživatel být zároveň klient (má vlastní účet) i operátor instituce? Student OA má svůj účet, nebo jen spravuje instituci?
   **Odpověď:** Ne. Student OA je jen operátor. Kdyby měl být i klientem, musí mít druhý uživatelský účet (a jiné zařízení). Jeden uživatel = jedna role mimo administrátory. *(13. 11. 2026)*
3. Co přesně smí operátor instituce: vidět všechny klienty organizace, nebo jen ty, kteří u instituce mají příkaz? Smí klientovi strhnout peníze jednorázově bez souhlasu (např. pokuta, nákup)?
   **Odpověď:** Na rozsahu viditelnosti zadavateli nezáleží, prioritou je **snadné a rychlé ovládání** — operátor si nemá nic zapisovat ručně. Rozhodnutí (návrh vývojáře, odsouhlasit při review): operátor může **vyhledat kteréhokoli klienta své organizace** (jméno, číslo účtu, **kód klienta**), uvidí ale jen základní údaje (jméno, číslo účtu, kód klienta) — ne zůstatek ani historii. Plné údaje a transakce vidí jen u klientů, kteří mají u jeho instituce službu. Každý klient dostane krátký **kód klienta**, který se dá použít jako VS. *(13. 11. 2026)*
4. Smí vyučující (admin organizace) ručně měnit zůstatky, nebo vše jen přes transakce (opravné platby)?
   **Odpověď:** Ano, admin organizace smí zůstatek přepsat. Ve formuláři je checkbox **„Zaznamenat v historii“**, defaultně zaškrtnutý, s doporučením nechat ho zapnutý (aby změna nebyla pro studenta podezřelá). Pokud ho vypne, změna se v historii klienta neukáže. Implementační poznámka: změna se i tak vždy zapíše do auditního logu viditelného jen adminům, jinak se rozejde zůstatek a součet transakcí. *(13. 11. 2026)*
5. Jsou organizace (školy) od sebe úplně oddělené — mohou studenti různých škol posílat peníze mezi sebou? Sdílí školy fiktivní čas, nebo má každá vlastní? (Zadání říká „čas v rámci celé aplikace“ i „admin organizace řídí čas“.)
   **Odpověď:** Organizace (školy) jsou **oddělené**: student jedné školy nemůže poslat peníze studentovi jiné školy. Platby mezi školami mohou být **volitelné nastavení systémového admina** (defaultně vypnuto, zatím nízká priorita). **Každá škola má vlastní fiktivní čas** (rychlost i datum), aby se navzájem neovlivňovaly. *(13. 11. 2026)*

## B. Peníze, účty a platby

6. Jsou částky celé koruny, nebo i haléře?
   **Odpověď:** Stačí **celé koruny**. *(13. 11. 2026)*
7. Může jít běžný účet do mínusu (kontokorent)? Co se stane, když na trvalý příkaz / osud / splátku nejsou peníze — platba se zamítne, odloží, nebo vznikne dluh/pokuta?
   **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část). Požadavek: ideálně odpovídat skutečnosti.
8. Kolik účtů má student: přesně jeden běžný a jeden spořicí, nebo si může založit další? Zakládají se automaticky s vytvořením uživatele? Jaký je počáteční zůstatek?
   **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
9. Je v aplikaci jen jedna banka (kód 0100), nebo víc bank? Co s platbou na číslo účtu, které v aplikaci neexistuje — zamítnout, nebo „odeslat ven“ (peníze zmizí)?
   **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
10. Musí čísla účtů splňovat kontrolní součet dle ČNB (modulo 11), aby studenti poznali reálný formát?
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
11. Čekající platby se splatností do budoucna — má je klient zadávat sám (plánovaná platba), nebo jde jen o trvalé příkazy instituce?
    **Odpověď:** Umožnit (klient si může zadat platbu se splatností do budoucna), ale nízká priorita — v praxi platby do budoucna většinou zadají instituce trvalým příkazem. *(13. 11. 2026)*
12. Vrácení platby: kdo ho smí provést (operátor, admin, příjemce?) a vrací se celá částka oběma stranám?
    **Odpověď:** Jako v reálné bance: **instituce** může vrátit platbu (u plateb, kde je stranou), **příjemce** může vrátit přijatou platbu odesílateli, **admin** (`ORG_ADMIN`) má právo vrátit jakoukoli platbu své školy, ale jen výjimečně (podvod). Vrácení = nová protitransakce (obě strany), původní platba zůstává v historii. *(13. 11. 2026)*

## C. Spořicí účet a úroky

13. Pásma úroků: konkrétní hranice a sazby (seed teď má 0–19 999 Kč 2,5 %, 20 000–99 999 Kč 1,8 %, nad 100 000 Kč 1,2 %). Platí sazba pro celý zůstatek, nebo po částech (jako reálné „pásmové úročení“)?
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
14. Jak často se úrok připisuje (měsíčně ve fiktivním čase?) a kam — vždy na spořicí, nebo si student volí běžný účet?
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
15. Může vyučující sazby měnit během hry? Má být víc typů spořicích účtů?
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
16. Zdaňuje se úrok (15 % srážková daň)? Pro výuku FG by to dávalo smysl.
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).

## D. Fiktivní čas, mzda, trvalé příkazy

17. Kdy se čas zastaví? (Mimo vyučovací hodiny, o víkendu, o prázdninách.) Kdo ho spouští a pauzuje?
    **Odpověď:** Hra neběží dlouhodobě: studenti přijedou na školu, dostanou přihlašovací údaje a **několik hodin** hrají, pak se hra vyhodnotí. Pozastavení času jen **ručně** (tlačítko pauza/pokračovat), nic automatického ani podle rozvrhu. *(13. 11. 2026)*
18. Mzda: stejná pro všechny, nebo podle „povolání“ studenta? Kdo je odesílatel (fiktivní zaměstnavatel)? Chodí měsíčně ve fiktivním čase, nebo „každých X minut“?
    **Odpověď:** Odesílatel a výše mzdy: nevím — zjistí zadavatel / kolegyně. Interval: **měsíčně ve fiktivním čase** (ne v reálných minutách) — pak mzda sama reaguje na pauzu i změnu rychlosti. *(13. 11. 2026)*
19. „Checkbox na přepočet aktuálně zadaných příkazů“ v nastavení organizace — co přesně se má přepočítat? (Posunout termíny po změně data/rychlosti?)
    **Odpověď:** Ano, jde o posun termínů. Závěr: při **změně rychlosti** přepočet netřeba, pokud jsou termíny uložené ve fiktivním čase (příkaz jen dojde dřív/později). Smysl by měl jen při **změně data** → rozhodnout spolu s otázkou 20. Checkbox zatím neimplementovat. *(13. 11. 2026)*
20. Pokud se čas posune skokem (např. o 3 měsíce), mají se zpětně provést všechny zmeškané platby a výplaty, nebo jen jedna?
    **Odpověď:** nevím — zadavatel se zeptá. Předpoklad: skákat v čase se nebude. *(13. 11. 2026)*

## E. Šablony, instituce, osud

21. Jaké instituce budou na startu (banka, pojišťovna, energetika, nájem, obchod, …)? Připravíte seznam šablon s částkami, nebo je vymýšlí studenti OA?
    **Odpověď:** Připraví kolegyně (ekonomická část) — zadání úkolu je v [PRO-KOLEGYNI.md](PRO-KOLEGYNI.md#úkol-instituce-šablony-a-osudy). Vstupní formát pro import (JSON) připraví vývoj podle jejích podkladů. *(13. 11. 2026)*
22. Půjčka: jen jednorázový příjem + pevná splátka, nebo i úrok, RPSN a předčasné splacení? Investice a Bitcoin — je to v rozsahu letošního roku?
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).
23. Osud: jak často a komu se má spouštět (náhodně všem, náhodně jednotlivcům, ručně vyučujícím)? Může osud stáhnout víc, než má student na účtu?
    **Odpověď:** nevím — zjistí zadavatel / kolegyně (ekonomická část).

## F. Uživatelé a data

24. Bude se pracovat s reálnými jmény studentů a e-maily? (Pokud ano: GDPR — souhlas, kdo je správce, mazání po skončení roku, hosting v EU.) Stačí pseudonymy?
    **Odpověď:** **Pseudonymy.** Loginy obecně `student01`, `student02`… Student si může nastavit přezdívku / zobrazované jméno. E-mail jen volitelně, aby mu po hře přišel souhrn. Žádná reálná jména nejsou potřeba. *(13. 11. 2026)*
25. Formát hromadného importu uživatelů (CSV sloupce? export z Bakalářů?). Jak se studenti dozví heslo — generuje ho systém, musí ho při prvním přihlášení změnit?
    **Odpověď:** Stačí, když vyučující zadá **počet** a systém vygeneruje účty s **jednoduchými hesly** (k vytištění). Bez importu ze seznamu, bez povinné změny hesla — hra trvá pár hodin, riziko zneužití je malé. *(13. 11. 2026)*
26. Co se stane s daty na konci školního roku — smazat, archivovat, resetovat hru?
    **Odpověď:** Po hře **archivovat** (výsledky a data zůstanou k nahlédnutí) a pak **resetovat** na novou hru pro další skupinu. *(13. 11. 2026)*

## G. Technika a provoz

27. Frontend: trvat na Handlebars (zadání), nebo ponechat statické HTML + JS, které už je hotové? Případně jiný framework?
    **Odpověď:** Na Handlebars se netrvá (byla to jen volba kvůli znalosti HTML/CSS; vývoj teď běží přes AI). Doporučení vývoje: **ponechat statické HTML + JS** (bez build kroku, studenti kód přečtou, AI s ním umí), sdílené pomocné funkce v `apps/web/js/` (API, escapování HTML, tabulky, stránkování). Framework (např. Alpine.js) přidat až při konkrétní potřebě. *(13. 11. 2026)*
28. Kde a kdy poběží ostrý provoz (viz [HOSTING.md](HOSTING.md))? Kdo bude server spravovat po odchodu studentů? Máte k dispozici doménu školy?
    **Odpověď:** Školní server, nebo hosting (např. Roští) — podle nabídky školního správce IT. Doména se pořídí později. Zatím není priorita. *(13. 11. 2026)*
29. Kolik současně: zadání říká 50 uživatelů — na jednu školu, nebo pro všechny školy dohromady?
    **Odpověď:** Zatím **jedna škola** najednou (jedna skupina). Více škol současně je vize — datový model s `organizationId` zachovat, výkon na to zatím neladit. *(13. 11. 2026)*
30. Platí ještě větve `production` / `test` / `dev` z `FG_faze_vyvoje.docx` i pro toto monorepo, nebo stačí `main` + větve na úkoly + PR?
    **Odpověď:** Podle doporučení vývoje: `main` + **větev na každý úkol** (ID z TODO v názvu, např. `sec-01-auth-middleware`) + **pull request** s review; `main` chráněná a vždy spustitelná. Větve `production`/`test`/`dev` se v monorepu nepoužívají. *(13. 11. 2026)*
