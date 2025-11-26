/**
 * Public API Methods
 * All public-facing methods for the Slick carousel
 */
import type { Slick } from './SlickComplete';
import type { SlickOptions } from '../types';
/**
 * Add slide
 */
export declare function slickAdd(this: Slick, markup: string | HTMLElement, index?: number | boolean, addBefore?: boolean): void;
/**
 * Remove slide
 */
export declare function slickRemove(this: Slick, index: number | boolean, removeBefore?: boolean, removeAll?: boolean): boolean | void;
/**
 * Filter slides
 */
export declare function slickFilter(this: Slick, filter: string | ((index: number, element: HTMLElement) => boolean)): void;
/**
 * Unfilter slides
 */
export declare function slickUnfilter(this: Slick): void;
/**
 * Set option
 */
export declare function slickSetOption(this: Slick, option: string | Partial<SlickOptions>, value?: any, refresh?: boolean): void;
/**
 * Unload slider
 */
export declare function unload(this: Slick): void;
/**
 * Destroy slider
 */
export declare function destroy(this: Slick, refresh?: boolean): void;
/**
 * Clean up rows
 */
export declare function cleanUpRows(this: Slick): void;
/**
 * Clean up events
 */
export declare function cleanUpEvents(this: Slick): void;
/**
 * Reinitialize slider
 */
export declare function reinit(this: Slick): void;
/**
 * Clean up slide events
 */
export declare function cleanUpSlideEvents(this: Slick): void;
/**
 * Initialize slide events
 */
export declare function initSlideEvents(this: Slick): void;
/**
 * Refresh slider
 */
export declare function refresh(this: Slick, initializing?: boolean): void;
/**
 * Prevent default
 */
export declare function preventDefault(event: Event): void;
