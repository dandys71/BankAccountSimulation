import assert from 'node:assert/strict';
import { listAccounts, createAccount, getBalance, getAccountById, updateAccount, closeAccount, getHistory } from '../src/controllers/accountsController.js';
import { ValidationError } from '../src/services/validationService.js';

describe('AccountsController validations', () => {
  function makeReq(query = {}, body = {}, user = null) {
    return { query, body, user };
  }

  function makeRes() {
    let lastStatus = null;
    let lastJson = null;
    return {
      status(code) { lastStatus = code; return this; },
      json(payload) { lastJson = payload; return this; },
      get captured() { return { status: lastStatus, body: lastJson }; }
    };
  }

  it('listAccounts calls next with ValidationError for invalid page', async () => {
    const req = makeReq({ page: 0 });
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await listAccounts(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });

  it('createAccount calls next with ValidationError for missing fields', async () => {
    const req = makeReq({}, {});
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await createAccount(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });

  it('getBalance calls next with ValidationError for missing accountId', async () => {
    const req = makeReq({});
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await getBalance(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });

  it('getAccountById calls next with ValidationError for missing accountId', async () => {
    const req = makeReq({});
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await getAccountById(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });

  it('updateAccount calls next with ValidationError for missing accountId in body', async () => {
    const req = makeReq({}, {});
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await updateAccount(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });

  it('closeAccount calls next with ValidationError for missing accountId in body', async () => {
    const req = makeReq({}, {});
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await closeAccount(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });

  it('getHistory calls next with ValidationError for missing accountId', async () => {
    const req = makeReq({});
    const res = makeRes();
    const next = (err) => { next.called = true; next.err = err; };
    await getHistory(req, res, next);
    assert(next.called, 'next should be called');
    assert(next.err instanceof ValidationError);
    assert.equal(next.err.code, 'VALIDATION_ERROR');
  });
});
