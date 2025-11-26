/**
 * Slicker Carousel - Vanilla TypeScript
 * Main entry point for the Slicker rewrite
 */
import { Slick as SlickClass } from './core/SlickComplete';
import type { SlickOptions } from './types';
export * from './types';
export { SlickClass as SlickCore };
/**
 * Helper function to initialize Slicker on element(s)
 * Mimics jQuery plugin behavior
 */
declare function init(selector: string | HTMLElement, options?: Partial<SlickOptions>): SlickClass | SlickClass[];
declare const Slicker: typeof SlickClass & {
    init: typeof init;
};
export { Slicker };
export { Slicker as Slick };
export default Slicker;
