/**
 * Slicker Carousel - Vanilla TypeScript
 * Main entry point for the Slicker rewrite
 */

import { Slick as SlickClass } from './core/SlickComplete';
import type { SlickOptions } from './types';
import * as DOM from './utils/dom';

// Export types
export * from './types';
export { SlickClass as SlickCore };

/**
 * Helper function to initialize Slicker on element(s)
 * Mimics jQuery plugin behavior
 */
function init(selector: string | HTMLElement, options?: Partial<SlickOptions>): SlickClass | SlickClass[] {
  const elements = typeof selector === 'string' ? 
    DOM.getElements(selector) : 
    [selector];
  
  const instances = elements.map(element => {
    // Store instance on element for both new and legacy names
    const instance = new SlickClass(element, options);
    (element as any).slicker = instance;
    (element as any).slick = (element as any).slick || instance;
    return instance;
  });
  
  return instances.length === 1 ? instances[0] : instances;
}

// Create the main export object with both constructor and helper
const Slicker = Object.assign(SlickClass, { init });

// Expose both named and default exports
export { Slicker };
export { Slicker as Slick }; // Legacy alias for compatibility

// Default export
export default Slicker;

// For UMD/browser global
if (typeof window !== 'undefined') {
  (window as any).Slicker = Slicker;
  (window as any).Slick = (window as any).Slick || Slicker;
}

