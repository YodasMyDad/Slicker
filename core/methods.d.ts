/**
 * Core Slick Methods
 * Main functionality methods for the Slick class
 */
import type { Slick } from './SlickComplete';
/**
 * Setup infinite scrolling (clone slides)
 */
export declare function setupInfinite(this: Slick): void;
/**
 * Set slide classes (active, center, current)
 */
export declare function setSlideClasses(this: Slick, index: number): void;
/**
 * Start load (hide arrows and dots initially)
 */
export declare function startLoad(this: Slick): void;
/**
 * Load slider (show it)
 */
export declare function loadSlider(this: Slick): void;
/**
 * Initialize UI (show arrows and dots)
 */
export declare function initUI(this: Slick): void;
/**
 * Set dimensions
 */
export declare function setDimensions(this: Slick): void;
/**
 * Set height (for adaptive height)
 */
export declare function setHeight(this: Slick): void;
/**
 * Set position
 */
export declare function setPosition(this: Slick): void;
/**
 * Resize handler
 */
export declare function resize(this: Slick): void;
/**
 * Autoplay
 */
export declare function autoPlay(this: Slick): void;
/**
 * Autoplay iterator
 */
export declare function autoPlayIterator(this: Slick): void;
/**
 * Placeholder for methods to be implemented
 */
export declare function lazyLoad(_: Slick): void;
export declare function progressiveLazyLoad(_: Slick, _tryCount?: number): void;
export declare function getLeft(_: Slick, _slideIndex: number): number;
export declare function slideHandler(_: Slick, _index: number, _sync?: boolean, _dontAnimate?: boolean): void;
