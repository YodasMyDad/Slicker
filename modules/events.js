/**
 * Event Manager
 * Handles namespaced events similar to jQuery
 */
class EventManagerClass {
    constructor() {
        this.eventStore = new WeakMap();
    }
    /**
     * Add event listener with optional namespace
     */
    on(element, eventWithNamespace, handler, options) {
        const events = eventWithNamespace.split(/\s+/).filter(Boolean);
        events.forEach(evt => {
            const [event, namespace] = this.parseEventName(evt);
            element.addEventListener(event, handler, options);
            // Store handler for later removal
            if (!this.eventStore.has(element)) {
                this.eventStore.set(element, []);
            }
            const handlers = this.eventStore.get(element);
            handlers.push({ event, namespace, handler, options });
        });
    }
    /**
     * Remove event listener by namespace or specific event
     */
    off(element, eventWithNamespace, handler) {
        const handlers = this.eventStore.get(element);
        if (!handlers)
            return;
        if (!eventWithNamespace) {
            // Remove all events
            handlers.forEach(h => element.removeEventListener(h.event, h.handler, h.options));
            this.eventStore.delete(element);
            return;
        }
        const events = eventWithNamespace.split(/\s+/).filter(Boolean);
        events.forEach(evt => {
            const [event, namespace] = this.parseEventName(evt);
            const handlersToRemove = handlers.filter(h => {
                if (handler && h.handler !== handler)
                    return false;
                if (event && h.event !== event)
                    return false;
                if (namespace && h.namespace !== namespace)
                    return false;
                return true;
            });
            handlersToRemove.forEach(h => {
                element.removeEventListener(h.event, h.handler, h.options);
                const index = handlers.indexOf(h);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            });
        });
    }
    /**
     * Trigger/dispatch custom event
     */
    trigger(element, eventName, detail) {
        const [event] = this.parseEventName(eventName);
        const customEvent = new CustomEvent(event, {
            bubbles: true,
            cancelable: true,
            detail
        });
        return element.dispatchEvent(customEvent);
    }
    /**
     * Parse event name into event and namespace
     */
    parseEventName(eventName) {
        const parts = eventName.split('.');
        return [parts[0], parts.slice(1).join('.')];
    }
    /**
     * One-time event listener
     */
    one(element, eventWithNamespace, handler) {
        const wrappedHandler = (event) => {
            handler(event);
            this.off(element, eventWithNamespace, wrappedHandler);
        };
        this.on(element, eventWithNamespace, wrappedHandler, { once: true });
    }
    /**
     * Delegated event listener (like jQuery's .on with selector)
     */
    delegate(element, eventWithNamespace, selector, handler) {
        const delegatedHandler = (event) => {
            const target = event.target;
            const delegateTarget = target.closest(selector);
            if (delegateTarget && element.contains && element.contains(delegateTarget)) {
                handler(event, delegateTarget);
            }
        };
        this.on(element, eventWithNamespace, delegatedHandler);
    }
}
// Export singleton instance
export const EventManager = new EventManagerClass();
