# Otevřené otázky na zadavatele

Ze zadání v `docs/original/` nejde jednoznačně poznat, jak se má aplikace v těchto bodech chovat.
Odpovědi prosím zapište přímo pod otázku (`**Odpověď:** …`). Pak je přeneseme do [TODO.md](TODO.md)
a do `docs/README.md`, aby z nich vycházeli studenti i AI asistenti.

Otázky jsou seřazené podle toho, jak moc blokují další vývoj.

## A. Role a oprávnění (blokuje bezpečnostní opravy)

1. Kolik je úrovní rolí a jak se jmenují? Zadání popisuje *systémového admina* (jeden na celou aplikaci), *admina organizace* a *běžného uživatele* (klient nebo operátor instituce), ale entita „Účet“ uvádí role `SYSTEM`, `SYSTEM_ADMIN`, `USER`. Je `SYSTEM` technický účet pro cron a `SYSTEM_ADMIN` admin organizace? Navrhuji: `SYSTEM_ADMIN`, `ORG_ADMIN`, `OPERATOR`, `CLIENT`.
   **Odpověď:**
2. Může jeden uživatel být zároveň klient (má vlastní účet) i operátor instituce? Student OA má svůj účet, nebo jen spravuje instituci?
   **Odpověď:**
3. Co přesně smí operátor instituce: vidět všechny klienty organizace, nebo jen ty, kteří u instituce mají příkaz? Smí klientovi strhnout peníze jednorázově bez souhlasu (např. pokuta, nákup)?
   **Odpověď:**
4. Smí vyučující (admin organizace) ručně měnit zůstatky, nebo vše jen přes transakce (opravné platby)?
   **Odpověď:**
5. Jsou organizace (školy) od sebe úplně oddělené — mohou studenti různých škol posílat peníze mezi sebou? Sdílí školy fiktivní čas, nebo má každá vlastní? (Zadání říká „čas v rámci celé aplikace“ i „admin organizace řídí čas“.)
   **Odpověď:**

## B. Peníze, účty a platby

6. Jsou částky celé koruny, nebo i haléře?
   **Odpověď:**
7. Může jít běžný účet do mínusu (kontokorent)? Co se stane, když na trvalý příkaz / osud / splátku nejsou peníze — platba se zamítne, odloží, nebo vznikne dluh/pokuta?
   **Odpověď:**
8. Kolik účtů má student: přesně jeden běžný a jeden spořicí, nebo si může založit další? Zakládají se automaticky s vytvořením uživatele? Jaký je počáteční zůstatek?
   **Odpověď:**
9. Je v aplikaci jen jedna banka (kód 0100), nebo víc bank? Co s platbou na číslo účtu, které v aplikaci neexistuje — zamítnout, nebo „odeslat ven“ (peníze zmizí)?
   **Odpověď:**
10. Musí čísla účtů splňovat kontrolní součet dle ČNB (modulo 11), aby studenti poznali reálný formát?
    **Odpověď:**
11. Čekající platby se splatností do budoucna — má je klient zadávat sám (plánovaná platba), nebo jde jen o trvalé příkazy instituce?
    **Odpověď:**
12. Vrácení platby: kdo ho smí provést (operátor, admin, příjemce?) a vrací se celá částka oběma stranám?
    **Odpověď:**

## C. Spořicí účet a úroky

13. Pásma úroků: konkrétní hranice a sazby (seed teď má 0–19 999 Kč 2,5 %, 20 000–99 999 Kč 1,8 %, nad 100 000 Kč 1,2 %). Platí sazba pro celý zůstatek, nebo po částech (jako reálné „pásmové úročení“)?
    **Odpověď:**
14. Jak často se úrok připisuje (měsíčně ve fiktivním čase?) a kam — vždy na spořicí, nebo si student volí běžný účet?
    **Odpověď:**
15. Může vyučující sazby měnit během hry? Má být víc typů spořicích účtů?
    **Odpověď:**
16. Zdaňuje se úrok (15 % srážková daň)? Pro výuku FG by to dávalo smysl.
    **Odpověď:**

## D. Fiktivní čas, mzda, trvalé příkazy

17. Kdy se čas zastaví? (Mimo vyučovací hodiny, o víkendu, o prázdninách.) Kdo ho spouští a pauzuje?
    **Odpověď:**
18. Mzda: stejná pro všechny, nebo podle „povolání“ studenta? Kdo je odesílatel (fiktivní zaměstnavatel)? Chodí měsíčně ve fiktivním čase, nebo „každých X minut“?
    **Odpověď:**
19. „Checkbox na přepočet aktuálně zadaných příkazů“ v nastavení organizace — co přesně se má přepočítat? (Posunout termíny po změně data/rychlosti?)
    **Odpověď:**
20. Pokud se čas posune skokem (např. o 3 měsíce), mají se zpětně provést všechny zmeškané platby a výplaty, nebo jen jedna?
    **Odpověď:**

## E. Šablony, instituce, osud

21. Jaké instituce budou na startu (banka, pojišťovna, energetika, nájem, obchod, …)? Připravíte seznam šablon s částkami, nebo je vymýšlí studenti OA?
    **Odpověď:**
22. Půjčka: jen jednorázový příjem + pevná splátka, nebo i úrok, RPSN a předčasné splacení? Investice a Bitcoin — je to v rozsahu letošního roku?
    **Odpověď:**
23. Osud: jak často a komu se má spouštět (náhodně všem, náhodně jednotlivcům, ručně vyučujícím)? Může osud stáhnout víc, než má student na účtu?
    **Odpověď:**

## F. Uživatelé a data

24. Bude se pracovat s reálnými jmény studentů a e-maily? (Pokud ano: GDPR — souhlas, kdo je správce, mazání po skončení roku, hosting v EU.) Stačí pseudonymy?
    **Odpověď:**
25. Formát hromadného importu uživatelů (CSV sloupce? export z Bakalářů?). Jak se studenti dozví heslo — generuje ho systém, musí ho při prvním přihlášení změnit?
    **Odpověď:**
26. Co se stane s daty na konci školního roku — smazat, archivovat, resetovat hru?
    **Odpověď:**

## G. Technika a provoz

27. Frontend: trvat na Handlebars (zadání), nebo ponechat statické HTML + JS, které už je hotové? Případně jiný framework?
    **Odpověď:**
28. Kde a kdy poběží ostrý provoz (viz [HOSTING.md](HOSTING.md))? Kdo bude server spravovat po odchodu studentů? Máte k dispozici doménu školy?
    **Odpověď:**
29. Kolik současně: zadání říká 50 uživatelů — na jednu školu, nebo pro všechny školy dohromady?
    **Odpověď:**
30. Platí ještě větve `production` / `test` / `dev` z `FG_faze_vyvoje.docx` i pro toto monorepo, nebo stačí `main` + větve na úkoly + PR?
    **Odpověď:**
