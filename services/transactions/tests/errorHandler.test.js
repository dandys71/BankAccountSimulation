import assert from 'node:assert/strict';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { ValidationError } from '../src/services/validationService.js';

describe('errorHandler middleware', () => {
  function makeRes() {
    let lastStatus = null;
    let lastJson = null;
    return {
      status(code) { lastStatus = code; return this; },
      json(payload) { lastJson = payload; return this; },
      get captured() { return { status: lastStatus, body: lastJson }; }
    };
  }

  it('returns code and details for ValidationError', () => {
    const res = makeRes();
    const err = new ValidationError('Validation error', [{ path: 'page', message: 'min 1' }], 'VALIDATION_ERROR');
    errorHandler(err, {}, res, () => {});
    const out = res.captured;
    assert.equal(out.status, 400);
    assert(out.body && out.body.code === 'VALIDATION_ERROR');
    assert(out.body.details);
  });

  it('zod fallback returns ZOD_VALIDATION_ERROR', () => {
    const res = makeRes();
    const fakeZodErr = { name: 'ZodError', issues: [{ path: ['page'], message: 'Invalid' }] };
    errorHandler(fakeZodErr, {}, res, () => {});
    const out = res.captured;
    assert.equal(out.status, 400);
    assert(out.body && out.body.code === 'ZOD_VALIDATION_ERROR');
  });

  it('general error returns INTERNAL_ERROR by default', () => {
    const res = makeRes();
    const err = new Error('Boom');
    errorHandler(err, {}, res, () => {});
    const out = res.captured;
    assert.equal(out.status, 500);
    assert(out.body && out.body.code === 'INTERNAL_ERROR');
    assert(out.body && out.body.message === 'Boom');
  });
});
