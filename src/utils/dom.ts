/**
 * DOM Utility Functions
 * Replaces jQuery DOM manipulation methods
 */

/**
 * Convert string HTML to HTMLElement
 */
export function createElementFromHTML(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild as HTMLElement;
}

/**
 * Check if string is HTML
 */
export function isHTML(str: string): boolean {
  const htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
  return htmlExpr.test(str);
}

/**
 * Get element(s) from selector or element
 */
export function getElement(selector: string | HTMLElement): HTMLElement | null {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }
  return selector;
}

export function getElements(selector: string | HTMLElement | NodeList): HTMLElement[] {
  if (typeof selector === 'string') {
    return Array.from(document.querySelectorAll(selector));
  }
  if (selector instanceof NodeList) {
    return Array.from(selector) as HTMLElement[];
  }
  return [selector as HTMLElement];
}

/**
 * Get/Set element attributes
 */
export function setAttributes(element: HTMLElement, attributes: Record<string, string | number>): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
}

export function removeAttributes(element: HTMLElement, ...attributes: string[]): void {
  attributes.forEach(attr => element.removeAttribute(attr));
}

/**
 * Add/Remove classes
 */
export function addClass(element: HTMLElement | HTMLElement[], ...classes: string[]): void {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach(el => el?.classList.add(...classes));
}

export function removeClass(element: HTMLElement | HTMLElement[], ...classes: string[]): void {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach(el => el?.classList.remove(...classes));
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * CSS manipulation
 */
export function setCSS(element: HTMLElement | HTMLElement[], styles: Partial<CSSStyleDeclaration> | Record<string, string>): void {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach(el => {
    if (el) {
      Object.entries(styles).forEach(([key, value]) => {
        (el.style as any)[key] = value;
      });
    }
  });
}

export function getCSS(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Element dimensions
 */
export function outerWidth(element: HTMLElement, includeMargin = false): number {
  let width = element.offsetWidth;
  if (includeMargin) {
    const style = window.getComputedStyle(element);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  }
  return width;
}

export function outerHeight(element: HTMLElement, includeMargin = false): number {
  let height = element.offsetHeight;
  if (includeMargin) {
    const style = window.getComputedStyle(element);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  }
  return height;
}

/**
 * DOM traversal
 */
export function children(element: HTMLElement, selector?: string): HTMLElement[] {
  const childElements = Array.from(element.children) as HTMLElement[];
  if (selector) {
    return childElements.filter(child => child.matches(selector));
  }
  return childElements;
}

export function find(element: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(element.querySelectorAll(selector));
}

export function findOne(element: HTMLElement, selector: string): HTMLElement | null {
  return element.querySelector(selector);
}

export function closest(element: HTMLElement, selector: string): HTMLElement | null {
  return element.closest(selector);
}

export function parent(element: HTMLElement): HTMLElement | null {
  return element.parentElement;
}

export function siblings(element: HTMLElement): HTMLElement[] {
  if (!element.parentElement) return [];
  return Array.from(element.parentElement.children).filter(
    child => child !== element
  ) as HTMLElement[];
}

/**
 * DOM manipulation
 */
export function append(parent: HTMLElement, child: HTMLElement | string): void {
  if (typeof child === 'string') {
    parent.insertAdjacentHTML('beforeend', child);
  } else {
    parent.appendChild(child);
  }
}

export function prepend(parent: HTMLElement, child: HTMLElement | string): void {
  if (typeof child === 'string') {
    parent.insertAdjacentHTML('afterbegin', child);
  } else {
    parent.insertBefore(child, parent.firstChild);
  }
}

export function insertBefore(newElement: HTMLElement, referenceElement: HTMLElement): void {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement);
}

export function insertAfter(newElement: HTMLElement, referenceElement: HTMLElement): void {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement.nextSibling);
}

export function remove(element: HTMLElement | HTMLElement[]): void {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach(el => el?.parentNode?.removeChild(el));
}

export function detach(element: HTMLElement): HTMLElement {
  element.parentNode?.removeChild(element);
  return element;
}

export function empty(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Clone element
 */
export function clone(element: HTMLElement, deep = true): HTMLElement {
  return element.cloneNode(deep) as HTMLElement;
}

/**
 * Wrap elements
 */
export function wrapAll(elements: HTMLElement[], wrapper: string | HTMLElement): HTMLElement {
  const wrapperElement = typeof wrapper === 'string'
    ? createElementFromHTML(wrapper)
    : wrapper;

  if (elements.length > 0) {
    const parent = elements[0].parentNode;
    const referenceNode = elements[0];

    if (parent) {
      parent.insertBefore(wrapperElement, referenceNode);
    }

    elements.forEach(el => wrapperElement.appendChild(el));
  }

  return wrapperElement;
}

export function wrap(element: HTMLElement, wrapper: string | HTMLElement): HTMLElement {
  const wrapperElement = typeof wrapper === 'string'
    ? createElementFromHTML(wrapper)
    : wrapper;

  element.parentNode?.insertBefore(wrapperElement, element);
  wrapperElement.appendChild(element);

  return wrapperElement;
}

/**
 * Check element state
 */
export function is(element: HTMLElement, selector: string): boolean {
  return element.matches(selector);
}

export function index(element: HTMLElement): number {
  if (!element.parentElement) return -1;
  return Array.from(element.parentElement.children).indexOf(element);
}

/**
 * Data attributes (simplified storage)
 */
const dataStore = new WeakMap<HTMLElement, Record<string, any>>();

export function setData(element: HTMLElement, key: string, value: any): void {
  if (!dataStore.has(element)) {
    dataStore.set(element, {});
  }
  const data = dataStore.get(element)!;
  data[key] = value;
}

export function getData(element: HTMLElement, key: string): any {
  const data = dataStore.get(element);
  return data ? data[key] : undefined;
}

/**
 * Focus management
 */
export function focus(element: HTMLElement): void {
  element.focus();
}

export function trigger(element: HTMLElement, eventName: string): void {
  const event = new Event(eventName, { bubbles: true });
  element.dispatchEvent(event);
}

