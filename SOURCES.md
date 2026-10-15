# Odkud kód pochází

Do tohoto repozitáře se soubory zkopírovaly jako snímek. Historie ani větve původních repozitářů se neměnily a nic se do nich nepushovalo.

| Část v tomto repozitáři | Původ | Větev | Commit |
| --- | --- | --- | --- |
| `services/auth` | https://github.com/dandys71/AuthManager | `main` | `25e5a04e570edf7777ffac35b3964c0419f3d03e` |
| `services/transactions` | https://github.com/dandys71/TransactionManager | `schmid-docker` | `7f20978daf6c0646dcbcd18f34098921d6b07e1c` |
| `apps/web` | https://github.com/the-CYCLE-bin/fg-frontend | `main` | `7dba91e488c244a7c2c5afc011f0ca5c9d123531` |
| `docs/original` | lokální složka Dokumenty | — | — |

Větev `master` v TransactionManageru je starší a nemá Drizzle ani funkční Docker. Snímek na `main` proto bere `schmid-docker`.

Studentské větve jsou v tomto repozitáři pod `transaction-manager/` a mají stejné commity jako na původním GitHubu. Checkout té větve přepne celý pracovní strom na původní TransactionManager, bez auth, frontendu a dokumentace.

| Větev zde | Původní větev | Commit |
| --- | --- | --- |
| `transaction-manager/Flégl-Docker` | `Flégl-Docker` | `ec32d73` |
| `transaction-manager/Flégl-Events` | `Flégl-Events` | `67a8f4a` |
| `transaction-manager/Jasa` | `Jasa` | `4914fb9` |
| `transaction-manager/standingOrderSchema.js` | `standingOrderSchema.js` | `9f657cc` |
| `transaction-manager/veverka` | `veverka` | `c2bb5b4` |

`transactions/standingOrderSchema` a `transactions/Flegl-Docker` jsou ty samé úpravy položené na `main`, takže v nich zůstává celé monorepo. Veverka, Flégl-Events a Jasa odbočily dřív, než vznikl Docker a Drizzle, a na aktuální `services/transactions` se čistě nepoloží.

Mimo původní soubory tu přibyly kořenový compose, `.env.example`, `apps/web/nginx.conf`, dokumentace pro agenty a dvě úpravy v kopiích: dev script TransactionManageru spouští `src/app.js` a obě služby čtou `JWT_SECRET` z prostředí.
