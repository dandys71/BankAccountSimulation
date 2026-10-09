import * as eventsModel from "../models/eventsModel.js";

export const triggerEvent = async (data) => {
    return eventsModel.createTriggeredEventObject(data);
};


export const previewNextWindow = async (data) => {
    return eventsModel.createPreviewWindowObject(data);
};


export const listEvents = async (filters) => {
    return eventsModel.createEventsListObject(filters);
};

export const pauseEvents = async () => {
    return eventsModel.createPauseEventsObject();
}

export const resumeEvents = async () => {
    return eventsModel.createResumeEventsObject();
}