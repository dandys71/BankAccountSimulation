import crypto from 'crypto';

const _mem = new Map();

        const item = {
            standingOrderId: "ZkušebníPříkaz",
            accountId: "a123",
            templateId: "t123",
            interval: "monthly",
            customCron: "123",
            dayOfMonth: 14,
            amount: 1000,
            currency: "czk",
            nextRunAt: "date",
            isActive: true,
        };

        _mem.set(item.standingOrderId, item);

        export const StandingOrder = {

            create(data) {
                const standingOrderId = `so_${crypto.randomUUID()}`;

                const item = {
                    standingOrderId,
                    accountId: data.accountId,
                    templateId: data.templateId,
                    interval: data.interval,
                    customCron: data.customCron,
                    dayOfMonth: data.dayOfMonth,
                    amount: data.amount,
                    currency: data.currency,
                    nextRunAt: data.nextRunAt,
                    isActive: true,
                };

                _mem.set(standingOrderId, item);
                return item;

            },

            get(standingOrderId){
                const result = _mem.get(standingOrderId)
                if (!result) return null;
                return result;
            },


            update(data) {
                const existingItem = _mem.get(data.standingOrderId);
                if(!existingItem) return null;
                const updated = {...existingItem, ...data}

                _mem.set(data.standingOrderId, updated);
                return updated;

            },
            delete(standingOrderId) {
                const existing = _mem.get(standingOrderId);
                if (!existing) return null;

                _mem.delete(standingOrderId);
                return existing;
            },
            list(filters) {
                let orders = Array.from(_mem.values());

                if (filters.accountId) {
                    orders = orders.filter(o => o.accountId === filters.accountId);
                }
                if (typeof filters.active !== 'undefined') {
                    orders = orders.filter(o => o.isActive === filters.active);
                }
                return orders;
            }
        }
        // Přidej do StandingOrder v models/standingOrder.js


