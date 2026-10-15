import assert from 'node:assert/strict';
import { validate, ValidationError } from '../src/services/validationService.js';
import { listAccountsQuerySchema } from '../src/validationSchemas/accountsSchema.js';

describe('validationService', () => {
  it('validate throws ValidationError with code and details for invalid query', () => {
    assert.throws(() => validate(listAccountsQuerySchema, { page: 0 }), ValidationError);
    try {
      validate(listAccountsQuerySchema, { page: 0 });
    } catch (err) {
      assert(err instanceof ValidationError, 'err should be ValidationError');
      assert.equal(err.code, 'VALIDATION_ERROR');
      assert(Array.isArray(err.details));
      assert(err.details.length > 0);
    }
  });
});
