/**
 * CSS and Animation Utilities
 * Handles transforms, transitions, and animations
 */
export interface TransformSupport {
    transform: boolean;
    transition: boolean;
    transformType: string | null;
    transitionType: string | null;
    animType: string | null;
}
/**
 * Detect CSS transform and transition support
 */
export declare function detectTransformSupport(): TransformSupport;
/**
 * Set CSS transform
 */
export declare function setTransform(element: HTMLElement, value: string, transformType: string): void;
/**
 * Set CSS transition
 */
export declare function setTransition(element: HTMLElement, value: string, transitionType: string): void;
/**
 * Remove CSS transition
 */
export declare function removeTransition(element: HTMLElement, transitionType: string): void;
/**
 * Easing function mapping (jQuery easing to CSS cubic-bezier)
 */
export declare const easingMap: Record<string, string>;
export declare function getEasing(easing: string): string;
/**
 * Animate using CSS transitions
 */
export interface AnimateOptions {
    duration: number;
    easing: string;
    complete?: () => void;
}
export declare function animateCSS(element: HTMLElement, props: Partial<CSSStyleDeclaration>, options: AnimateOptions, transitionType: string): void;
/**
 * Animate using requestAnimationFrame (fallback for browsers without CSS transitions)
 */
export declare function animateRAF(element: HTMLElement, props: Record<string, number>, options: AnimateOptions): void;
/**
 * Fade animation
 */
export declare function fade(element: HTMLElement, opacity: number, duration: number, callback?: () => void): void;
