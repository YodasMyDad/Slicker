/**
 * DOM Utility Functions
 * Replaces jQuery DOM manipulation methods
 */
/**
 * Convert string HTML to HTMLElement
 */
export function createElementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}
/**
 * Check if string is HTML
 */
export function isHTML(str) {
    const htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
    return htmlExpr.test(str);
}
/**
 * Get element(s) from selector or element
 */
export function getElement(selector) {
    if (typeof selector === 'string') {
        return document.querySelector(selector);
    }
    return selector;
}
export function getElements(selector) {
    if (typeof selector === 'string') {
        return Array.from(document.querySelectorAll(selector));
    }
    if (selector instanceof NodeList) {
        return Array.from(selector);
    }
    return [selector];
}
/**
 * Get/Set element attributes
 */
export function setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, String(value));
    });
}
export function removeAttributes(element, ...attributes) {
    attributes.forEach(attr => element.removeAttribute(attr));
}
/**
 * Add/Remove classes
 */
export function addClass(element, ...classes) {
    const elements = Array.isArray(element) ? element : [element];
    elements.forEach(el => el === null || el === void 0 ? void 0 : el.classList.add(...classes));
}
export function removeClass(element, ...classes) {
    const elements = Array.isArray(element) ? element : [element];
    elements.forEach(el => el === null || el === void 0 ? void 0 : el.classList.remove(...classes));
}
export function hasClass(element, className) {
    return element.classList.contains(className);
}
/**
 * CSS manipulation
 */
export function setCSS(element, styles) {
    const elements = Array.isArray(element) ? element : [element];
    elements.forEach(el => {
        if (el) {
            Object.entries(styles).forEach(([key, value]) => {
                el.style[key] = value;
            });
        }
    });
}
export function getCSS(element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
}
/**
 * Element dimensions
 */
export function outerWidth(element, includeMargin = false) {
    let width = element.offsetWidth;
    if (includeMargin) {
        const style = window.getComputedStyle(element);
        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    }
    return width;
}
export function outerHeight(element, includeMargin = false) {
    let height = element.offsetHeight;
    if (includeMargin) {
        const style = window.getComputedStyle(element);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
    return height;
}
/**
 * Get inner width (content box, excluding padding/border) - matches jQuery .width()
 * This properly handles box-sizing: border-box by subtracting padding/border
 */
export function width(element) {
    const style = window.getComputedStyle(element);
    let width = parseFloat(style.width);
    if (isNaN(width)) {
        width = element.clientWidth;
    }
    // If box-sizing is border-box, width includes padding and border
    // We need to subtract them to get the content width (matching jQuery behavior)
    if (style.boxSizing === 'border-box') {
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const borderLeft = parseFloat(style.borderLeftWidth) || 0;
        const borderRight = parseFloat(style.borderRightWidth) || 0;
        width = width - paddingLeft - paddingRight - borderLeft - borderRight;
    }
    return width;
}
/**
 * Get inner height (content box, excluding padding/border) - matches jQuery .height()
 * This properly handles box-sizing: border-box by subtracting padding/border
 */
export function height(element) {
    const style = window.getComputedStyle(element);
    let height = parseFloat(style.height);
    if (isNaN(height)) {
        height = element.clientHeight;
    }
    // If box-sizing is border-box, height includes padding and border
    // We need to subtract them to get the content height (matching jQuery behavior)
    if (style.boxSizing === 'border-box') {
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingBottom = parseFloat(style.paddingBottom) || 0;
        const borderTop = parseFloat(style.borderTopWidth) || 0;
        const borderBottom = parseFloat(style.borderBottomWidth) || 0;
        height = height - paddingTop - paddingBottom - borderTop - borderBottom;
    }
    return height;
}
/**
 * DOM traversal
 */
export function children(element, selector) {
    const childElements = Array.from(element.children);
    if (selector) {
        return childElements.filter(child => child.matches(selector));
    }
    return childElements;
}
export function find(element, selector) {
    return Array.from(element.querySelectorAll(selector));
}
export function findOne(element, selector) {
    return element.querySelector(selector);
}
export function closest(element, selector) {
    return element.closest(selector);
}
export function parent(element) {
    return element.parentElement;
}
export function siblings(element) {
    if (!element.parentElement)
        return [];
    return Array.from(element.parentElement.children).filter(child => child !== element);
}
/**
 * DOM manipulation
 */
export function append(parent, child) {
    if (typeof child === 'string') {
        parent.insertAdjacentHTML('beforeend', child);
    }
    else {
        parent.appendChild(child);
    }
}
export function prepend(parent, child) {
    if (typeof child === 'string') {
        parent.insertAdjacentHTML('afterbegin', child);
    }
    else {
        parent.insertBefore(child, parent.firstChild);
    }
}
export function insertBefore(newElement, referenceElement) {
    var _a;
    (_a = referenceElement.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newElement, referenceElement);
}
export function insertAfter(newElement, referenceElement) {
    var _a;
    (_a = referenceElement.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newElement, referenceElement.nextSibling);
}
export function remove(element) {
    const elements = Array.isArray(element) ? element : [element];
    elements.forEach(el => { var _a; return (_a = el === null || el === void 0 ? void 0 : el.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(el); });
}
export function detach(element) {
    var _a;
    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
    return element;
}
export function empty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
/**
 * Clone element
 */
export function clone(element, deep = true) {
    return element.cloneNode(deep);
}
/**
 * Wrap elements
 */
export function wrapAll(elements, wrapper) {
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
export function wrap(element, wrapper) {
    var _a;
    const wrapperElement = typeof wrapper === 'string'
        ? createElementFromHTML(wrapper)
        : wrapper;
    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapperElement, element);
    wrapperElement.appendChild(element);
    return wrapperElement;
}
/**
 * Check element state
 */
export function is(element, selector) {
    return element.matches(selector);
}
export function index(element) {
    if (!element.parentElement)
        return -1;
    return Array.from(element.parentElement.children).indexOf(element);
}
/**
 * Data attributes (simplified storage)
 */
const dataStore = new WeakMap();
export function setData(element, key, value) {
    if (!dataStore.has(element)) {
        dataStore.set(element, {});
    }
    const data = dataStore.get(element);
    data[key] = value;
}
export function getData(element, key) {
    const data = dataStore.get(element);
    return data ? data[key] : undefined;
}
/**
 * Focus management
 */
export function focus(element) {
    element.focus();
}
export function trigger(element, eventName) {
    const event = new Event(eventName, { bubbles: true });
    element.dispatchEvent(event);
}
