/**
 * Animation Module
 * Handles slide animations, fades, and transitions
 */
import type { Slick } from '../core/SlickComplete';
/**
 * Animate slide to target position
 */
export declare function animateSlide(this: Slick, targetLeft: number, callback?: () => void): void;
/**
 * Animate height for adaptive height
 */
export declare function animateHeight(this: Slick): void;
/**
 * Apply CSS transition
 */
export declare function applyTransition(this: Slick, slide?: number): void;
/**
 * Disable CSS transition
 */
export declare function disableTransition(this: Slick, slide?: number): void;
/**
 * Fade in a slide
 */
export declare function fadeSlide(this: Slick, slideIndex: number, callback?: () => void): void;
/**
 * Fade out a slide
 */
export declare function fadeSlideOut(this: Slick, slideIndex: number): void;
/**
 * Set CSS transform position
 */
export declare function setCSS(this: Slick, position: number): void;
/**
 * Set fade styling
 */
export declare function setFade(this: Slick): void;
