/**
 * Event Manager
 * Handles namespaced events similar to jQuery
 */
declare class EventManagerClass {
    private eventStore;
    /**
     * Add event listener with optional namespace
     */
    on(element: EventTarget, eventWithNamespace: string, handler: EventListener, options?: AddEventListenerOptions | boolean): void;
    /**
     * Remove event listener by namespace or specific event
     */
    off(element: EventTarget, eventWithNamespace?: string, handler?: EventListener): void;
    /**
     * Trigger/dispatch custom event
     */
    trigger(element: EventTarget, eventName: string, detail?: any): boolean;
    /**
     * Parse event name into event and namespace
     */
    private parseEventName;
    /**
     * One-time event listener
     */
    one(element: EventTarget, eventWithNamespace: string, handler: EventListener): void;
    /**
     * Delegated event listener (like jQuery's .on with selector)
     */
    delegate(element: EventTarget, eventWithNamespace: string, selector: string, handler: (event: Event, target: HTMLElement) => void): void;
}
export declare const EventManager: EventManagerClass;
export {};
