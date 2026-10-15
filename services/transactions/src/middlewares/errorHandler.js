//toto je centrální error handler, všimněte si, že pokud někde nastane chyba, tak se nepošle uživateli rovnou přes res, ale volá se next
// (což je v podstatě nějaký další handler, v tomto případě to odchytí tento error handler)
//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
//jinde pak import { errorHandler } from './middlewares/errorHandler.js';
export function errorHandler(err, req, res, _next) {
    // Pokud je naše vlastní ValidationError, pošli strukturovanou odpověď včetně code
    if (err && err.name === 'ValidationError') {
        return res.status(err.statusCode || 400).json({ code: err.code || 'VALIDATION_ERROR', message: err.message, details: err.details || [] });
    }

    // ZodError fallback (pokud někde vyhozený přímo)
    if (err && (err.name === 'ZodError' || err?.issues)) {
        return res.status(400).json({ code: 'ZOD_VALIDATION_ERROR', message: 'Validation failed', details: err.issues || [] });
    }

    // Obecná chyba
    const status = err?.statusCode || err?.status || 500;
    const payload = { code: err?.code || 'INTERNAL_ERROR', message: err?.message || 'Internal Server Error' };
    // Pokud existují dodatečné detaily (např. z ValidationError), přidej je
    if (err?.details) payload.details = err.details;
    res.status(status).json(payload);
}