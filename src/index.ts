/**
 * Slick Carousel - Vanilla TypeScript
 * Main entry point
 */

import { Slick as SlickClass } from './core/SlickComplete';
import type { SlickOptions } from './types';
import * as DOM from './utils/dom';

// Export types
export * from './types';
export { SlickClass as Slick };

/**
 * Helper function to initialize Slick on element(s)
 * Mimics jQuery plugin behavior
 */
function init(selector: string | HTMLElement, options?: Partial<SlickOptions>): SlickClass | SlickClass[] {
  const elements = typeof selector === 'string' ? 
    DOM.getElements(selector) : 
    [selector];
  
  const instances = elements.map(element => {
    // Store instance on element
    const instance = new SlickClass(element, options);
    (element as any).slick = instance;
    return instance;
  });
  
  return instances.length === 1 ? instances[0] : instances;
}

// Create the main export object with both constructor and helper
const Slick = Object.assign(SlickClass, { init });

// Default export
export default Slick;

// For UMD/browser global
if (typeof window !== 'undefined') {
  (window as any).Slick = Slick;
}

