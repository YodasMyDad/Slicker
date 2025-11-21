/**
 * Event Manager
 * Handles namespaced events similar to jQuery
 */

interface EventHandler {
  event: string;
  namespace: string;
  handler: EventListener;
  options?: AddEventListenerOptions | boolean;
}

class EventManagerClass {
  private eventStore = new WeakMap<EventTarget, EventHandler[]>();

  /**
   * Add event listener with optional namespace
   */
  on(
    element: EventTarget,
    eventWithNamespace: string,
    handler: EventListener,
    options?: AddEventListenerOptions | boolean
  ): void {
    const events = eventWithNamespace.split(/\s+/).filter(Boolean);

    events.forEach(evt => {
      const [event, namespace] = this.parseEventName(evt);
      
      element.addEventListener(event, handler, options);
      
      // Store handler for later removal
      if (!this.eventStore.has(element)) {
        this.eventStore.set(element, []);
      }
      
      const handlers = this.eventStore.get(element)!;
      handlers.push({ event, namespace, handler, options });
    });
  }

  /**
   * Remove event listener by namespace or specific event
   */
  off(element: EventTarget, eventWithNamespace?: string, handler?: EventListener): void {
    const handlers = this.eventStore.get(element);
    if (!handlers) return;
    
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
        if (handler && h.handler !== handler) return false;
        if (event && h.event !== event) return false;
        if (namespace && h.namespace !== namespace) return false;
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
  trigger(element: EventTarget, eventName: string, detail?: any): boolean {
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
  private parseEventName(eventName: string): [string, string] {
    const parts = eventName.split('.');
    return [parts[0], parts.slice(1).join('.')];
  }

  /**
   * One-time event listener
   */
  one(
    element: EventTarget,
    eventWithNamespace: string,
    handler: EventListener
  ): void {
    const wrappedHandler = (event: Event) => {
      handler(event);
      this.off(element, eventWithNamespace, wrappedHandler as EventListener);
    };
    
    this.on(element, eventWithNamespace, wrappedHandler as EventListener, { once: true });
  }

  /**
   * Delegated event listener (like jQuery's .on with selector)
   */
  delegate(
    element: EventTarget,
    eventWithNamespace: string,
    selector: string,
    handler: (event: Event, target: HTMLElement) => void
  ): void {
    const delegatedHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      const delegateTarget = target.closest(selector) as HTMLElement;
      
      if (delegateTarget && (element as HTMLElement).contains && (element as HTMLElement).contains(delegateTarget)) {
        handler(event, delegateTarget);
      }
    };
    
    this.on(element, eventWithNamespace, delegatedHandler);
  }
}

// Export singleton instance
export const EventManager = new EventManagerClass();

