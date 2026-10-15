/**
 * Controller vyřídí HTTP požadavek, servisa rozhodne „co se má stát“ a model je místo, kde se drží a načítají data.
 */

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Client } from "pg";

import {router as accountsRouter} from './routes/accounts.js';
import {router as usersRouter} from './routes/users.js';
import {router as healthRouter} from './routes/health.js';
import {router as transactionsRouter} from './routes/transactions.js'
import {router as standingOrdersRouter} from "./routes/standingOrder.js";

import {router as savingAccountsRoutes} from "./routes/savingAccounts.js";

import {errorHandler} from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log("✅ Připojeno k DB"))
    .catch(err => console.error("❌ DB chyba", err));

app.get("/", async (req, res) => {
    const result = await client.query("SELECT NOW()");
    res.json(result.rows[0]);
});


// Globální middleware
app.use(helmet());
app.use(cors());// toto povolí vše,  app.use(cors({ origin: 'http://localhost:3000' })); // přísnější varianta, na 3000 standardně bývá frontend
app.use(express.json()); //to co přijde od klienta (request) se vloží do req.body (očekává se práce s json objekty)
app.use(morgan('dev')); //toto loguje do konzole, jen při spuštění v dev

// jednoduché "ověření" JWT – jen ukázka, později nahradíte kontrolou podpisu
//toto zatím ignorujte - bude to sloužit pro autorizaci
/*import { authMiddleware } from './middlewares/auth.js';
app.use(authMiddleware);*/

// naše základní routy
app.use('/v1/accounts', accountsRouter); //všechny routy, co vytvoříme v routes, musíme zde "zaregistrovat" a výše je musíme naimportovat
//jelikož je /v1/accounts společné pro všechny endpointy (routy) v rámci accountsRouter, tak je lepší tuto společnou část použít, zde než aby se musela explicitně zmiňovat u každé routy
app.use('/v1/health', healthRouter); //routa pro rychlé ověření, že server běží a naslouchá
app.use('/v1/users', usersRouter); //routa pro praci s uzivateli
app.use('/v1/transactions', transactionsRouter);
app.use("/v1/savingsAccounts", savingAccountsRoutes);
app.use('/v1/standingOrders', standingOrdersRouter);

//toto je centrální error handler, všimněte si, že pokud někde nastane chyba, tak se nepošle uživateli rovnou přes res, ale volá se next,
// proč next? jelikož jsme ho "zaregistrovali pomocí use" až za /v1/accounts a za /v1/health a je tedy až další v řadě pro zpracování
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`TransactionManager running on http://localhost:${PORT}`);
});
