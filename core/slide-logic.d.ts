/**
 * Slide Logic
 * Core sliding functionality
 */
import type { Slick } from './SlickComplete';
/**
 * Change slide (from event)
 */
export declare function changeSlide(this: Slick, event: Event, dontAnimate?: boolean): void;
/**
 * Select handler (focus on select)
 */
export declare function selectHandler(this: Slick, event: Event): void;
/**
 * Main slide handler
 */
export declare function slideHandler(this: Slick, index: number, sync?: boolean, dontAnimate?: boolean): void;
/**
 * Post slide (after animation)
 */
export declare function postSlide(this: Slick, index: number): void;
/**
 * Get left position for slide
 */
export declare function getLeft(this: Slick, slideIndex: number): number;
/**
 * Get nav target (for asNavFor)
 */
export declare function getNavTarget(this: Slick): HTMLElement[];
/**
 * AsNavFor sync
 */
export declare function asNavFor(this: Slick, index: number): void;
/**
 * Initialize all events
 */
export declare function initializeEvents(this: Slick): void;
