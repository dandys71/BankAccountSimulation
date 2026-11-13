# Podklady k doplnění — ekonomická část

## O co jde

Ve výukové aplikaci simulujeme banku:

- **Studenti SOU** jsou klienti. Mají běžný a spořicí účet, vidí zůstatek a historii a posílají platby.
- **Studenti OA** obsluhují instituce (banka, pojišťovna, energie, obchod…). Sjednávají klientům produkty (půjčka, pojištění) a zadávají jim trvalé příkazy.
- **Vyučující** řídí hru: spouští a pozastavuje čas, nastavuje mzdu a zakládá studenty.

Hra je **jednorázová akce na několik hodin**. Studenti přijedou na školu, dostanou přihlašovací údaje (`student01`, `student02`…), hrají a na konci se hra vyhodnotí. Čas ve hře běží **zrychleně**: jeden měsíc trvá zhruba 15–20 minut, takže se za odpoledne „prožije“ zhruba rok. Částky jsou v **celých korunách**.

Pro programátory a AI potřebujeme vědět, jak se má aplikace v situacích níže chovat. Ideálně **jako ve skutečnosti**, ale zjednodušeně tak, aby to studenti za pár hodin pochopili. Odpovědět stačí volným textem pod otázkou. Pokud existuje víc rozumných variant, vyberte jednu, nebo napište, ať je to nastavitelné.

Co je už rozhodnuté (pro kontext):

- Každá škola má svůj fiktivní čas. Studenti různých škol si peníze neposílají.
- Mzda chodí jednou za **fiktivní** měsíc.
- Platbu může vrátit instituce i příjemce, vyučující jen výjimečně.
- Vyučující smí ručně změnit zůstatek. Změna se standardně zapíše do historie.

---

## Otevřené otázky

### Účty a platby

**1. Může běžný účet jít do mínusu?** *(v seznamu otázek č. 7)*
Co se má stát, když na platbu nejsou peníze? Týká se to trvalého příkazu (nájem), splátky půjčky i nečekaného výdaje (osud). Možnosti, mezi kterými volíme:

- a) platba se **zamítne** a student o ni přijde (nájem nezaplacen, žádný následek),
- b) platba se zamítne a naúčtuje se **poplatek nebo upomínka**,
- c) účet jde **do mínusu** (povolený kontokorent do určité výše, s úrokem?),
- d) vznikne **dluh**, který se strhne z příští výplaty,
- e) něco jiného.

Platí totéž pro jednorázovou platbu, kterou zadá student sám? (Tam ji teď aplikace zamítne.)

**2. Jaké účty student na začátku dostane a s jakým zůstatkem?** *(č. 8)*

- Jen běžný účet, nebo běžný i spořicí?
- Může si během hry založit další účet (třeba druhý spořicí)?
- Jaký je **počáteční zůstatek**? Nulový a první je až výplata, nebo nějaká „startovní“ částka?

**3. Jedna banka, nebo víc bank?** *(č. 9)*
Teď je ve hře jedna banka (kód 0100).

- Má být víc bank s různými produkty a podmínkami (úroky, poplatky), aby studenti mohli porovnávat?
- Co s platbou na číslo účtu, které ve hře neexistuje? Zamítnout („účet neexistuje“), nebo ji „odeslat ven“, kdy peníze odejdou a nikomu nepřijdou?

**4. Má číslo účtu vypadat jako skutečné?** *(č. 10)*
Česká čísla účtů mají kontrolní součet podle ČNB. Má ho aplikace dodržovat, aby studenti viděli reálný formát (a překlep v čísle se odhalil)? Nebo stačí smyšlené číslo ve tvaru `123456789/0100`?

### Spořicí účet

**5. Jaké jsou úrokové sazby podle výše vkladu?** *(č. 13)*
Zadání říká, že čím větší částka, tím menší sazba, a uvádí 2–3 pásma. Pro ukázku je teď v aplikaci:

| Zůstatek | Sazba p. a. |
| --- | --- |
| 0 – 19 999 Kč | 2,5 % |
| 20 000 – 99 999 Kč | 1,8 % |
| od 100 000 Kč | 1,2 % |

- Jaké hranice a sazby chcete?
- Platí sazba **pro celý zůstatek** (kdo má 50 000 Kč, má 1,8 % ze všeho)? Nebo **po částech**, jak to dělají skutečné banky (prvních 20 000 Kč za 2,5 %, zbytek za 1,8 %)?

**6. Jak často a kam se připisuje úrok?** *(č. 14)*

- Měsíčně ve fiktivním čase (tedy každých zhruba 15–20 minut), čtvrtletně, nebo jinak?
- Vždy na spořicí účet, nebo si student může zvolit převod na běžný účet?

**7. Může vyučující měnit sazby během hry?** *(č. 15)*
Například „ČNB zvedla sazby“ jako událost. A má být víc typů spořicích účtů (bez výpovědní lhůty, s výpovědní lhůtou a vyšším úrokem, termínovaný vklad)?

**8. Zdaňuje se úrok?** *(č. 16)*
Ve skutečnosti banka strhne 15% srážkovou daň. Chcete to ve hře mít (studenti vidí hrubý úrok a daň), nebo pro jednoduchost ne?

### Mzda

**9. Jaká je mzda a kdo ji posílá?** *(č. 18)*

- Stejná pro všechny, nebo podle „povolání“, které student na začátku dostane (třeba kuchař, mechanik, prodavač)?
- Kdo je v historii plateb uveden jako odesílatel? Fiktivní zaměstnavatel (jméno, číslo účtu)?
- Má být mzda hrubá a čistá (odvody, daň), nebo jen čistá částka?

### Čas

**10. Co se stane při skoku v čase?** *(č. 20; na tuto otázku se ptá zadavatel)*
Když vyučující posune kalendář třeba o 3 měsíce dopředu, má aplikace zpětně provést všechno zmeškané (3 výplaty, 3 nájmy, 3 splátky)? Nebo jen jedno kolo, nebo nic a pokračovat od nového data? Předpoklad je, že se v čase skákat nebude.

### Produkty a události

**11. Jak má fungovat půjčka? Patří do hry investice?** *(č. 22)*

- Stačí jednoduchá podoba „dostanu jednorázově X Kč a pak splácím pevnou splátku N měsíců“?
- Nebo i úrok, RPSN, poplatek za sjednání, předčasné splacení a sankce za nesplácení?
- Investice (fondy, akcie) a Bitcoin zadání zmiňuje. Patří do letošního rozsahu, nebo až později? Pokud ano, jak se má měnit jejich hodnota (náhodně, podle připraveného „scénáře trhu“)?

**12. Jak má fungovat osud (nečekaná událost)?** *(č. 23)*
Například rozbitá pračka, oprava auta, narození dítěte nebo výhra v loterii.

- **Kdo ho spouští:** náhodně aplikace, ručně vyučující, nebo obojí?
- **Komu:** všem najednou (třeba „zdražení energií“), nebo náhodně vybraným jednotlivcům?
- **Jak často:** třeba 1–2 osudy na studenta za hru?
- Může osud strhnout víc, než má student na účtu? (Souvisí s otázkou 1.)

---

## Úkol: katalog institucí, šablon a osudů

*(č. 21)* Aplikace potřebuje „katalog“, se kterým hra začne: jaké instituce ve hře jsou, jaké produkty nabízejí a jaké nečekané události mohou nastat.

**Vyplňte prosím přiloženou tabulku [`podklady/katalog-instituci-sablon-osudu.xlsx`](podklady/katalog-instituci-sablon-osudu.xlsx).** Otevře se v Excelu, LibreOffice i v Google Sheets (Soubor → Importovat). Do formátu pro aplikaci (JSON) ji pak převedeme my.

Má pět listů:

1. **Návod**: jak tabulku vyplňovat a vysvětlení pojmů.
2. **Instituce**: firmy a úřady ve hře. U každé název, typ, krátký popis a jestli ji obsluhuje student OA.
3. **Šablony plateb**: produkty institucí. Jeden řádek je jedna platba. Produkt s více platbami má víc řádků se stejným názvem. Například půjčka má řádek „příjem 50 000 Kč jednorázově“ a řádek „výdaj 2 300 Kč měsíčně, 24×“. U každého produktu vyberte, jestli ho dostanou **všichni na začátku** (nájem, energie), nebo **jen ten, kdo si ho sjedná** u operátora (půjčka, pojištění).
4. **Osudy**: nečekané události s popisem pro studenta, částkou (pevnou, nebo rozmezím od–do) a tím, jak často a komu nastanou.
5. **Výchozí hodnoty**: počáteční zůstatky, mzda, odesílatel mzdy, délka fiktivního měsíce a délka hry.

Šedé řádky kurzívou jsou vzor. Vyplňujte žlutá pole. Kde je u buňky šipka, vybírá se ze seznamu. Když něco nevíte, nechte buňku prázdnou nebo napište otázku do sloupce Poznámka.
