import {ZodError} from 'zod';

// Vlastní třída chyby pro validaci
export class ValidationError extends Error {
  constructor(message, details = [], code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.details = details; // pole objektů { path, message }
    this.statusCode = 400;
    this.status = 400;
    this.code = code;
  }
}

// Malý wrapper kolem zod, aby controller mohl jen zavolat ValidationService.validate
export function validate(schema, data) {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      // Převést zod chybu na strukturovanou ValidationError
      const details = err.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
      throw new ValidationError('Validation error', details, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
