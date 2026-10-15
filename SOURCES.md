# Odkud kód pochází

Do tohoto repozitáře se soubory zkopírovaly jako snímek. Historie ani větve původních repozitářů se neměnily a nic se do nich nepushovalo.

| Část v tomto repozitáři | Původ | Větev | Commit |
| --- | --- | --- | --- |
| `services/auth` | https://github.com/dandys71/AuthManager | `main` | `25e5a04e570edf7777ffac35b3964c0419f3d03e` |
| `services/transactions` | https://github.com/dandys71/TransactionManager | `schmid-docker` | `7f20978daf6c0646dcbcd18f34098921d6b07e1c` |
| `apps/web` | https://github.com/the-CYCLE-bin/fg-frontend | `main` | `7dba91e488c244a7c2c5afc011f0ca5c9d123531` |
| `docs/original` | lokální složka Dokumenty | — | — |

Větev `master` v TransactionManageru je starší a nemá Drizzle ani funkční Docker. Snímek proto bere `schmid-docker`.

Mimo původní soubory tu přibyly kořenový compose, `.env.example`, `apps/web/nginx.conf`, dokumentace pro agenty a dvě úpravy v kopiích: dev script TransactionManageru spouští `src/app.js` a obě služby čtou `JWT_SECRET` z prostředí.
