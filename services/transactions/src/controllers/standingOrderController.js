import * as StandingOrderService from '../services/standingOrderService.js';
import {validate} from "../services/validationService.js";
import * as StandingOrderSchema from "../validationSchemas/standingOrderSchemas.js"


class StandingOrderController {

    async createStandingOrder(req, res, next) {
        try {
            const body = validate(StandingOrderSchema.createStandingOrder, req.body);
            const created = await StandingOrderService.createStandingOrder(body);

            // OPRAVA: Sloučení do jednoho objektu
            res.status(201).json({
                ...created,
                message: "Standing order was created successfully." // Tady jsi měl omylem napsáno "updated"
            });
        } catch (e) { next(e); }
    }

    async getStandingOrderById(req, res, next) {
        try {
            const q = validate(StandingOrderSchema.standingOrderID, req.query);
            const item = await StandingOrderService.getStandingOrderById(q.standingOrderId);
            if (!item) return res.status(404).json({error: 'Not Found'});
            res.json(item);
        } catch (e) {
            next(e);
        }
    }

    async updateStandingOrder(req, res, next) {
        try {
            const body = validate(StandingOrderSchema.updateStandingOrder, req.body);
            const updated = await StandingOrderService.updateStandingOrder(body);
            if (!updated) return res.status(404).json({error: 'Not Found'});

            // OPRAVA: Sloučení do jednoho objektu
            res.status(200).json({
                ...updated,
                message: "Standing order was updated successfully."
            });
        } catch (e) { next(e); }
    }

    async listStandingOrders(req, res, next) {
        try {
            const q = validate(StandingOrderSchema.listStandingOrders, req.query);
            const list = await StandingOrderService.listStandingOrders(q);
            res.status(200).json(list);
        } catch (e) { next(e); }
    }

    async deleteStandingOrder(req, res, next) {
        try {
            const body = validate(StandingOrderSchema.deleteStandingOrder, req.body);
            const deleted = await StandingOrderService.deleteStandingOrder(body.standingOrderId);

            if (!deleted) return res.status(404).json({error: 'Not Found'});

            res.status(200).json({
                message: "Standing order was deleted",
                standingOrderId: body.standingOrderId
            });
        } catch (e) { next(e); }
    }
    async runNow(req, res, next) {
        try {
            // Validace (přidáme do schémat)
            const body = validate(StandingOrderSchema.runNow, req.body);

            const result = await StandingOrderService.runNow(body.standingOrderId, body.asOf);

            if (!result) return res.status(404).json({ error: 'Not Found' });

            res.status(200).json(result);
        } catch (e) { next(e); }
    }
    async previewNextExecutions(req, res, next) {
        try {
            const body = validate(StandingOrderSchema.previewNextExecutions, req.body);
            const result = await StandingOrderService.previewNextExecutions(body.standingOrderId, body.windowDays);

            if (!result) return res.status(404).json({ error: 'Not Found' });

            res.status(200).json(result);
        } catch (e) { next(e); }
    }



}

const controller = new StandingOrderController();

export const getStandingOrderById = controller.getStandingOrderById.bind(controller);
export const createStandingOrder = controller.createStandingOrder.bind(controller);
export const updateStandingOrder = controller.updateStandingOrder.bind(controller);
export const deleteStandingOrder = controller.deleteStandingOrder.bind(controller);
export const listStandingOrders = controller.listStandingOrders.bind(controller);
export const runNow = controller.runNow.bind(controller);
export const previewNextExecutions = controller.previewNextExecutions.bind(controller);