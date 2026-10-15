const eventTemplates = new Map();

//[POST]triggerRandomEvent
export const createSimulationStatusObject = (days, months) => {
    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + months));
    futureDate.setDate(futureDate.getDate() + days);

    return {
        currentSimulationTime: futureDate.toISOString(),
        shiftedDays: days,
        shiftedMonths: months,
        status:"RUNNING"
    };
};