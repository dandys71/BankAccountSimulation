/**
 * Controller = „přední dveře“ tvého API.
 * Bere HTTP požadavek (URL, parametry, tělo, hlavičky), zkontroluje vstupy, zavolá správnou servisu a vrátí HTTP odpověď (status kód + JSON).
 * Řeší jen věci kolem webu: validace vstupů, výběr status kódu, formátování odpovědi.
**/

import * as AccountsService from '../services/accountsService.js';

import {validate} from '../services/validationService.js';
import * as ValidationSchemas from '../validationSchemas/accountsSchema.js';

/**
 * Zod je malá knihovna na ověřování a „tvarování“ dat (validaci). Uděláš si „schéma" toho, jak mají vypadat vstupy (třeba body/query),
 * Zod ti je zkontroluje, případně rovnou převede na správné typy.
 * chytí špatná data hned na vstupu (ušetří spoustu chyb),
 * umí hezké chybové hlášky,
 * viz listAccounts
 **/

class AccountsController {
  async getAccountById(req, res, next) {
    try {
      const q = validate(ValidationSchemas.accountIdQuerySchema, req.query);
      const item = await AccountsService.getAccountById(q.accountId, req.user);
      if (!item) return res.status(404).json({ error: 'Not Found' });
      res.json(item);
    } catch (e) { next(e); }
  }

  async listAccounts(req, res, next) {
    try {
      // Použijeme ValidationService a externí schema z configu
      const q = validate(ValidationSchemas.listAccountsQuerySchema, req.query);
      //všimněte jsi, že jse v try bloku, pokud tedy něco selže, např. page bude záporná hodnota, tak se odchytí vyjímka (kde text chybové hlášky připraví zod)
        //voláme async funkci listAccounts, jelikož chceme počkat na výsledek použijeme před voláním funkce klíčové slovo await
      const data = await AccountsService.listAccounts(q, req.user); //pokud nenastane vyjímka, získají se data ze servisi
      res.json(data); //data se v json pošlou jako výsledek, toto nastaví hlavičku Content-Type: application/json a převede objekt na text (json)
    } catch (e) { next(e); } //zde se volá next a res, rozdíl je v tom, že res rovnou vrací výsledek, a pokud je zaregistrovaná další routa, tak se pošle pro další zpracování dále viz komentář v app.js u error handleru
  }

  async createAccount(req, res, next) {
    try {
      const body = validate(ValidationSchemas.createAccountBodySchema, req.body);
      const created = await AccountsService.createAccount(body, req.user);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }

  async updateAccount(req, res, next) {
    try {
      const body = validate(ValidationSchemas.updateAccountBodySchema, req.body);
      const updated = await AccountsService.updateAccount(body, req.user);
      res.json(updated);
    } catch (e) { next(e); }
  }

  async closeAccount(req, res, next) {
    try {
      const body = validate(ValidationSchemas.closeAccountBodySchema, req.body);
      const resu = await AccountsService.closeAccount(body, req.user);
      res.json(resu);
    } catch (e) { next(e); }
  }

  async getBalance(req, res, next) {
    try {
      const q = validate(ValidationSchemas.getBalanceQuerySchema, req.query);
      const data = await AccountsService.getBalance(q.accountId, req.user);
      res.json(data);
    } catch (e) { next(e); }
  }

  async getHistory(req, res, next) {
    try {
      const q = validate(ValidationSchemas.getHistoryQuerySchema, req.query);
      const data = await AccountsService.getHistory(q, req.user);
      res.json(data);
    } catch (e) { next(e); }
  }

  async getStandingOrders(req, res, next) {
    try {
      const q = validate(ValidationSchemas.getStandingOrdersQuerySchema, req.query);
      const data = await AccountsService.getStandingOrders(q.accountId, req.user);
      res.json(data);
    } catch (e) { next(e); }
  }

  async generateAccountNumber(req, res, next) {
    try {
      // validace je k nicemu, jelikoz tohle nepozaduje zadny parametry
      const data = await AccountsService.generateAccountNumber(req.user);
      res.json(data);
    } catch (e) { next(e); }
  }

  async getQrCode(req, res, next) {
    try {
      const q = validate(ValidationSchemas.getQrCodeQuerySchema, req.query);
      const data = await AccountsService.getQrCode(q, req.user);
      res.json(data);
    } catch (e) { next(e); }
  }
}

// Vytvoříme jednu instanci třídy a exportujeme její metody pod původními názvy
const controller = new AccountsController();

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
export const getAccountById = controller.getAccountById.bind(controller);
export const listAccounts = controller.listAccounts.bind(controller);
export const createAccount = controller.createAccount.bind(controller);
export const updateAccount = controller.updateAccount.bind(controller);
export const closeAccount = controller.closeAccount.bind(controller);
export const getBalance = controller.getBalance.bind(controller);
export const getHistory = controller.getHistory.bind(controller);
export const getStandingOrders = controller.getStandingOrders.bind(controller);
export const generateAccountNumber = controller.generateAccountNumber.bind(controller);
export const getQrCode = controller.getQrCode.bind(controller);