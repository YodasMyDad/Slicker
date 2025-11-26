/**
 * DOM Utility Functions
 * Replaces jQuery DOM manipulation methods
 */
/**
 * Convert string HTML to HTMLElement
 */
export declare function createElementFromHTML(html: string): HTMLElement;
/**
 * Check if string is HTML
 */
export declare function isHTML(str: string): boolean;
/**
 * Get element(s) from selector or element
 */
export declare function getElement(selector: string | HTMLElement): HTMLElement | null;
export declare function getElements(selector: string | HTMLElement | NodeList): HTMLElement[];
/**
 * Get/Set element attributes
 */
export declare function setAttributes(element: HTMLElement, attributes: Record<string, string | number>): void;
export declare function removeAttributes(element: HTMLElement, ...attributes: string[]): void;
/**
 * Add/Remove classes
 */
export declare function addClass(element: HTMLElement | HTMLElement[], ...classes: string[]): void;
export declare function removeClass(element: HTMLElement | HTMLElement[], ...classes: string[]): void;
export declare function hasClass(element: HTMLElement, className: string): boolean;
/**
 * CSS manipulation
 */
export declare function setCSS(element: HTMLElement | HTMLElement[], styles: Partial<CSSStyleDeclaration> | Record<string, string>): void;
export declare function getCSS(element: HTMLElement, property: string): string;
/**
 * Element dimensions
 */
export declare function outerWidth(element: HTMLElement, includeMargin?: boolean): number;
export declare function outerHeight(element: HTMLElement, includeMargin?: boolean): number;
/**
 * Get inner width (content box, excluding padding/border) - matches jQuery .width()
 * This properly handles box-sizing: border-box by subtracting padding/border
 */
export declare function width(element: HTMLElement): number;
/**
 * Get inner height (content box, excluding padding/border) - matches jQuery .height()
 * This properly handles box-sizing: border-box by subtracting padding/border
 */
export declare function height(element: HTMLElement): number;
/**
 * DOM traversal
 */
export declare function children(element: HTMLElement, selector?: string): HTMLElement[];
export declare function find(element: HTMLElement, selector: string): HTMLElement[];
export declare function findOne(element: HTMLElement, selector: string): HTMLElement | null;
export declare function closest(element: HTMLElement, selector: string): HTMLElement | null;
export declare function parent(element: HTMLElement): HTMLElement | null;
export declare function siblings(element: HTMLElement): HTMLElement[];
/**
 * DOM manipulation
 */
export declare function append(parent: HTMLElement, child: HTMLElement | string): void;
export declare function prepend(parent: HTMLElement, child: HTMLElement | string): void;
export declare function insertBefore(newElement: HTMLElement, referenceElement: HTMLElement): void;
export declare function insertAfter(newElement: HTMLElement, referenceElement: HTMLElement): void;
export declare function remove(element: HTMLElement | HTMLElement[]): void;
export declare function detach(element: HTMLElement): HTMLElement;
export declare function empty(element: HTMLElement): void;
/**
 * Clone element
 */
export declare function clone(element: HTMLElement, deep?: boolean): HTMLElement;
/**
 * Wrap elements
 */
export declare function wrapAll(elements: HTMLElement[], wrapper: string | HTMLElement): HTMLElement;
export declare function wrap(element: HTMLElement, wrapper: string | HTMLElement): HTMLElement;
/**
 * Check element state
 */
export declare function is(element: HTMLElement, selector: string): boolean;
export declare function index(element: HTMLElement): number;
export declare function setData(element: HTMLElement, key: string, value: any): void;
export declare function getData(element: HTMLElement, key: string): any;
/**
 * Focus management
 */
export declare function focus(element: HTMLElement): void;
export declare function trigger(element: HTMLElement, eventName: string): void;
