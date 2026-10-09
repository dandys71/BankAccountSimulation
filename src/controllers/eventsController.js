import {
    triggerEventSchema,
    previewNextWindowSchema,
    listEventsSchema,
    pauseEventsSchema,
    resumeEventsSchema
} from "../validationSchemas/createEventTemplateSchema.js";

import * as eventsService from "../services/eventsService.js";
import { validate } from "../services/validationService.js";

// [POST] Endpoint 1: Spuštění události
export const triggerRandomEvent = async (req, res, next) => {
    try {
        const validatedData = validate(triggerEventSchema, req.body);
        const result = await eventsService.triggerEvent(validatedData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};


// [POST] Endpoint 2: Náhled na budoucí události v časovém okně
export const previewNextWindow = async (req, res, next) => {
    try {
        const validatedData = validate(previewNextWindowSchema, req.body);
        const result = await eventsService.previewNextWindow(validatedData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


// [GET] Endpoint 3: Auditní výpis událostí
export const listEvents = async (req, res, next) => {
    try {
        const validatedFilters = validate(listEventsSchema, req.query);
        const result = await eventsService.listEvents(validatedFilters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// [POST] Endpoint 4: Pozastavení generování událostí
export const pauseEvents = async (req, res, next) => {
    try {
        validate(pauseEventsSchema, req.body || {});
        const result = await eventsService.pauseEvents();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// [POST] Endpoint 5: Obnovení generování událostí
export const resumeEvents = async (req, res, next) => {
    try {
        validate(resumeEventsSchema, req.body || {});
        const result = await eventsService.resumeEvents();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};