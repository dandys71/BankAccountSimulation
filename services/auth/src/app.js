/**
 * Controller vyřídí HTTP požadavek, servisa rozhodne „co se má stát“ a model je místo, kde se drží a načítají data (ať už z paměti, ze souboru nebo z databáze).
 */

/**
 * Jak spouštět:
 * Nejdříve npm install - stáhne potřebné balíčky podle package.json
 * Následně npm run dev - pro spuštění ve vývojovém režimu (spustí to script, který je definován v package.json - "dev": "node --watch src/app.js"); watch se stará o sledování změň a automatické restartování serveru
 * Pro normální spuštění npm start (opět spustí script z package.json, který se jmenuje start)
 * */
import express from 'express';
import morgan from 'morgan'; //Loguje do konzole, např. GET /v1/health/ping 200 8.3 ms, pomáhá při ladění
import cors from 'cors'; // aby se tvoje API dalo volat z frontendů na jiné doméně/portu,

import helmet from 'helmet'; //nastaví sadu bezpečnostních HTTP hlaviček (např. X-Content-Type-Options, X-DNS-Prefetch-Control, atd.), čímž snižuje některá rizika ve výchozím nastavení.
import dotenv from 'dotenv'; //načte proměnné z .env souboru do process.env (např. PORT, „tajemství“ pro tokeny). Díky tomu nejsou hodnoty natvrdo v kódu.
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'; //na čtení cookies
 
import { router as usersRouter } from './routes/users.js'; //vytvořené routy musíme naimportovat
import { router as authRouter } from './routes/auth.js';
import { router as organizationRouter } from './routes/organizations.js';
import { router as institutionRouter } from './routes/institutions.js';
import { router as healthRouter } from './routes/health.js';

import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
//u app.use záleží na pořadí v jakém je definujeme, podle toho se pak předává požadavek dale pro další zpracování,
// např. aktuálně jde nejdříve požadavek přes helmet, následně do corcs, pak do express.json(), do morgan('dev'),
// pak bude později následovat autorizace pomocí authMiddleware až poté ho zpracují naše routy
app.use(helmet());
app.use(cors());// toto povolí vše,  app.use(cors({ origin: 'http://localhost:3000' })); // přísnější varianta, na 3000 standardně bývá frontend
/* pro httpOnly cokie na JWT token
app.use(cors({
  origin: 'http://localhost:3000', // Zde musíte uvést přesnou adresu vašeho frontendu (včetně portu 3000)
  credentials: true                 // Tímto povolením řeknete serveru, že může přijímat cookies
}));*/
app.use(express.json()); //to co přijde od klienta (request) se vloží do req.body (očekává se práce s json objekty)
app.use(morgan('dev')); //toto loguje do konzole, jen při spuštění v dev
app.use(cookieParser());

// jednoduché "ověření" JWT – jen ukázka, později nahradíte kontrolou podpisu
//toto zatím ignorujte - bude to sloužit pro autorizaci
/*import { authMiddleware } from './middlewares/auth.js';
app.use(authMiddleware);*/

// naše základní routy
//všechny routy, co vytvoříme v routes, musíme zde "zaregistrovat" a výše je musíme naimportovat
//jelikož je /v1/users společné pro všechny endpointy (routy) v rámci accountsRouter, tak je lepší tuto společnou část použít, zde než aby se musela explicitně zmiňovat u každé routy
app.use('/v1/health', healthRouter); //routa pro rychlé ověření, že server běží a naslouchá
app.use('/v1/users', usersRouter); //routa pro praci s uzivateli
app.use('/v1/auth', authRouter); //routa pro autorizaci
app.use('/v1/organizations', organizationRouter); //routa pro organizace
app.use('/v1/institutions', institutionRouter); //routa pro instituce

//toto je centrální error handler, všimněte si, že pokud někde nastane chyba, tak se nepošle uživateli rovnou přes res, ale volá se next,
// proč next? jelikož jsme ho "zaregistrovali pomocí use" až za /v1/accounts a za /v1/health a je tedy až další v řadě pro zpracování
app.use(errorHandler);

// Připojení k MongoDB (používáme název služby 'db' z compose.yaml)
console.log("Moje URI z prostředí je:", process.env.MONGO_URI);
const mongoURI = process.env.MONGO_URI || 'mongodb://db:27017/moje_databaze';

mongoose.connect(mongoURI, {
    family: 4, // Vynutí IPv4 (řeší problémy s překladem 'db' na IPv6)
    serverSelectionTimeoutMS: 5000 // Počká 5 sekund, než vyhlásí chybu sítě
})
.then(() => console.log('🚀 MongoDB připojeno!'))
.catch(err => {
    console.error('❌ Chyba připojení k DB:', err.message);
    // Volitelně: Nechat aplikaci běžet a zkusit to znovu později
});

const PORT = process.env.PORT || 5000; //pokusí se to načíst port z env, pokud neuspěje tak použije defaultně 5001 (což odpovídá tomu v env)
app.listen(PORT, () => {
  console.log(`AuthManager running on http://localhost:${PORT}`);
});
