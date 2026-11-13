# Podklady k doplnění — ekonomická část

Ve výukové aplikaci simulujeme banku. Studenti SOU jsou klienti s běžným a spořicím účtem, studenti OA obsluhují instituce (pojišťovna, energie, obchod…). Hra trvá **několik hodin** na jedné akci, ve **zrychleném fiktivním čase**: jeden měsíc trvá zhruba 15–20 minut. Částky jsou v **celých korunách**.

Potřebujeme vědět, jak se má aplikace v následujících situacích chovat. Ideálně „jako ve skutečnosti“, ale zjednodušeně tak, aby to studenti za pár hodin pochopili. Odpovědět stačí volným textem. Pokud u některé otázky existuje víc rozumných variant, napište, kterou chcete.

## Otevřené otázky

**Účty a platby**

1. *(ot. 7)* **Může běžný účet jít do mínusu (kontokorent)?** A co se má stát, když na trvalý příkaz, splátku nebo nečekaný výdaj (osud) nejsou peníze? Platba se zamítne, odloží, nebo vznikne dluh či pokuta (jaká)?
2. *(ot. 8)* **Jaké účty student na začátku dostane?** Jen běžný, nebo běžný i spořicí? Může si během hry založit další? S jakým **počátečním zůstatkem** začíná?
3. *(ot. 9)* **Jedna banka, nebo víc bank?** Pokud víc, liší se produkty (úroky, poplatky)? A co platba na číslo účtu, které ve hře neexistuje: zamítnout, nebo „odeslat ven“?
4. *(ot. 10)* **Formát čísla účtu:** mají čísla splňovat skutečný kontrolní součet ČNB (aby studenti viděli reálný formát), nebo stačí smyšlené číslo?

**Spořicí účet**

5. *(ot. 13)* **Úrokové sazby podle výše vkladu:** jaké hranice a sazby? Teď je v aplikaci pro ukázku 0–19 999 Kč za 2,5 %, 20 000–99 999 Kč za 1,8 % a od 100 000 Kč za 1,2 %. Platí sazba **pro celý zůstatek**, nebo **po částech** (do 20 000 Kč jedna sazba, nad ni jiná)?
6. *(ot. 14)* **Připisování úroku:** jak často (např. měsíčně ve fiktivním čase) a kam? Vždy na spořicí účet, nebo si student může zvolit běžný?
7. *(ot. 15)* **Může vyučující sazby během hry měnit?** Má být víc typů spořicích účtů?
8. *(ot. 16)* **Zdanění úroku** (15% srážková daň): ano, nebo pro jednoduchost ne?

**Mzda**

9. *(ot. 18)* **Výše mzdy:** stejná pro všechny, nebo podle „povolání“, které student dostane? **Kdo je odesílatel** (fiktivní zaměstnavatel)? *Už rozhodnuto: mzda chodí jednou za fiktivní měsíc.*

**Čas**

10. *(ot. 20)* **Posun času skokem:** když vyučující posune čas třeba o 3 měsíce dopředu, mají se zpětně provést všechny zmeškané výplaty a platby (3 výplaty, 3 nájmy), jen jedna, nebo žádná? *(Na tuhle se ptá zadavatel. Předpoklad je, že se skákat nebude.)*

**Produkty a události**

11. *(ot. 22)* **Půjčka:** stačí „dostanu jednorázově X Kč a pak splácím pevnou splátku“, nebo i úrok, RPSN a předčasné splacení? **Investice a Bitcoin:** patří do letošního rozsahu?
12. *(ot. 23)* **Osud** (nečekaná událost: rozbitá pračka, výhra v loterii…): jak často a komu se má spouštět? Náhodně všem, náhodně jednotlivcům, nebo ručně vyučujícím? Může osud stáhnout víc, než má student na účtu?

## Úkol: instituce, šablony a osudy

*(ot. 21)* Aplikace potřebuje „katalog“, se kterým hra začne. Prosím připravte ho v tabulce (Excel nebo Google Sheets, tři listy). Do formátu pro import (JSON) ho pak převedeme my. Pokud něco nevíte, buňku nechte prázdnou nebo do ní napište otázku.

### List 1 — Instituce

Firmy a úřady, které ve hře vystupují a které obsluhují studenti OA.

| Sloupec | Význam | Příklad |
| --- | --- | --- |
| Název | jak se instituce jmenuje ve hře | Pojišťovna Jistota |
| Typ | banka / pojišťovna / energie / bydlení / obchod / zaměstnavatel / úřad / jiné | pojišťovna |
| Krátký popis | jedna věta pro studenty | Povinné ručení a pojištění domácnosti |
| Obsluhuje student OA? | ano = má operátora; ne = běží automaticky | ano |

### List 2 — Šablony plateb (produkty institucí)

Jedna šablona je jeden produkt, který může mít **víc plateb**. Například půjčka má jednorázový příjem a pravidelnou splátku. Každá platba šablony je na samostatném řádku a řádky jedné šablony mají stejný název šablony.

| Sloupec | Význam | Příklad (2 řádky = 1 šablona) |
| --- | --- | --- |
| Instituce | název z listu 1 | Banka Hvězda / Banka Hvězda |
| Název šablony | produkt | Spotřebitelská půjčka 50 000 / Spotřebitelská půjčka 50 000 |
| Příjem / výdaj | z pohledu studenta | příjem / výdaj |
| Typ částky | pevná / náhodná (rozmezí) | pevná / pevná |
| Částka (Kč) | jen u pevné | 50 000 / 2 300 |
| Min – max (Kč) | jen u náhodné, např. elektřina | — / — |
| Interval | jednorázově / denně / týdně / měsíčně / čtvrtletně / pololetně / ročně | jednorázově / měsíčně |
| První platba | ihned / od dalšího období | ihned / od dalšího období |
| Konec | bez konce / počet plateb / do data | — / 24 plateb |
| Text pro studenta | komentář v historii plateb | Půjčka / Splátka půjčky |
| Kdo ho dostane | **všichni na začátku hry** (nájem, energie) / **jen kdo si ho sjedná** u operátora (půjčka, pojištění) | jen kdo si sjedná |

### List 3 — Osudy (nečekané události)

| Sloupec | Význam | Příklad |
| --- | --- | --- |
| Název | krátce | Rozbitá pračka |
| Popis pro studenta | co se stalo | Rozbila se ti pračka, musíš koupit novou. |
| Příjem / výdaj | | výdaj |
| Částka | pevná, nebo rozmezí min – max | 6 000 – 12 000 |
| Jak často / komu | souvisí s otázkou 12 výše | 1× za hru náhodně ~20 % studentů |

Vedle toho prosím uveďte **výchozí hodnoty hry**: počáteční zůstatky (otázka 2), výši mzdy (otázka 9) a délku fiktivního měsíce v minutách (zadání uvádí 15–20 minut).
