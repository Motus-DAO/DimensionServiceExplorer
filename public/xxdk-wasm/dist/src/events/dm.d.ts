import { DMBlockedUserEvent, DMNotificationsUpdateEvent, DMReceivedEvent } from '../types/events';
import { TypedEventEmitter } from '../types/emitter';
export declare enum DMEvents {
    DM_NOTIFICATION_UPDATE = 1000,
    DM_BLOCKED_USER = 2000,
    DM_MESSAGE_RECEIVED = 3000
}
export type DMEventHandler = (eventType: DMEvents, data: unknown) => void;
export type DMEventMap = {
    [DMEvents.DM_NOTIFICATION_UPDATE]: DMNotificationsUpdateEvent;
    [DMEvents.DM_BLOCKED_USER]: DMBlockedUserEvent;
    [DMEvents.DM_MESSAGE_RECEIVED]: DMReceivedEvent;
};
export type DMEventHandlers = {
    [P in keyof DMEventMap]: (event: DMEventMap[P]) => void;
};
export declare const dmBus: TypedEventEmitter<DMEventHandlers>;
export declare const onDmEvent: (eventType: DMEvents, data: unknown) => void;
