/**
 * Touch/Swipe Module
 * Handles touch and mouse swipe interactions
 */
import type { Slick } from '../core/SlickComplete';
/**
 * Swipe handler (main dispatcher)
 */
export declare function swipeHandler(this: Slick, event: Event): void;
/**
 * Swipe start
 */
export declare function swipeStart(this: Slick, event: Event): void | false;
/**
 * Swipe move
 */
export declare function swipeMove(this: Slick, event: Event): void | false;
/**
 * Swipe end
 */
export declare function swipeEnd(this: Slick, _event: Event): void;
/**
 * Swipe direction
 */
export declare function swipeDirection(this: Slick): string;
/**
 * Get slide count for swipe
 */
export declare function getSlideCount(this: Slick): number;
/**
 * Check navigable index
 */
export declare function checkNavigable(this: Slick, index: number): number;
/**
 * Get navigable indexes
 */
export declare function getNavigableIndexes(this: Slick): number[];
