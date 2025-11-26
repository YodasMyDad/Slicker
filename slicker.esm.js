const defaultOptions = {
  accessibility: true,
  adaptiveHeight: false,
  appendArrows: null,
  // Will be set to slider element in constructor
  appendDots: null,
  // Will be set to slider element in constructor
  arrows: true,
  asNavFor: null,
  prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
  nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
  autoplay: false,
  autoplaySpeed: 3e3,
  centerMode: false,
  centerPadding: "50px",
  cssEase: "ease",
  customPaging: (_slider, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(i + 1);
    return button;
  },
  dots: false,
  dotsClass: "slick-dots",
  draggable: true,
  easing: "linear",
  edgeFriction: 0.35,
  fade: false,
  focusOnSelect: false,
  focusOnChange: false,
  infinite: true,
  initialSlide: 0,
  lazyLoad: "ondemand",
  mobileFirst: false,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnDotsHover: false,
  respondTo: "window",
  responsive: null,
  rows: 1,
  rtl: false,
  slide: "",
  slidesPerRow: 1,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 500,
  swipe: true,
  swipeToSlide: false,
  touchMove: true,
  touchThreshold: 5,
  useCSS: true,
  useTransform: true,
  variableWidth: false,
  vertical: false,
  verticalSwiping: false,
  waitForAnimate: true,
  zIndex: 1e3
};
const initialState = {
  animating: false,
  dragging: false,
  autoPlayTimer: null,
  currentDirection: 0,
  currentLeft: null,
  currentSlide: 0,
  direction: 1,
  $dots: null,
  listWidth: null,
  listHeight: null,
  loadIndex: 0,
  $nextArrow: null,
  $prevArrow: null,
  scrolling: false,
  slideCount: null,
  slideWidth: null,
  $slideTrack: null,
  $slides: [],
  sliding: false,
  slideOffset: 0,
  swipeLeft: null,
  swiping: false,
  $list: null,
  touchObject: {},
  transformsEnabled: false,
  unslicked: false
};
function createElementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}
function isHTML(str) {
  const htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
  return htmlExpr.test(str);
}
function getElement(selector) {
  if (typeof selector === "string") {
    return document.querySelector(selector);
  }
  return selector;
}
function getElements(selector) {
  if (typeof selector === "string") {
    return Array.from(document.querySelectorAll(selector));
  }
  if (selector instanceof NodeList) {
    return Array.from(selector);
  }
  return [selector];
}
function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
}
function removeAttributes(element, ...attributes) {
  attributes.forEach((attr) => element.removeAttribute(attr));
}
function addClass(element, ...classes) {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach((el) => el == null ? void 0 : el.classList.add(...classes));
}
function removeClass(element, ...classes) {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach((el) => el == null ? void 0 : el.classList.remove(...classes));
}
function hasClass(element, className) {
  return element.classList.contains(className);
}
function setCSS$1(element, styles) {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach((el) => {
    if (el) {
      Object.entries(styles).forEach(([key, value]) => {
        el.style[key] = value;
      });
    }
  });
}
function outerWidth(element, includeMargin = false) {
  let width2 = element.offsetWidth;
  if (includeMargin) {
    const style = window.getComputedStyle(element);
    width2 += parseInt(style.marginLeft) + parseInt(style.marginRight);
  }
  return width2;
}
function outerHeight(element, includeMargin = false) {
  let height2 = element.offsetHeight;
  if (includeMargin) {
    const style = window.getComputedStyle(element);
    height2 += parseInt(style.marginTop) + parseInt(style.marginBottom);
  }
  return height2;
}
function width(element) {
  const style = window.getComputedStyle(element);
  let width2 = parseFloat(style.width);
  if (isNaN(width2)) {
    width2 = element.clientWidth;
  }
  if (style.boxSizing === "border-box") {
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderRight = parseFloat(style.borderRightWidth) || 0;
    width2 = width2 - paddingLeft - paddingRight - borderLeft - borderRight;
  }
  return width2;
}
function height(element) {
  const style = window.getComputedStyle(element);
  let height2 = parseFloat(style.height);
  if (isNaN(height2)) {
    height2 = element.clientHeight;
  }
  if (style.boxSizing === "border-box") {
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;
    const borderBottom = parseFloat(style.borderBottomWidth) || 0;
    height2 = height2 - paddingTop - paddingBottom - borderTop - borderBottom;
  }
  return height2;
}
function children(element, selector) {
  const childElements = Array.from(element.children);
  if (selector) {
    return childElements.filter((child) => child.matches(selector));
  }
  return childElements;
}
function find(element, selector) {
  return Array.from(element.querySelectorAll(selector));
}
function findOne(element, selector) {
  return element.querySelector(selector);
}
function closest(element, selector) {
  return element.closest(selector);
}
function append(parent2, child) {
  if (typeof child === "string") {
    parent2.insertAdjacentHTML("beforeend", child);
  } else {
    parent2.appendChild(child);
  }
}
function prepend(parent2, child) {
  if (typeof child === "string") {
    parent2.insertAdjacentHTML("afterbegin", child);
  } else {
    parent2.insertBefore(child, parent2.firstChild);
  }
}
function insertBefore(newElement, referenceElement) {
  var _a;
  (_a = referenceElement.parentNode) == null ? void 0 : _a.insertBefore(newElement, referenceElement);
}
function insertAfter(newElement, referenceElement) {
  var _a;
  (_a = referenceElement.parentNode) == null ? void 0 : _a.insertBefore(newElement, referenceElement.nextSibling);
}
function remove(element) {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach((el) => {
    var _a;
    return (_a = el == null ? void 0 : el.parentNode) == null ? void 0 : _a.removeChild(el);
  });
}
function detach(element) {
  var _a;
  (_a = element.parentNode) == null ? void 0 : _a.removeChild(element);
  return element;
}
function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
function clone(element, deep = true) {
  return element.cloneNode(deep);
}
function wrapAll(elements, wrapper) {
  const wrapperElement = typeof wrapper === "string" ? createElementFromHTML(wrapper) : wrapper;
  if (elements.length > 0) {
    const parent2 = elements[0].parentNode;
    const referenceNode = elements[0];
    if (parent2) {
      parent2.insertBefore(wrapperElement, referenceNode);
    }
    elements.forEach((el) => wrapperElement.appendChild(el));
  }
  return wrapperElement;
}
function wrap(element, wrapper) {
  var _a;
  const wrapperElement = typeof wrapper === "string" ? createElementFromHTML(wrapper) : wrapper;
  (_a = element.parentNode) == null ? void 0 : _a.insertBefore(wrapperElement, element);
  wrapperElement.appendChild(element);
  return wrapperElement;
}
function is(element, selector) {
  return element.matches(selector);
}
function index(element) {
  if (!element.parentElement) return -1;
  return Array.from(element.parentElement.children).indexOf(element);
}
const dataStore = /* @__PURE__ */ new WeakMap();
function setData(element, key, value) {
  if (!dataStore.has(element)) {
    dataStore.set(element, {});
  }
  const data = dataStore.get(element);
  data[key] = value;
}
function getData(element, key) {
  const data = dataStore.get(element);
  return data ? data[key] : void 0;
}
function focus(element) {
  element.focus();
}
class EventManagerClass {
  constructor() {
    this.eventStore = /* @__PURE__ */ new WeakMap();
  }
  /**
   * Add event listener with optional namespace
   */
  on(element, eventWithNamespace, handler, options) {
    const events = eventWithNamespace.split(/\s+/).filter(Boolean);
    events.forEach((evt) => {
      const [event, namespace] = this.parseEventName(evt);
      element.addEventListener(event, handler, options);
      if (!this.eventStore.has(element)) {
        this.eventStore.set(element, []);
      }
      const handlers = this.eventStore.get(element);
      handlers.push({ event, namespace, handler, options });
    });
  }
  /**
   * Remove event listener by namespace or specific event
   */
  off(element, eventWithNamespace, handler) {
    const handlers = this.eventStore.get(element);
    if (!handlers) return;
    if (!eventWithNamespace) {
      handlers.forEach((h) => element.removeEventListener(h.event, h.handler, h.options));
      this.eventStore.delete(element);
      return;
    }
    const events = eventWithNamespace.split(/\s+/).filter(Boolean);
    events.forEach((evt) => {
      const [event, namespace] = this.parseEventName(evt);
      const handlersToRemove = handlers.filter((h) => {
        if (handler && h.handler !== handler) return false;
        if (event && h.event !== event) return false;
        if (namespace && h.namespace !== namespace) return false;
        return true;
      });
      handlersToRemove.forEach((h) => {
        element.removeEventListener(h.event, h.handler, h.options);
        const index2 = handlers.indexOf(h);
        if (index2 > -1) {
          handlers.splice(index2, 1);
        }
      });
    });
  }
  /**
   * Trigger/dispatch custom event
   */
  trigger(element, eventName, detail) {
    const [event] = this.parseEventName(eventName);
    const customEvent = new CustomEvent(event, {
      bubbles: true,
      cancelable: true,
      detail
    });
    return element.dispatchEvent(customEvent);
  }
  /**
   * Parse event name into event and namespace
   */
  parseEventName(eventName) {
    const parts = eventName.split(".");
    return [parts[0], parts.slice(1).join(".")];
  }
  /**
   * One-time event listener
   */
  one(element, eventWithNamespace, handler) {
    const wrappedHandler = (event) => {
      handler(event);
      this.off(element, eventWithNamespace, wrappedHandler);
    };
    this.on(element, eventWithNamespace, wrappedHandler, { once: true });
  }
  /**
   * Delegated event listener (like jQuery's .on with selector)
   */
  delegate(element, eventWithNamespace, selector, handler) {
    const delegatedHandler = (event) => {
      const target = event.target;
      const delegateTarget = target.closest(selector);
      if (delegateTarget && element.contains && element.contains(delegateTarget)) {
        handler(event, delegateTarget);
      }
    };
    this.on(element, eventWithNamespace, delegatedHandler);
  }
}
const EventManager = new EventManagerClass();
function setupInfinite() {
  const _ = this;
  if (_.options.fade === true) {
    _.options.centerMode = false;
  }
  if (_.options.infinite === true && _.options.fade === false) {
    let slideIndex = null;
    if (_.slideCount > _.options.slidesToShow) {
      const infiniteCount = _.options.centerMode === true ? _.options.slidesToShow + 1 : _.options.slidesToShow;
      for (let i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
        slideIndex = i - 1;
        const clonedSlide = clone(_.$slides[slideIndex], true);
        removeAttributes(clonedSlide, "id");
        setAttributes(clonedSlide, {
          "data-slick-index": String(slideIndex - _.slideCount)
        });
        addClass(clonedSlide, "slick-cloned");
        prepend(_.$slideTrack, clonedSlide);
      }
      for (let i = 0; i < infiniteCount; i += 1) {
        slideIndex = i;
        const clonedSlide = clone(_.$slides[slideIndex], true);
        removeAttributes(clonedSlide, "id");
        setAttributes(clonedSlide, {
          "data-slick-index": String(slideIndex + _.slideCount)
        });
        addClass(clonedSlide, "slick-cloned");
        append(_.$slideTrack, clonedSlide);
      }
      const clonedElements = find(_.$slideTrack, ".slick-cloned [id]");
      clonedElements.forEach((el) => removeAttributes(el, "id"));
    }
  }
}
function setSlideClasses(index2) {
  const _ = this;
  const allSlides = find(_.$slider, ".slick-slide");
  const activeElement = document.activeElement;
  allSlides.forEach((slide) => {
    if (activeElement && slide.contains(activeElement)) {
      activeElement.blur();
    }
    removeClass(slide, "slick-active", "slick-center", "slick-current");
    setAttributes(slide, { "aria-hidden": "true", "tabindex": "-1" });
  });
  addClass(_.$slides[index2], "slick-current");
  setAttributes(_.$slides[index2], { "tabindex": "0" });
  if (_.options.centerMode === true) {
    let evenCoef;
    let centerOffset;
    if (_.options.slidesToShow >= _.$slides.length) {
      evenCoef = -1;
      centerOffset = _.options.slidesToShow = _.$slides.length;
    } else {
      evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
      centerOffset = Math.floor(_.options.slidesToShow / 2);
    }
    if (_.options.infinite === true) {
      if (index2 >= centerOffset && index2 <= _.slideCount - 1 - centerOffset) {
        const startIndex = index2 - centerOffset + evenCoef;
        const endIndex = index2 + centerOffset + 1;
        for (let i = startIndex; i < endIndex; i++) {
          addClass(_.$slides[i], "slick-active");
          setAttributes(_.$slides[i], { "aria-hidden": "false", "tabindex": "0" });
        }
      } else {
        const indexOffset = _.options.slidesToShow + index2;
        const start = indexOffset - centerOffset + 1 + evenCoef;
        const end = indexOffset + centerOffset + 2;
        for (let i = start; i < end && i < allSlides.length; i++) {
          addClass(allSlides[i], "slick-active");
          setAttributes(allSlides[i], { "aria-hidden": "false", "tabindex": "0" });
        }
      }
      if (index2 === 0) {
        const targetSlide = allSlides[_.options.slidesToShow + _.slideCount + 1];
        if (targetSlide) {
          addClass(targetSlide, "slick-center");
        }
      } else if (index2 === _.slideCount - 1) {
        const targetSlide = allSlides[_.options.slidesToShow];
        if (targetSlide) {
          addClass(targetSlide, "slick-center");
        }
      }
    }
    addClass(_.$slides[index2], "slick-center");
  } else {
    if (index2 >= 0 && index2 <= _.slideCount - _.options.slidesToShow) {
      for (let i = index2; i < index2 + _.options.slidesToShow; i++) {
        addClass(_.$slides[i], "slick-active");
        setAttributes(_.$slides[i], { "aria-hidden": "false", "tabindex": "0" });
      }
    } else if (allSlides.length <= _.options.slidesToShow) {
      allSlides.forEach((slide) => {
        addClass(slide, "slick-active");
        setAttributes(slide, { "aria-hidden": "false", "tabindex": "0" });
      });
    } else {
      const remainder = _.slideCount % _.options.slidesToShow;
      const indexOffset = _.options.infinite === true ? _.options.slidesToShow + index2 : index2;
      if (_.options.slidesToShow === _.options.slidesToScroll && _.slideCount - index2 < _.options.slidesToShow) {
        const start = indexOffset - (_.options.slidesToShow - remainder);
        const end = indexOffset + remainder;
        for (let i = start; i < end && i < allSlides.length; i++) {
          addClass(allSlides[i], "slick-active");
          setAttributes(allSlides[i], { "aria-hidden": "false", "tabindex": "0" });
        }
      } else {
        const end = indexOffset + _.options.slidesToShow;
        for (let i = indexOffset; i < end && i < allSlides.length; i++) {
          addClass(allSlides[i], "slick-active");
          setAttributes(allSlides[i], { "aria-hidden": "false", "tabindex": "0" });
        }
      }
    }
  }
  if (_.options.lazyLoad === "ondemand" || _.options.lazyLoad === "anticipated") {
    _.lazyLoad();
  }
}
function startLoad() {
  const _ = this;
  if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
    if (_.$prevArrow) setCSS$1(_.$prevArrow, { display: "none" });
    if (_.$nextArrow) setCSS$1(_.$nextArrow, { display: "none" });
  }
  if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
    if (_.$dots) setCSS$1(_.$dots, { display: "none" });
  }
  addClass(_.$slider, "slick-loading");
}
function loadSlider() {
  const _ = this;
  _.setPosition();
  if (_.$slideTrack) {
    setCSS$1(_.$slideTrack, { opacity: "1" });
  }
  removeClass(_.$slider, "slick-loading");
  _.initUI();
  if (_.options.lazyLoad === "progressive") {
    _.progressiveLazyLoad();
  }
}
function initUI() {
  const _ = this;
  if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
    if (_.$prevArrow) setCSS$1(_.$prevArrow, { display: "" });
    if (_.$nextArrow) setCSS$1(_.$nextArrow, { display: "" });
  }
  if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
    if (_.$dots) setCSS$1(_.$dots, { display: "" });
  }
}
function setDimensions() {
  const _ = this;
  if (_.options.vertical === false) {
    if (_.options.centerMode === true) {
      setCSS$1(_.$list, {
        padding: `0px ${_.options.centerPadding}`
      });
    }
  } else {
    const firstSlideHeight = outerHeight(_.$slides[0], true);
    setCSS$1(_.$list, {
      height: `${firstSlideHeight * _.options.slidesToShow}px`
    });
    if (_.options.centerMode === true) {
      setCSS$1(_.$list, {
        padding: `${_.options.centerPadding} 0px`
      });
    }
  }
  _.listWidth = Math.ceil(width(_.$list));
  _.listHeight = Math.ceil(height(_.$list));
  if (_.options.vertical === false && _.options.variableWidth === false) {
    _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
    const trackWidth = _.slideWidth * children(_.$slideTrack, ".slick-slide").length;
    setCSS$1(_.$slideTrack, { width: `${Math.ceil(trackWidth)}px` });
  } else if (_.options.variableWidth === true) {
    setCSS$1(_.$slideTrack, { width: `${5e3 * _.slideCount}px` });
  } else {
    _.slideWidth = Math.ceil(_.listWidth);
    const firstSlideHeight = outerHeight(_.$slides[0], true);
    const trackHeight = firstSlideHeight * children(_.$slideTrack, ".slick-slide").length;
    setCSS$1(_.$slideTrack, { height: `${Math.ceil(trackHeight)}px` });
  }
  const offset = outerWidth(_.$slides[0], true) - _.$slides[0].offsetWidth;
  if (_.options.variableWidth === false) {
    const slideChildren = children(_.$slideTrack, ".slick-slide");
    slideChildren.forEach((slide) => {
      setCSS$1(slide, { width: `${(_.slideWidth || 0) - offset}px` });
    });
  }
}
function setHeight() {
  const _ = this;
  if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
    const targetHeight = outerHeight(_.$slides[_.currentSlide], true);
    setCSS$1(_.$list, { height: `${targetHeight}px` });
  }
}
function setPosition() {
  const _ = this;
  _.setDimensions();
  _.setHeight();
  if (_.options.fade === false) {
    _.setCSS(_.getLeft(_.currentSlide));
  } else {
    _.setFade();
  }
  EventManager.trigger(_.$slider, "setPosition", [_]);
}
function resize() {
  const _ = this;
  if (window.innerWidth !== _.windowWidth) {
    if (_.windowTimer) {
      clearTimeout(_.windowTimer);
    }
    _.windowTimer = window.setTimeout(() => {
      _.windowWidth = window.innerWidth;
      _.checkResponsive();
      if (!_.unslicked) {
        _.setPosition();
      }
    }, 50);
  }
}
function autoPlay() {
  const _ = this;
  _.autoPlayClear();
  if (_.slideCount > _.options.slidesToShow) {
    _.autoPlayTimer = window.setInterval(_.boundAutoPlayIterator, _.options.autoplaySpeed);
  }
}
function autoPlayIterator() {
  const _ = this;
  let slideTo = _.currentSlide + _.options.slidesToScroll;
  if (!_.paused && !_.interrupted && !_.focussed) {
    if (_.options.infinite === false) {
      if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
        _.direction = 0;
      } else if (_.direction === 0) {
        slideTo = _.currentSlide - _.options.slidesToScroll;
        if (_.currentSlide - 1 === 0) {
          _.direction = 1;
        }
      }
    }
    _.slideHandler(slideTo);
  }
}
function changeSlide(event, dontAnimate) {
  const _ = this;
  const eventData = event.data || {};
  const target = event.currentTarget;
  if (target && is(target, "a")) {
    event.preventDefault();
  }
  let $target = target;
  if ($target && !is($target, "li")) {
    const closest$1 = closest($target, "li");
    if (closest$1) $target = closest$1;
  }
  const unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
  const indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;
  let slideOffset;
  switch (eventData.message) {
    case "previous":
      slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
      if (_.slideCount > _.options.slidesToShow) {
        _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
      }
      break;
    case "next":
      slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
      if (_.slideCount > _.options.slidesToShow) {
        _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
      }
      break;
    case "index":
      const index$1 = eventData.index === 0 ? 0 : eventData.index || ($target ? index($target) * _.options.slidesToScroll : 0);
      _.slideHandler(_.checkNavigable(index$1), false, dontAnimate);
      if ($target) {
        const focusable = children($target);
        if (focusable.length > 0) {
          focus(focusable[0]);
        }
      }
      break;
    default:
      return;
  }
}
function selectHandler(event) {
  const _ = this;
  const target = event.target;
  const targetElement = is(target, ".slick-slide") ? target : closest(target, ".slick-slide");
  if (!targetElement) return;
  const index2 = parseInt(targetElement.getAttribute("data-slick-index") || "0");
  if (_.slideCount <= _.options.slidesToShow) {
    _.slideHandler(index2, false, true);
    return;
  }
  _.slideHandler(index2);
}
function slideHandler(index2, sync = false, dontAnimate) {
  const _ = this;
  if (_.animating === true && _.options.waitForAnimate === true) {
    return;
  }
  if (_.options.fade === true && _.currentSlide === index2) {
    return;
  }
  if (sync === false) {
    _.asNavFor(index2);
  }
  let targetSlide = index2;
  const targetLeft = _.getLeft(targetSlide);
  const slideLeft = _.getLeft(_.currentSlide);
  _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
  if (_.options.infinite === false && _.options.centerMode === false && (index2 < 0 || index2 > _.getDotCount() * _.options.slidesToScroll)) {
    if (_.options.fade === false) {
      targetSlide = _.currentSlide;
      if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
        _.animateSlide(slideLeft, () => {
          _.postSlide(targetSlide);
        });
      } else {
        _.postSlide(targetSlide);
      }
    }
    return;
  } else if (_.options.infinite === false && _.options.centerMode === true && (index2 < 0 || index2 > _.slideCount - _.options.slidesToScroll)) {
    if (_.options.fade === false) {
      targetSlide = _.currentSlide;
      if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
        _.animateSlide(slideLeft, () => {
          _.postSlide(targetSlide);
        });
      } else {
        _.postSlide(targetSlide);
      }
    }
    return;
  }
  if (_.options.autoplay) {
    clearInterval(_.autoPlayTimer);
  }
  let animSlide;
  if (targetSlide < 0) {
    if (_.slideCount % _.options.slidesToScroll !== 0) {
      animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
    } else {
      animSlide = _.slideCount + targetSlide;
    }
  } else if (targetSlide >= _.slideCount) {
    if (_.slideCount % _.options.slidesToScroll !== 0) {
      animSlide = 0;
    } else {
      animSlide = targetSlide - _.slideCount;
    }
  } else {
    animSlide = targetSlide;
  }
  _.animating = true;
  EventManager.trigger(_.$slider, "beforeChange", [_, _.currentSlide, animSlide]);
  const oldSlide = _.currentSlide;
  _.currentSlide = animSlide;
  _.setSlideClasses(_.currentSlide);
  if (_.options.asNavFor) {
    const navTargets = _.getNavTarget();
    navTargets.forEach((target) => {
      const slickInstance = target.slick;
      if (slickInstance && !slickInstance.unslicked) {
        if (slickInstance.slideCount <= slickInstance.options.slidesToShow) {
          slickInstance.setSlideClasses(_.currentSlide);
        }
      }
    });
  }
  _.updateDots();
  _.updateArrows();
  if (_.options.fade === true) {
    if (dontAnimate !== true) {
      _.fadeSlideOut(oldSlide);
      _.fadeSlide(animSlide, () => {
        _.postSlide(animSlide);
      });
    } else {
      _.postSlide(animSlide);
    }
    _.animateHeight();
    return;
  }
  if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
    _.animateSlide(targetLeft, () => {
      _.postSlide(animSlide);
    });
  } else {
    _.postSlide(animSlide);
  }
}
function postSlide(index2) {
  const _ = this;
  if (!_.unslicked) {
    EventManager.trigger(_.$slider, "afterChange", [_, index2]);
    _.animating = false;
    if (_.slideCount > _.options.slidesToShow) {
      _.setPosition();
    }
    _.swipeLeft = null;
    if (_.options.autoplay) {
      _.autoPlay();
    }
    if (_.options.accessibility === true) {
      _.initADA();
      if (_.options.focusOnChange) {
        const $currentSlide = _.$slides[_.currentSlide];
        if ($currentSlide) {
          setAttributes($currentSlide, { tabindex: "0" });
          focus($currentSlide);
        }
      }
    }
  }
}
function getLeft(slideIndex) {
  const _ = this;
  let targetLeft;
  let verticalHeight;
  let verticalOffset = 0;
  let targetSlide;
  let coef;
  _.slideOffset = 0;
  verticalHeight = _.$slides[0] ? outerHeight(_.$slides[0], true) : 0;
  if (_.options.infinite === true) {
    if (_.slideCount > _.options.slidesToShow) {
      _.slideOffset = (_.slideWidth || 0) * _.options.slidesToShow * -1;
      coef = -1;
      if (_.options.vertical === true && _.options.centerMode === true) {
        if (_.options.slidesToShow === 2) {
          coef = -1.5;
        } else if (_.options.slidesToShow === 1) {
          coef = -2;
        }
      }
      verticalOffset = verticalHeight * _.options.slidesToShow * coef;
    }
    if (_.slideCount % _.options.slidesToScroll !== 0) {
      if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
        if (slideIndex > _.slideCount) {
          _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * (_.slideWidth || 0) * -1;
          verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
        } else {
          _.slideOffset = _.slideCount % _.options.slidesToScroll * (_.slideWidth || 0) * -1;
          verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
        }
      }
    }
  } else {
    if (slideIndex + _.options.slidesToShow > _.slideCount) {
      _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * (_.slideWidth || 0);
      verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
    }
  }
  if (_.slideCount <= _.options.slidesToShow) {
    _.slideOffset = 0;
    verticalOffset = 0;
  }
  if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
    _.slideOffset = (_.slideWidth || 0) * Math.floor(_.options.slidesToShow) / 2 - (_.slideWidth || 0) * _.slideCount / 2;
  } else if (_.options.centerMode === true && _.options.infinite === true) {
    _.slideOffset += (_.slideWidth || 0) * Math.floor(_.options.slidesToShow / 2) - (_.slideWidth || 0);
  } else if (_.options.centerMode === true) {
    _.slideOffset = 0;
    _.slideOffset += (_.slideWidth || 0) * Math.floor(_.options.slidesToShow / 2);
  }
  if (_.options.vertical === false) {
    targetLeft = slideIndex * (_.slideWidth || 0) * -1 + _.slideOffset;
  } else {
    targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
  }
  if (_.options.variableWidth === true) {
    const allSlides = find(_.$slideTrack, ".slick-slide");
    if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
      targetSlide = allSlides[slideIndex] || null;
    } else {
      targetSlide = allSlides[slideIndex + _.options.slidesToShow] || null;
    }
    if (_.options.rtl === true) {
      if (targetSlide) {
        targetLeft = (_.$slideTrack.offsetWidth - targetSlide.offsetLeft - outerWidth(targetSlide)) * -1;
      } else {
        targetLeft = 0;
      }
    } else {
      targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
    }
    if (_.options.centerMode === true) {
      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = allSlides[slideIndex] || null;
      } else {
        targetSlide = allSlides[slideIndex + _.options.slidesToShow + 1] || null;
      }
      if (_.options.rtl === true) {
        if (targetSlide) {
          targetLeft = (_.$slideTrack.offsetWidth - targetSlide.offsetLeft - outerWidth(targetSlide)) * -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
      }
      targetLeft += (_.$list.offsetWidth - outerWidth(targetSlide)) / 2;
    }
  }
  return targetLeft;
}
function getNavTarget() {
  const asNavFor2 = this.options.asNavFor;
  if (asNavFor2 && asNavFor2 !== null) {
    if (typeof asNavFor2 === "string") {
      return getElements(asNavFor2).filter((el) => el !== this.$slider);
    } else if (asNavFor2 !== this.$slider) {
      return [asNavFor2];
    }
  }
  return [];
}
function asNavFor(index2) {
  const _ = this;
  const targets = _.getNavTarget();
  targets.forEach((target) => {
    const slickInstance = target.slick;
    if (slickInstance && !slickInstance.unslicked) {
      slickInstance.slideHandler(index2, true);
    }
  });
}
function initializeEvents() {
  const _ = this;
  _.initArrowEvents();
  _.initDotEvents();
  _.initSlideEvents();
  if (_.$list) {
    EventManager.on(_.$list, "touchstart.slick mousedown.slick", (event) => {
      event.data = { action: "start" };
      _.boundSwipeHandler(event);
    });
    EventManager.on(_.$list, "touchmove.slick mousemove.slick", (event) => {
      event.data = { action: "move" };
      _.boundSwipeHandler(event);
    });
    EventManager.on(_.$list, "touchend.slick mouseup.slick", (event) => {
      event.data = { action: "end" };
      _.boundSwipeHandler(event);
    });
    EventManager.on(_.$list, "touchcancel.slick mouseleave.slick", (event) => {
      event.data = { action: "end" };
      _.boundSwipeHandler(event);
    });
    EventManager.on(_.$list, "click.slick", _.boundClickHandler);
  }
  if (typeof document.hidden !== "undefined") {
    _.hidden = "hidden";
    _.visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    _.hidden = "msHidden";
    _.visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    _.hidden = "webkitHidden";
    _.visibilityChange = "webkitvisibilitychange";
  }
  EventManager.on(document, _.visibilityChange, _.boundVisibility);
  if (_.options.accessibility === true && _.$list) {
    EventManager.on(_.$list, "keydown.slick", _.boundKeyHandler);
  }
  if (_.options.focusOnSelect === true) {
    const trackChildren = children(_.$slideTrack);
    trackChildren.forEach((child) => {
      EventManager.on(child, "click.slick", _.boundSelectHandler);
    });
  }
  EventManager.on(window, `orientationchange.slick.slick-${_.instanceUid}`, _.boundOrientationChange);
  EventManager.on(window, `resize.slick.slick-${_.instanceUid}`, _.boundResize);
  const draggableElements = find(_.$slideTrack, ':not([draggable="true"])');
  draggableElements.forEach((el) => {
    el.addEventListener("dragstart", _.preventDefault);
  });
  EventManager.on(window, `load.slick.slick-${_.instanceUid}`, _.boundSetPosition);
  _.setPosition();
}
function detectTransformSupport() {
  const bodyStyle = document.body.style;
  const support = {
    transform: false,
    transition: false,
    transformType: null,
    transitionType: null,
    animType: null
  };
  if (bodyStyle.transform !== void 0) {
    support.transform = true;
    support.transformType = "transform";
    support.animType = "transform";
  } else if (bodyStyle.webkitTransform !== void 0) {
    support.transform = true;
    support.transformType = "-webkit-transform";
    support.animType = "webkitTransform";
  } else if (bodyStyle.MozTransform !== void 0) {
    support.transform = true;
    support.transformType = "-moz-transform";
    support.animType = "MozTransform";
  } else if (bodyStyle.msTransform !== void 0) {
    support.transform = true;
    support.transformType = "-ms-transform";
    support.animType = "msTransform";
  } else if (bodyStyle.OTransform !== void 0) {
    support.transform = true;
    support.transformType = "-o-transform";
    support.animType = "OTransform";
  }
  if (bodyStyle.transition !== void 0) {
    support.transition = true;
    support.transitionType = "transition";
  } else if (bodyStyle.webkitTransition !== void 0) {
    support.transition = true;
    support.transitionType = "webkitTransition";
  } else if (bodyStyle.MozTransition !== void 0) {
    support.transition = true;
    support.transitionType = "MozTransition";
  } else if (bodyStyle.msTransition !== void 0) {
    support.transition = true;
    support.transitionType = "msTransition";
  } else if (bodyStyle.OTransition !== void 0) {
    support.transition = true;
    support.transitionType = "OTransition";
  }
  const perspectiveProperty = bodyStyle.perspectiveProperty;
  const webkitPerspective = bodyStyle.webkitPerspective;
  const MozPerspective = bodyStyle.MozPerspective;
  if (support.animType === "OTransform" && perspectiveProperty === void 0 && webkitPerspective === void 0) {
    support.animType = null;
  }
  if (support.animType === "MozTransform" && perspectiveProperty === void 0 && MozPerspective === void 0) {
    support.animType = null;
  }
  if (support.animType === "webkitTransform" && perspectiveProperty === void 0 && webkitPerspective === void 0) {
    support.animType = null;
  }
  return support;
}
function setTransform(element, value, transformType) {
  element.style[transformType] = value;
}
function setTransition(element, value, transitionType) {
  element.style[transitionType] = value;
}
function removeTransition(element, transitionType) {
  element.style[transitionType] = "";
}
const easingMap = {
  "linear": "linear",
  "swing": "ease",
  "ease": "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out"
};
function getEasing(easing) {
  return easingMap[easing] || easing;
}
function animateCSS(element, props, options, transitionType) {
  const { duration, easing, complete } = options;
  const transitions = Object.keys(props).map((prop) => {
    const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
    return `${cssProp} ${duration}ms ${getEasing(easing)}`;
  }).join(", ");
  setTransition(element, transitions, transitionType);
  Object.entries(props).forEach(([key, value]) => {
    if (value !== void 0) {
      element.style[key] = value;
    }
  });
  if (complete) {
    let completed = false;
    const onTransitionEnd = () => {
      if (completed) return;
      completed = true;
      element.removeEventListener("transitionend", onTransitionEnd);
      element.removeEventListener("webkitTransitionEnd", onTransitionEnd);
      clearTimeout(fallbackTimeout);
      removeTransition(element, transitionType);
      complete();
    };
    element.addEventListener("transitionend", onTransitionEnd);
    element.addEventListener("webkitTransitionEnd", onTransitionEnd);
    const fallbackTimeout = setTimeout(() => {
      if (completed) return;
      completed = true;
      element.removeEventListener("transitionend", onTransitionEnd);
      element.removeEventListener("webkitTransitionEnd", onTransitionEnd);
      removeTransition(element, transitionType);
      complete();
    }, duration + 50);
  }
}
function animateRAF(element, props, options) {
  const { duration, easing, complete } = options;
  const startTime = performance.now();
  const startValues = {};
  Object.keys(props).forEach((key) => {
    const currentValue = element.style[key];
    startValues[key] = parseFloat(currentValue) || 0;
  });
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing === "linear" ? progress : easing === "ease-in" ? progress * progress : easing === "ease-out" ? progress * (2 - progress) : progress;
    Object.entries(props).forEach(([key, endValue]) => {
      const startValue = startValues[key];
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      element.style[key] = `${Math.ceil(currentValue)}px`;
    });
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (complete) {
      complete();
    }
  }
  requestAnimationFrame(animate);
}
function fade(element, opacity, duration, callback) {
  const start = parseFloat(window.getComputedStyle(element).opacity) || 0;
  const startTime = performance.now();
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    element.style.opacity = String(start + (opacity - start) * progress);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (callback) {
      callback();
    }
  }
  requestAnimationFrame(animate);
}
function animateSlide(targetLeft, callback) {
  const _ = this;
  _.animateHeight();
  if (_.options.rtl === true && _.options.vertical === false) {
    targetLeft = -targetLeft;
  }
  if (_.transformsEnabled === false) {
    if (_.options.vertical === false) {
      if (_.$slideTrack) {
        animateRAF(_.$slideTrack, { left: targetLeft }, {
          duration: _.options.speed,
          easing: _.options.easing,
          complete: callback
        });
      }
    } else {
      if (_.$slideTrack) {
        animateRAF(_.$slideTrack, { top: targetLeft }, {
          duration: _.options.speed,
          easing: _.options.easing,
          complete: callback
        });
      }
    }
  } else {
    if (_.cssTransitions === false) {
      if (_.options.rtl === true) {
        _.currentLeft = -(_.currentLeft || 0);
      }
      const startLeft = _.currentLeft || 0;
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / _.options.speed, 1);
        const now = Math.ceil(startLeft + (targetLeft - startLeft) * progress);
        if (_.$slideTrack) {
          if (_.options.vertical === false) {
            const transform = `translate(${now}px, 0px)`;
            setTransform(_.$slideTrack, transform, _.animType || "transform");
          } else {
            const transform = `translate(0px, ${now}px)`;
            setTransform(_.$slideTrack, transform, _.animType || "transform");
          }
        }
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (callback) {
            callback();
          }
        }
      };
      requestAnimationFrame(animate);
    } else {
      _.applyTransition();
      targetLeft = Math.ceil(targetLeft);
      if (_.$slideTrack) {
        let transform;
        if (_.options.vertical === false) {
          transform = `translate3d(${targetLeft}px, 0px, 0px)`;
        } else {
          transform = `translate3d(0px, ${targetLeft}px, 0px)`;
        }
        setTransform(_.$slideTrack, transform, _.animType || "transform");
      }
      if (callback) {
        setTimeout(() => {
          _.disableTransition();
          callback();
        }, _.options.speed);
      }
    }
  }
}
function animateHeight() {
  const _ = this;
  if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
    const targetHeight = outerHeight(_.$slides[_.currentSlide], true);
    if (_.$list) {
      animateCSS(_.$list, {
        height: `${targetHeight}px`
      }, {
        duration: _.options.speed,
        easing: _.options.easing
      }, _.transitionType || "transition");
    }
  }
}
function applyTransition(slide) {
  const _ = this;
  if (!_.transitionType) return;
  let transitionValue;
  if (_.options.fade === false) {
    transitionValue = `${_.transformType} ${_.options.speed}ms ${_.options.cssEase}`;
  } else {
    transitionValue = `opacity ${_.options.speed}ms ${_.options.cssEase}`;
  }
  if (_.options.fade === false) {
    if (_.$slideTrack) {
      setTransition(_.$slideTrack, transitionValue, _.transitionType);
    }
  } else {
    if (slide !== void 0 && _.$slides[slide]) {
      setTransition(_.$slides[slide], transitionValue, _.transitionType);
    }
  }
}
function disableTransition(slide) {
  const _ = this;
  if (!_.transitionType) return;
  if (_.options.fade === false) {
    if (_.$slideTrack) {
      removeTransition(_.$slideTrack, _.transitionType);
    }
  } else {
    if (slide !== void 0 && _.$slides[slide]) {
      removeTransition(_.$slides[slide], _.transitionType);
    }
  }
}
function fadeSlide(slideIndex, callback) {
  const _ = this;
  if (_.cssTransitions === false) {
    setCSS$1(_.$slides[slideIndex], {
      zIndex: String(_.options.zIndex)
    });
    fade(_.$slides[slideIndex], 1, _.options.speed, callback);
  } else {
    _.applyTransition(slideIndex);
    setCSS$1(_.$slides[slideIndex], {
      opacity: "1",
      zIndex: String(_.options.zIndex)
    });
    if (callback) {
      setTimeout(() => {
        _.disableTransition(slideIndex);
        callback();
      }, _.options.speed);
    }
  }
}
function fadeSlideOut(slideIndex) {
  const _ = this;
  if (_.cssTransitions === false) {
    fade(_.$slides[slideIndex], 0, _.options.speed, () => {
      setCSS$1(_.$slides[slideIndex], {
        zIndex: String(_.options.zIndex - 2)
      });
    });
  } else {
    _.applyTransition(slideIndex);
    setCSS$1(_.$slides[slideIndex], {
      opacity: "0",
      zIndex: String(_.options.zIndex - 2)
    });
  }
}
function setCSS(position) {
  const _ = this;
  if (_.options.rtl === true) {
    position = -position;
  }
  const x = _.positionProp === "left" ? Math.ceil(position) + "px" : "0px";
  const y = _.positionProp === "top" ? Math.ceil(position) + "px" : "0px";
  if (_.transformsEnabled === false) {
    if (_.$slideTrack) {
      setCSS$1(_.$slideTrack, {
        [_.positionProp]: _.positionProp === "left" ? x : y
      });
    }
  } else {
    let transform;
    if (_.cssTransitions === false) {
      transform = `translate(${x}, ${y})`;
    } else {
      transform = `translate3d(${x}, ${y}, 0px)`;
    }
    if (_.$slideTrack && _.animType) {
      setTransform(_.$slideTrack, transform, _.animType);
    }
  }
}
function setFade() {
  const _ = this;
  _.$slides.forEach((slide, index2) => {
    const targetLeft = (_.slideWidth || 0) * index2 * -1;
    if (_.options.rtl === true) {
      setCSS$1(slide, {
        position: "relative",
        right: `${targetLeft}px`,
        top: "0",
        zIndex: String(_.options.zIndex - 2),
        opacity: "0"
      });
    } else {
      setCSS$1(slide, {
        position: "relative",
        left: `${targetLeft}px`,
        top: "0",
        zIndex: String(_.options.zIndex - 2),
        opacity: "0"
      });
    }
  });
  setCSS$1(_.$slides[_.currentSlide], {
    zIndex: String(_.options.zIndex - 1),
    opacity: "1"
  });
}
function buildArrows() {
  const _ = this;
  if (_.options.arrows === true) {
    if (isHTML(String(_.options.prevArrow))) {
      _.$prevArrow = createElementFromHTML(String(_.options.prevArrow));
    } else {
      _.$prevArrow = _.options.prevArrow;
    }
    addClass(_.$prevArrow, "slick-arrow");
    if (isHTML(String(_.options.nextArrow))) {
      _.$nextArrow = createElementFromHTML(String(_.options.nextArrow));
    } else {
      _.$nextArrow = _.options.nextArrow;
    }
    addClass(_.$nextArrow, "slick-arrow");
    if (_.slideCount > _.options.slidesToShow) {
      removeClass(_.$prevArrow, "slick-hidden");
      removeAttributes(_.$prevArrow, "aria-hidden", "tabindex");
      removeClass(_.$nextArrow, "slick-hidden");
      removeAttributes(_.$nextArrow, "aria-hidden", "tabindex");
      if (isHTML(String(_.options.prevArrow))) {
        const appendTarget = typeof _.options.appendArrows === "string" ? getElement(_.options.appendArrows) : _.options.appendArrows;
        if (appendTarget) prepend(appendTarget, _.$prevArrow);
      }
      if (isHTML(String(_.options.nextArrow))) {
        const appendTarget = typeof _.options.appendArrows === "string" ? getElement(_.options.appendArrows) : _.options.appendArrows;
        if (appendTarget) append(appendTarget, _.$nextArrow);
      }
      if (_.options.infinite !== true) {
        addClass(_.$prevArrow, "slick-disabled");
        setAttributes(_.$prevArrow, { "aria-disabled": "true" });
      }
    } else {
      addClass(_.$prevArrow, "slick-hidden");
      addClass(_.$nextArrow, "slick-hidden");
      setAttributes(_.$prevArrow, {
        "aria-disabled": "true",
        "tabindex": "-1"
      });
      setAttributes(_.$nextArrow, {
        "aria-disabled": "true",
        "tabindex": "-1"
      });
    }
  }
}
function updateArrows() {
  const _ = this;
  if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
    removeClass(_.$prevArrow, "slick-disabled");
    setAttributes(_.$prevArrow, { "aria-disabled": "false" });
    removeClass(_.$nextArrow, "slick-disabled");
    setAttributes(_.$nextArrow, { "aria-disabled": "false" });
    if (_.currentSlide === 0) {
      addClass(_.$prevArrow, "slick-disabled");
      setAttributes(_.$prevArrow, { "aria-disabled": "true" });
      removeClass(_.$nextArrow, "slick-disabled");
      setAttributes(_.$nextArrow, { "aria-disabled": "false" });
    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
      addClass(_.$nextArrow, "slick-disabled");
      setAttributes(_.$nextArrow, { "aria-disabled": "true" });
      removeClass(_.$prevArrow, "slick-disabled");
      setAttributes(_.$prevArrow, { "aria-disabled": "false" });
    } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
      addClass(_.$nextArrow, "slick-disabled");
      setAttributes(_.$nextArrow, { "aria-disabled": "true" });
      removeClass(_.$prevArrow, "slick-disabled");
      setAttributes(_.$prevArrow, { "aria-disabled": "false" });
    }
  }
}
function initArrowEvents() {
  const _ = this;
  if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
    EventManager.off(_.$prevArrow, "click.slick");
    EventManager.on(_.$prevArrow, "click.slick", (event) => {
      event.data = { message: "previous" };
      _.boundChangeSlide(event, false);
    });
    EventManager.off(_.$nextArrow, "click.slick");
    EventManager.on(_.$nextArrow, "click.slick", (event) => {
      event.data = { message: "next" };
      _.boundChangeSlide(event, false);
    });
    if (_.options.accessibility === true) {
      EventManager.on(_.$prevArrow, "keydown.slick", _.boundKeyHandler);
      EventManager.on(_.$nextArrow, "keydown.slick", _.boundKeyHandler);
    }
  }
}
function buildDots() {
  const _ = this;
  if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
    addClass(_.$slider, "slick-dotted");
    const dot = document.createElement("ul");
    addClass(dot, _.options.dotsClass);
    const dotCount = _.getDotCount();
    for (let i = 0; i <= dotCount; i += 1) {
      const li = document.createElement("li");
      const button = _.options.customPaging.call(this, _, i);
      li.appendChild(button);
      dot.appendChild(li);
    }
    const appendTarget = typeof _.options.appendDots === "string" ? getElement(_.options.appendDots) : _.options.appendDots;
    if (appendTarget) {
      appendTarget.appendChild(dot);
    }
    _.$dots = dot;
    const firstDot = findOne(_.$dots, "li");
    if (firstDot) {
      addClass(firstDot, "slick-active");
    }
  }
}
function updateDots() {
  const _ = this;
  if (_.$dots !== null) {
    const dots = find(_.$dots, "li");
    dots.forEach((dot) => removeClass(dot, "slick-active"));
    const activeDotIndex = Math.floor(_.currentSlide / _.options.slidesToScroll);
    if (dots[activeDotIndex]) {
      addClass(dots[activeDotIndex], "slick-active");
    }
  }
}
function getDotCount() {
  const _ = this;
  let breakPoint = 0;
  let counter = 0;
  let pagerQty = 0;
  if (_.options.infinite === true) {
    if (_.slideCount <= _.options.slidesToShow) {
      ++pagerQty;
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    }
  } else if (_.options.centerMode === true) {
    pagerQty = _.slideCount;
  } else if (!_.options.asNavFor) {
    pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
  } else {
    while (breakPoint < _.slideCount) {
      ++pagerQty;
      breakPoint = counter + _.options.slidesToScroll;
      counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
    }
  }
  return pagerQty - 1;
}
function initDotEvents() {
  const _ = this;
  if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
    EventManager.delegate(_.$dots, "click.slick", "li", (event, target) => {
      event.preventDefault();
      const pageIndex = index(target);
      const slideIndex = pageIndex * _.options.slidesToScroll;
      event.data = { message: "index", index: slideIndex };
      _.boundChangeSlide(event);
    });
    if (_.options.accessibility === true) {
      EventManager.on(_.$dots, "keydown.slick", _.boundKeyHandler);
    }
  }
  if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
    EventManager.delegate(_.$dots, "mouseenter.slick", "li", () => {
      _.interrupt(true);
    });
    EventManager.delegate(_.$dots, "mouseleave.slick", "li", () => {
      _.interrupt(false);
    });
  }
}
function interrupt(toggle) {
  const _ = this;
  if (!toggle) {
    _.autoPlay();
  }
  _.interrupted = toggle;
}
function keyHandler(event) {
  const _ = this;
  const target = event.target;
  if (target.tagName.match("TEXTAREA|INPUT|SELECT")) {
    return;
  }
  if (event.keyCode === 37 && _.options.accessibility === true) {
    const message = _.options.rtl === true ? "next" : "previous";
    event.data = { message };
    _.changeSlide(event, false);
  } else if (event.keyCode === 39 && _.options.accessibility === true) {
    const message = _.options.rtl === true ? "previous" : "next";
    event.data = { message };
    _.changeSlide(event, false);
  }
}
function swipeHandler(event) {
  var _a;
  const _ = this;
  if (!_.options.swipe || "ontouchend" in document && !_.options.swipe) {
    return;
  } else if (_.options.draggable === false && event.type.indexOf("mouse") !== -1) {
    return;
  }
  const originalEvent = event.originalEvent || event;
  const touches = originalEvent.touches;
  _.touchObject.fingerCount = touches !== void 0 ? touches.length : 1;
  _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;
  if (_.options.verticalSwiping === true) {
    _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
  }
  const actionData = ((_a = event.data) == null ? void 0 : _a.action) || event.action;
  switch (actionData) {
    case "start":
      _.swipeStart(event);
      break;
    case "move":
      _.swipeMove(event);
      break;
    case "end":
      _.swipeEnd(event);
      break;
  }
}
function swipeStart(event) {
  const _ = this;
  _.interrupted = true;
  if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
    _.touchObject = {};
    return;
  }
  const originalEvent = event.originalEvent || event;
  const touches = originalEvent.touches;
  if (touches !== void 0) {
    _.touchObject.startX = _.touchObject.curX = touches[0].pageX;
    _.touchObject.startY = _.touchObject.curY = touches[0].pageY;
  } else {
    _.touchObject.startX = _.touchObject.curX = event.clientX;
    _.touchObject.startY = _.touchObject.curY = event.clientY;
  }
  _.dragging = true;
}
function swipeMove(event) {
  const _ = this;
  const originalEvent = event.originalEvent || event;
  const touches = originalEvent.touches;
  if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
    return;
  }
  const curLeft = _.getLeft(_.currentSlide);
  if (touches !== void 0) {
    _.touchObject.curX = touches[0].pageX;
    _.touchObject.curY = touches[0].pageY;
  } else {
    _.touchObject.curX = event.clientX;
    _.touchObject.curY = event.clientY;
  }
  _.touchObject.swipeLength = Math.round(Math.sqrt(
    Math.pow((_.touchObject.curX || 0) - (_.touchObject.startX || 0), 2)
  ));
  const verticalSwipeLength = Math.round(Math.sqrt(
    Math.pow((_.touchObject.curY || 0) - (_.touchObject.startY || 0), 2)
  ));
  if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
    _.scrolling = true;
    return;
  }
  if (_.options.verticalSwiping === true) {
    _.touchObject.swipeLength = verticalSwipeLength;
  }
  const swipeDirection2 = _.swipeDirection();
  if (originalEvent !== void 0 && (_.touchObject.swipeLength || 0) > 4) {
    _.swiping = true;
    event.preventDefault();
  }
  const positionOffset = (_.options.rtl === false ? 1 : -1) * ((_.touchObject.curX || 0) > (_.touchObject.startX || 0) ? 1 : -1);
  if (_.options.verticalSwiping === true) {
    const vPosOffset = (_.touchObject.curY || 0) > (_.touchObject.startY || 0) ? 1 : -1;
    const swipeLength = _.touchObject.swipeLength || 0;
    _.touchObject.edgeHit = false;
    if (_.options.infinite === false) {
      if (_.currentSlide === 0 && swipeDirection2 === "right" || _.currentSlide >= _.getDotCount() && swipeDirection2 === "left") {
        const adjustedLength = swipeLength * _.options.edgeFriction;
        _.touchObject.swipeLength = adjustedLength;
        _.touchObject.edgeHit = true;
      }
    }
    _.swipeLeft = curLeft + swipeLength * vPosOffset;
  } else {
    const swipeLength = _.touchObject.swipeLength || 0;
    _.touchObject.edgeHit = false;
    if (_.options.infinite === false) {
      if (_.currentSlide === 0 && swipeDirection2 === "right" || _.currentSlide >= _.getDotCount() && swipeDirection2 === "left") {
        const adjustedLength = swipeLength * _.options.edgeFriction;
        _.touchObject.swipeLength = adjustedLength;
        _.touchObject.edgeHit = true;
      }
    }
    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft = curLeft + swipeLength * (_.$list.offsetHeight / _.listWidth) * positionOffset;
    }
  }
  if (_.options.verticalSwiping === true) {
    _.swipeLeft = curLeft + (_.touchObject.swipeLength || 0) * positionOffset;
  }
  if (_.options.fade === true || _.options.touchMove === false) {
    return;
  }
  if (_.animating === true) {
    _.swipeLeft = null;
    return;
  }
  _.setCSS(_.swipeLeft);
}
function swipeEnd(_event) {
  const _ = this;
  _.dragging = false;
  _.swiping = false;
  if (_.scrolling) {
    _.scrolling = false;
    return;
  }
  _.interrupted = false;
  _.shouldClick = (_.touchObject.swipeLength || 0) > 10 ? false : true;
  if (_.touchObject.curX === void 0) {
    return;
  }
  if (_.touchObject.edgeHit === true) {
    EventManager.trigger(_.$slider, "edge", [_, _.swipeDirection()]);
  }
  if ((_.touchObject.swipeLength || 0) >= (_.touchObject.minSwipe || 0)) {
    const direction = _.swipeDirection();
    let slideCount;
    switch (direction) {
      case "left":
      case "down":
        slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
        _.currentDirection = 0;
        break;
      case "right":
      case "up":
        slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
        _.currentDirection = 1;
        break;
      default:
        slideCount = _.currentSlide;
    }
    if (direction !== "vertical") {
      _.slideHandler(slideCount);
      _.touchObject = {};
      EventManager.trigger(_.$slider, "swipe", [_, direction]);
    }
  } else {
    if ((_.touchObject.startX || 0) !== (_.touchObject.curX || 0)) {
      _.slideHandler(_.currentSlide);
      _.touchObject = {};
    }
  }
}
function swipeDirection() {
  const _ = this;
  const xDist = (_.touchObject.startX || 0) - (_.touchObject.curX || 0);
  const yDist = (_.touchObject.startY || 0) - (_.touchObject.curY || 0);
  const r = Math.atan2(yDist, xDist);
  let swipeAngle = Math.round(r * 180 / Math.PI);
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  if (swipeAngle <= 45 && swipeAngle >= 0) {
    return _.options.rtl === false ? "left" : "right";
  }
  if (swipeAngle <= 360 && swipeAngle >= 315) {
    return _.options.rtl === false ? "left" : "right";
  }
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return _.options.rtl === false ? "right" : "left";
  }
  if (_.options.verticalSwiping === true) {
    if (swipeAngle >= 35 && swipeAngle <= 135) {
      return "down";
    } else {
      return "up";
    }
  }
  return "vertical";
}
function getSlideCount() {
  const _ = this;
  const centerOffset = _.options.centerMode === true ? Math.floor(_.$list.offsetWidth / 2) : 0;
  const swipeTarget = (_.swipeLeft || 0) * -1 + centerOffset;
  if (_.options.swipeToSlide === true) {
    const slides = find(_.$slideTrack, ".slick-slide");
    let swipedSlide = null;
    for (const slide of slides) {
      const slideOuterWidth = outerWidth(slide);
      const slideOffset = slide.offsetLeft;
      const adjustedOffset = _.options.centerMode !== true ? slideOffset + slideOuterWidth / 2 : slideOffset;
      const slideRightBoundary = adjustedOffset + slideOuterWidth;
      if (swipeTarget < slideRightBoundary) {
        swipedSlide = slide;
        break;
      }
    }
    if (swipedSlide) {
      const slickIndex = parseInt(swipedSlide.getAttribute("data-slick-index") || "0");
      return Math.abs(slickIndex - _.currentSlide) || 1;
    }
    return _.options.slidesToScroll;
  } else {
    return _.options.slidesToScroll;
  }
}
function checkNavigable(index2) {
  const _ = this;
  const navigables = _.getNavigableIndexes();
  let prevNavigable = 0;
  if (index2 > navigables[navigables.length - 1]) {
    index2 = navigables[navigables.length - 1];
  } else {
    for (const n of navigables) {
      if (index2 < n) {
        index2 = prevNavigable;
        break;
      }
      prevNavigable = n;
    }
  }
  return index2;
}
function getNavigableIndexes() {
  const _ = this;
  let breakPoint = 0;
  let counter = 0;
  const indexes = [];
  let max;
  if (_.options.infinite === false) {
    max = _.slideCount;
  } else {
    breakPoint = _.options.slidesToScroll * -1;
    counter = _.options.slidesToScroll * -1;
    max = _.slideCount * 2;
  }
  while (breakPoint < max) {
    indexes.push(breakPoint);
    breakPoint = counter + _.options.slidesToScroll;
    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
  }
  return indexes;
}
function lazyLoad() {
  const _ = this;
  let rangeStart;
  let rangeEnd;
  function loadImages(imagesScope) {
    imagesScope.forEach((scope) => {
      const images = find(scope, "img[data-lazy]");
      images.forEach((image) => {
        const imageSource = image.getAttribute("data-lazy");
        const imageSrcSet = image.getAttribute("data-srcset");
        const imageSizes = image.getAttribute("data-sizes") || _.$slider.getAttribute("data-sizes");
        const imageToLoad = document.createElement("img");
        imageToLoad.onload = () => {
          setCSS$1(image, { opacity: "0" });
          setTimeout(() => {
            if (imageSrcSet) {
              image.setAttribute("srcset", imageSrcSet);
              if (imageSizes) {
                image.setAttribute("sizes", imageSizes);
              }
            }
            image.setAttribute("src", imageSource || "");
            setCSS$1(image, { opacity: "1" });
            setTimeout(() => {
              removeAttributes(image, "data-lazy", "data-srcset", "data-sizes");
              removeClass(image, "slick-loading");
            }, 200);
            EventManager.trigger(_.$slider, "lazyLoaded", [_, image, imageSource]);
          }, 100);
        };
        imageToLoad.onerror = () => {
          removeAttributes(image, "data-lazy");
          removeClass(image, "slick-loading");
          addClass(image, "slick-lazyload-error");
          EventManager.trigger(_.$slider, "lazyLoadError", [_, image, imageSource]);
        };
        imageToLoad.src = imageSource || "";
      });
    });
  }
  if (_.options.centerMode === true) {
    if (_.options.infinite === true) {
      rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
      rangeEnd = rangeStart + _.options.slidesToShow + 2;
    } else {
      rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
      rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
    }
  } else {
    rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
    rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
    if (_.options.fade === true) {
      if (rangeStart > 0) rangeStart--;
      if (rangeEnd <= _.slideCount) rangeEnd++;
    }
  }
  const allSlides = find(_.$slider, ".slick-slide");
  const loadRange = allSlides.slice(rangeStart, rangeEnd);
  if (_.options.lazyLoad === "anticipated") {
    let prevSlide = rangeStart - 1;
    let nextSlide = rangeEnd;
    for (let i = 0; i < _.options.slidesToScroll; i++) {
      if (prevSlide < 0) prevSlide = _.slideCount - 1;
      if (allSlides[prevSlide]) loadRange.push(allSlides[prevSlide]);
      if (allSlides[nextSlide]) loadRange.push(allSlides[nextSlide]);
      prevSlide--;
      nextSlide++;
    }
  }
  loadImages(loadRange);
  if (_.slideCount <= _.options.slidesToShow) {
    const cloneRange = find(_.$slider, ".slick-slide");
    loadImages(cloneRange);
  } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
    const clonedSlides = find(_.$slider, ".slick-cloned");
    const cloneRange = clonedSlides.slice(0, _.options.slidesToShow);
    loadImages(cloneRange);
  } else if (_.currentSlide === 0) {
    const clonedSlides = find(_.$slider, ".slick-cloned");
    const cloneRange = clonedSlides.slice(_.options.slidesToShow * -1);
    loadImages(cloneRange);
  }
}
function progressiveLazyLoad(tryCount = 1) {
  const _ = this;
  const imgsToLoad = find(_.$slider, "img[data-lazy]");
  if (imgsToLoad.length) {
    const image = imgsToLoad[0];
    const imageSource = image.getAttribute("data-lazy");
    const imageSrcSet = image.getAttribute("data-srcset");
    const imageSizes = image.getAttribute("data-sizes") || _.$slider.getAttribute("data-sizes");
    const imageToLoad = document.createElement("img");
    imageToLoad.onload = () => {
      if (imageSrcSet) {
        image.setAttribute("srcset", imageSrcSet);
        if (imageSizes) {
          image.setAttribute("sizes", imageSizes);
        }
      }
      image.setAttribute("src", imageSource || "");
      removeAttributes(image, "data-lazy", "data-srcset", "data-sizes");
      removeClass(image, "slick-loading");
      if (_.options.adaptiveHeight === true) {
        _.setPosition();
      }
      EventManager.trigger(_.$slider, "lazyLoaded", [_, image, imageSource]);
      _.progressiveLazyLoad();
    };
    imageToLoad.onerror = () => {
      if (tryCount < 3) {
        setTimeout(() => {
          _.progressiveLazyLoad(tryCount + 1);
        }, 500);
      } else {
        removeAttributes(image, "data-lazy");
        removeClass(image, "slick-loading");
        addClass(image, "slick-lazyload-error");
        EventManager.trigger(_.$slider, "lazyLoadError", [_, image, imageSource]);
        _.progressiveLazyLoad();
      }
    };
    imageToLoad.src = imageSource || "";
  } else {
    EventManager.trigger(_.$slider, "allImagesLoaded", [_]);
  }
}
function checkResponsive(initial, forceUpdate) {
  const _ = this;
  if (_.inResponsiveRefresh) {
    return;
  }
  const sliderWidth = _.$slider.offsetWidth;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  let respondToWidth;
  if (_.respondTo === "window") {
    respondToWidth = windowWidth;
  } else if (_.respondTo === "slider") {
    respondToWidth = sliderWidth;
  } else if (_.respondTo === "min") {
    respondToWidth = Math.min(windowWidth, sliderWidth);
  } else {
    respondToWidth = windowWidth;
  }
  if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
    let targetBreakpoint = null;
    for (const breakpoint of _.breakpoints) {
      if (_.originalSettings.mobileFirst === false) {
        if (respondToWidth < breakpoint) {
          targetBreakpoint = breakpoint;
        }
      } else {
        if (respondToWidth > breakpoint) {
          targetBreakpoint = breakpoint;
        }
      }
    }
    if (targetBreakpoint !== null) {
      if (_.activeBreakpoint !== null) {
        if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
          _.activeBreakpoint = targetBreakpoint;
          const breakpointSettings = _.breakpointSettings[targetBreakpoint];
          if (breakpointSettings === "unslick") {
            _.unslick(targetBreakpoint);
          } else {
            _.options = {
              ..._.originalSettings,
              ...breakpointSettings
            };
            if (initial === true) {
              _.currentSlide = _.options.initialSlide;
            }
            if (initial === true) {
              _.inResponsiveRefresh = true;
              _.refresh(initial);
              _.inResponsiveRefresh = false;
            } else {
              _.inResponsiveRefresh = true;
              _.unload();
              _.reinit();
              _.inResponsiveRefresh = false;
            }
          }
          EventManager.trigger(_.$slider, "breakpoint", [_, targetBreakpoint]);
        }
      } else {
        _.activeBreakpoint = targetBreakpoint;
        const breakpointSettings = _.breakpointSettings[targetBreakpoint];
        if (breakpointSettings === "unslick") {
          _.unslick(targetBreakpoint);
        } else {
          _.options = {
            ..._.originalSettings,
            ...breakpointSettings
          };
          if (initial === true) {
            _.currentSlide = _.options.initialSlide;
          }
          if (initial === true) {
            _.inResponsiveRefresh = true;
            _.refresh(initial);
            _.inResponsiveRefresh = false;
          } else {
            _.inResponsiveRefresh = true;
            _.unload();
            _.reinit();
            _.inResponsiveRefresh = false;
          }
        }
        EventManager.trigger(_.$slider, "breakpoint", [_, targetBreakpoint]);
      }
    } else {
      if (_.activeBreakpoint !== null) {
        _.activeBreakpoint = null;
        _.options = _.originalSettings;
        if (initial === true) {
          _.currentSlide = _.options.initialSlide;
        }
        if (initial === true) {
          _.inResponsiveRefresh = true;
          _.refresh(initial);
          _.inResponsiveRefresh = false;
        } else {
          _.inResponsiveRefresh = true;
          _.unload();
          _.reinit();
          _.inResponsiveRefresh = false;
        }
        EventManager.trigger(_.$slider, "breakpoint", [_, targetBreakpoint]);
      }
    }
  }
}
function initADA() {
  const _ = this;
  const numDotGroups = Math.ceil(_.slideCount / _.options.slidesToScroll);
  const tabControlIndexes = _.getNavigableIndexes().filter((val) => {
    return val >= 0 && val < _.slideCount;
  });
  const allSlides = [..._.$slides, ...find(_.$slideTrack, ".slick-cloned")];
  allSlides.forEach((slide) => {
    setAttributes(slide, {
      "aria-hidden": "true",
      "tabindex": "-1"
    });
    const interactiveElements = find(slide, "a, input, button, select");
    interactiveElements.forEach((el) => {
      setAttributes(el, { "tabindex": "-1" });
    });
  });
  if (_.$dots !== null) {
    const nonClonedSlides = _.$slides.filter((slide) => !hasClass(slide, "slick-cloned"));
    nonClonedSlides.forEach((slide, i) => {
      const slideControlIndex = tabControlIndexes.indexOf(i);
      setAttributes(slide, {
        "role": "tabpanel",
        "id": `slick-slide${_.instanceUid}${i}`,
        "tabindex": "-1"
      });
      if (slideControlIndex !== -1) {
        const ariaButtonControl = `slick-slide-control${_.instanceUid}${slideControlIndex}`;
        const controlElement = document.getElementById(ariaButtonControl);
        if (controlElement) {
          setAttributes(slide, {
            "aria-describedby": ariaButtonControl
          });
        }
      }
    });
    setAttributes(_.$dots, { "role": "tablist" });
    const dotItems = find(_.$dots, "li");
    dotItems.forEach((li, i) => {
      const mappedSlideIndex = tabControlIndexes[i];
      setAttributes(li, { "role": "presentation" });
      const button = findOne(li, "button");
      if (button) {
        setAttributes(button, {
          "role": "tab",
          "id": `slick-slide-control${_.instanceUid}${i}`,
          "aria-controls": `slick-slide${_.instanceUid}${mappedSlideIndex}`,
          "aria-label": `${i + 1} / ${numDotGroups}`,
          "aria-selected": "null",
          "tabindex": "-1"
        });
      }
    });
    const currentDotButton = dotItems[_.currentSlide] && findOne(dotItems[_.currentSlide], "button");
    if (currentDotButton) {
      setAttributes(currentDotButton, {
        "aria-selected": "true",
        "tabindex": "0"
      });
    }
  }
  for (let i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
    if (_.$slides[i]) {
      if (_.options.focusOnChange) {
        setAttributes(_.$slides[i], { "tabindex": "0" });
      } else {
        removeAttributes(_.$slides[i], "tabindex");
      }
    }
  }
  _.activateADA();
}
function activateADA() {
  const _ = this;
  const activeSlides = find(_.$slideTrack, ".slick-active");
  activeSlides.forEach((slide) => {
    setAttributes(slide, {
      "aria-hidden": "false",
      "tabindex": "0"
    });
    const interactiveElements = find(slide, "a, input, button, select");
    interactiveElements.forEach((el) => {
      setAttributes(el, { "tabindex": "0" });
    });
  });
}
function focusHandler() {
  const _ = this;
  EventManager.off(_.$slider, "focusin.slick focusout.slick");
  EventManager.on(_.$slider, "focusin.slick", (event) => {
    setTimeout(() => {
      const target = event.target;
      if (_.options.pauseOnFocus && target.matches(":focus")) {
        _.focussed = true;
        _.autoPlay();
      }
    }, 0);
  });
  EventManager.on(_.$slider, "focusout.slick", () => {
    if (_.options.pauseOnFocus) {
      _.focussed = false;
      _.autoPlay();
    }
  });
}
function slickAdd(markup, index2, addBefore) {
  const _ = this;
  if (typeof index2 === "boolean") {
    addBefore = index2;
    index2 = void 0;
  } else if (typeof index2 === "number" && (index2 < 0 || index2 >= _.slideCount)) {
    return;
  }
  _.unload();
  let newSlide;
  if (typeof markup === "string") {
    newSlide = createElementFromHTML(markup);
  } else {
    newSlide = markup;
  }
  if (typeof index2 === "number") {
    if (index2 === 0 && _.$slides.length === 0) {
      append(_.$slideTrack, newSlide);
    } else if (addBefore) {
      insertBefore(newSlide, _.$slides[index2]);
    } else {
      insertAfter(newSlide, _.$slides[index2]);
    }
  } else {
    if (addBefore === true) {
      prepend(_.$slideTrack, newSlide);
    } else {
      append(_.$slideTrack, newSlide);
    }
  }
  const slideSelector = _.options.slide || ":scope > *";
  _.$slides = find(_.$slideTrack, slideSelector);
  _.$slides.forEach((slide) => detach(slide));
  _.$slides.forEach((slide) => append(_.$slideTrack, slide));
  _.$slides.forEach((slide, idx) => {
    setAttributes(slide, { "data-slick-index": String(idx) });
  });
  _.$slidesCache = _.$slides;
  _.reinit();
}
function slickRemove(index2, removeBefore, removeAll) {
  const _ = this;
  if (typeof index2 === "boolean") {
    removeBefore = index2;
    index2 = removeBefore === true ? 0 : _.slideCount - 1;
  } else {
    index2 = removeBefore === true ? --index2 : index2;
  }
  if (_.slideCount < 1 || index2 < 0 || index2 > _.slideCount - 1) {
    return false;
  }
  _.unload();
  if (removeAll === true) {
    _.$slides.forEach((slide) => remove(slide));
  } else {
    const slideSelector2 = _.options.slide || ":scope > *";
    const slides = find(_.$slideTrack, slideSelector2);
    if (slides[index2]) {
      remove(slides[index2]);
    }
  }
  const slideSelector = _.options.slide || ":scope > *";
  _.$slides = find(_.$slideTrack, slideSelector);
  _.$slides.forEach((slide) => detach(slide));
  _.$slides.forEach((slide) => append(_.$slideTrack, slide));
  _.$slidesCache = _.$slides;
  _.reinit();
}
function slickFilter(filter) {
  const _ = this;
  if (filter !== null) {
    _.$slidesCache = _.$slides;
    _.unload();
    const slideSelector = _.options.slide || ":scope > *";
    const slides = find(_.$slideTrack, slideSelector);
    slides.forEach((slide) => detach(slide));
    let filteredSlides;
    if (typeof filter === "string") {
      filteredSlides = _.$slidesCache.filter((slide) => slide.matches(filter));
    } else {
      filteredSlides = _.$slidesCache.filter((slide, index2) => filter(index2, slide));
    }
    filteredSlides.forEach((slide) => append(_.$slideTrack, slide));
    _.reinit();
  }
}
function slickUnfilter() {
  const _ = this;
  if (_.$slidesCache !== null) {
    _.unload();
    const slideSelector = _.options.slide || ":scope > *";
    const slides = find(_.$slideTrack, slideSelector);
    slides.forEach((slide) => detach(slide));
    _.$slidesCache.forEach((slide) => append(_.$slideTrack, slide));
    _.reinit();
  }
}
function slickSetOption(option, value, refresh2 = false) {
  const _ = this;
  let type = null;
  if (typeof option === "object" && option !== null) {
    type = "multiple";
  } else if (typeof option === "string") {
    if (option === "responsive" && Array.isArray(value)) {
      type = "responsive";
    } else if (value !== void 0) {
      type = "single";
    }
  }
  if (type === "single") {
    _.options[option] = value;
  } else if (type === "multiple") {
    Object.entries(option).forEach(([opt, val]) => {
      _.options[opt] = val;
    });
  } else if (type === "responsive") {
    for (const item of value) {
      if (!Array.isArray(_.options.responsive)) {
        _.options.responsive = [item];
      } else {
        let l = _.options.responsive.length - 1;
        while (l >= 0) {
          if (_.options.responsive[l].breakpoint === item.breakpoint) {
            _.options.responsive.splice(l, 1);
          }
          l--;
        }
        _.options.responsive.push(item);
      }
    }
  }
  if (refresh2) {
    _.unload();
    _.reinit();
  }
}
function unload() {
  const _ = this;
  const clonedSlides = find(_.$slider, ".slick-cloned");
  clonedSlides.forEach((slide) => remove(slide));
  if (_.$dots) {
    remove(_.$dots);
  }
  if (_.$prevArrow && isHTML(String(_.options.prevArrow))) {
    remove(_.$prevArrow);
  }
  if (_.$nextArrow && isHTML(String(_.options.nextArrow))) {
    remove(_.$nextArrow);
  }
  _.$slides.forEach((slide) => {
    removeClass(slide, "slick-slide", "slick-active", "slick-visible", "slick-current");
    setAttributes(slide, { "aria-hidden": "true" });
    setCSS$1(slide, { width: "" });
  });
}
function destroy(refresh2) {
  const _ = this;
  _.autoPlayClear();
  _.touchObject = {};
  _.cleanUpEvents();
  const clonedSlides = find(_.$slider, ".slick-cloned");
  clonedSlides.forEach((slide) => remove(slide));
  if (_.$dots) {
    remove(_.$dots);
  }
  if (_.$prevArrow && _.$prevArrow.parentNode) {
    removeClass(_.$prevArrow, "slick-disabled", "slick-arrow", "slick-hidden");
    removeAttributes(_.$prevArrow, "aria-hidden", "aria-disabled", "tabindex");
    setCSS$1(_.$prevArrow, { display: "" });
    if (isHTML(String(_.options.prevArrow))) {
      remove(_.$prevArrow);
    }
  }
  if (_.$nextArrow && _.$nextArrow.parentNode) {
    removeClass(_.$nextArrow, "slick-disabled", "slick-arrow", "slick-hidden");
    removeAttributes(_.$nextArrow, "aria-hidden", "aria-disabled", "tabindex");
    setCSS$1(_.$nextArrow, { display: "" });
    if (isHTML(String(_.options.nextArrow))) {
      remove(_.$nextArrow);
    }
  }
  if (_.$slides) {
    _.$slides.forEach((slide) => {
      removeClass(slide, "slick-slide", "slick-active", "slick-center", "slick-visible", "slick-current");
      removeAttributes(slide, "aria-hidden", "data-slick-index");
      const originalStyling = getData(slide, "originalStyling");
      if (originalStyling) {
        slide.setAttribute("style", originalStyling);
      } else {
        slide.removeAttribute("style");
      }
    });
    const slideSelector = _.options.slide || ":scope > *";
    const slides = find(_.$slideTrack, slideSelector);
    slides.forEach((slide) => detach(slide));
    if (_.$slideTrack) detach(_.$slideTrack);
    if (_.$list) detach(_.$list);
    _.$slides.forEach((slide) => append(_.$slider, slide));
  }
  _.cleanUpRows();
  removeClass(_.$slider, "slick-slider", "slick-initialized", "slick-dotted");
  _.unslicked = true;
  if (!refresh2) {
    EventManager.trigger(_.$slider, "destroy", [_]);
  }
}
function cleanUpRows() {
  const _ = this;
  if (!(_.options.rows > 1 || _.options.slidesPerRow > 1)) {
    return;
  }
  if (_.options.rows > 0) {
    const originalSlides = find(_.$slider, "div > div > div");
    originalSlides.forEach((slide) => {
      slide.removeAttribute("style");
    });
    empty(_.$slider);
    originalSlides.forEach((slide) => append(_.$slider, slide));
  }
}
function cleanUpEvents() {
  const _ = this;
  if (_.options.dots && _.$dots !== null) {
    EventManager.off(_.$dots, "click.slick");
    EventManager.off(_.$dots, "mouseenter.slick");
    EventManager.off(_.$dots, "mouseleave.slick");
    if (_.options.accessibility === true) {
      EventManager.off(_.$dots, "keydown.slick");
    }
  }
  EventManager.off(_.$slider, "focusin.slick focusout.slick");
  if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
    if (_.$prevArrow) {
      EventManager.off(_.$prevArrow, "click.slick");
      if (_.options.accessibility === true) {
        EventManager.off(_.$prevArrow, "keydown.slick");
      }
    }
    if (_.$nextArrow) {
      EventManager.off(_.$nextArrow, "click.slick");
      if (_.options.accessibility === true) {
        EventManager.off(_.$nextArrow, "keydown.slick");
      }
    }
  }
  if (_.$list) {
    EventManager.off(_.$list, "touchstart.slick mousedown.slick");
    EventManager.off(_.$list, "touchmove.slick mousemove.slick");
    EventManager.off(_.$list, "touchend.slick mouseup.slick");
    EventManager.off(_.$list, "touchcancel.slick mouseleave.slick");
    EventManager.off(_.$list, "click.slick");
    EventManager.off(_.$list, "mouseenter.slick");
    EventManager.off(_.$list, "mouseleave.slick");
    if (_.options.accessibility === true) {
      EventManager.off(_.$list, "keydown.slick");
    }
  }
  if (_.options.focusOnSelect === true) {
    const trackChildren = children(_.$slideTrack);
    trackChildren.forEach((child) => {
      EventManager.off(child, "click.slick");
    });
  }
  EventManager.off(document, _.visibilityChange);
  EventManager.off(window, `orientationchange.slick.slick-${_.instanceUid}`);
  EventManager.off(window, `resize.slick.slick-${_.instanceUid}`);
  EventManager.off(window, `load.slick.slick-${_.instanceUid}`);
  const draggableElements = find(_.$slideTrack, ':not([draggable="true"])');
  draggableElements.forEach((el) => {
    el.removeEventListener("dragstart", _.preventDefault);
  });
}
function reinit() {
  const _ = this;
  const slideSelector = _.options.slide || ":scope > *";
  _.$slides = find(_.$slideTrack, slideSelector);
  _.$slides.forEach((slide) => addClass(slide, "slick-slide"));
  _.slideCount = _.$slides.length;
  if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
    _.currentSlide = _.currentSlide - _.options.slidesToScroll;
  }
  if (_.slideCount <= _.options.slidesToShow) {
    _.currentSlide = 0;
  }
  _.registerBreakpoints();
  _.setProps();
  _.setupInfinite();
  _.buildArrows();
  _.updateArrows();
  _.initArrowEvents();
  _.buildDots();
  _.updateDots();
  _.initDotEvents();
  _.cleanUpSlideEvents();
  _.initSlideEvents();
  _.checkResponsive(false, true);
  if (_.options.focusOnSelect === true) {
    const trackChildren = children(_.$slideTrack);
    trackChildren.forEach((child) => {
      EventManager.on(child, "click.slick", _.boundSelectHandler);
    });
  }
  _.setSlideClasses(typeof _.currentSlide === "number" ? _.currentSlide : 0);
  _.setPosition();
  _.focusHandler();
  _.paused = !_.options.autoplay;
  _.autoPlay();
  EventManager.trigger(_.$slider, "reInit", [_]);
}
function cleanUpSlideEvents() {
  const _ = this;
  if (_.$list) {
    EventManager.off(_.$list, "mouseenter.slick");
    EventManager.off(_.$list, "mouseleave.slick");
  }
}
function initSlideEvents() {
  const _ = this;
  if (_.options.pauseOnHover && _.$list) {
    EventManager.on(_.$list, "mouseenter.slick", () => {
      _.interrupt(true);
    });
    EventManager.on(_.$list, "mouseleave.slick", () => {
      _.interrupt(false);
    });
  }
}
function refresh(initializing) {
  const _ = this;
  const lastVisibleIndex = _.slideCount - _.options.slidesToShow;
  if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
    _.currentSlide = lastVisibleIndex;
  }
  if (_.slideCount <= _.options.slidesToShow) {
    _.currentSlide = 0;
  }
  const currentSlide = _.currentSlide;
  _.destroy(true);
  Object.assign(_, { currentSlide });
  _.init();
  if (!initializing) {
    _.changeSlide({
      data: {
        message: "index",
        index: currentSlide
      }
    }, false);
  }
}
function preventDefault(event) {
  event.preventDefault();
}
let instanceUid = 0;
class Slick {
  constructor(element, settings) {
    this.animating = false;
    this.dragging = false;
    this.autoPlayTimer = null;
    this.currentDirection = 0;
    this.currentLeft = null;
    this.currentSlide = 0;
    this.direction = 1;
    this.$dots = null;
    this.listWidth = null;
    this.listHeight = null;
    this.loadIndex = 0;
    this.$nextArrow = null;
    this.$prevArrow = null;
    this.scrolling = false;
    this.slideCount = null;
    this.slideWidth = null;
    this.$slideTrack = null;
    this.$slides = [];
    this.sliding = false;
    this.slideOffset = 0;
    this.swipeLeft = null;
    this.swiping = false;
    this.$list = null;
    this.touchObject = {};
    this.transformsEnabled = false;
    this.unslicked = false;
    this.activeBreakpoint = null;
    this.animType = null;
    this.animProp = null;
    this.breakpoints = [];
    this.breakpointSettings = {};
    this.cssTransitions = false;
    this.focussed = false;
    this.interrupted = false;
    this.hidden = "hidden";
    this.paused = true;
    this.positionProp = null;
    this.respondTo = null;
    this.rowCount = 1;
    this.shouldClick = true;
    this.$slidesCache = null;
    this.transformType = null;
    this.transitionType = null;
    this.visibilityChange = "visibilitychange";
    this.windowWidth = 0;
    this.windowTimer = null;
    this.instanceUid = 0;
    this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
    this.isInitializing = false;
    this.inResponsiveRefresh = false;
    this.init = function(creation) {
      this.isInitializing = true;
      this.unslicked = false;
      this.animating = false;
      if (!hasClass(this.$slider, "slick-initialized")) {
        addClass(this.$slider, "slick-initialized");
        this.buildRows();
        this.buildOut();
        this.setProps();
        this.startLoad();
        this.loadSlider();
        this.initializeEvents();
        this.updateArrows();
        this.updateDots();
        this.checkResponsive(true);
        this.focusHandler();
      }
      if (creation) {
        EventManager.trigger(this.$slider, "init", [this]);
      }
      if (this.options.accessibility === true) {
        this.initADA();
      }
      if (this.options.autoplay) {
        this.paused = false;
        this.autoPlay();
      }
      this.isInitializing = false;
    };
    this.buildRows = function() {
      if (!(this.options.rows > 1 || this.options.slidesPerRow > 1)) {
        return;
      }
      if (this.options.rows > 0) {
        const slidesPerSection = this.options.slidesPerRow * this.options.rows;
        const originalSlides = children(this.$slider);
        const numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);
        const newSlides = document.createDocumentFragment();
        for (let a = 0; a < numOfSlides; a++) {
          const slide = document.createElement("div");
          for (let b = 0; b < this.options.rows; b++) {
            const row = document.createElement("div");
            for (let c = 0; c < this.options.slidesPerRow; c++) {
              const target = a * slidesPerSection + (b * this.options.slidesPerRow + c);
              if (originalSlides[target]) {
                row.appendChild(originalSlides[target]);
              }
            }
            slide.appendChild(row);
          }
          newSlides.appendChild(slide);
        }
        empty(this.$slider);
        this.$slider.appendChild(newSlides);
        const rowChildren = find(this.$slider, "div > div > div");
        rowChildren.forEach((child) => {
          setCSS$1(child, {
            width: 100 / this.options.slidesPerRow + "%",
            display: "inline-block"
          });
        });
      }
    };
    this.buildOut = function() {
      const slideSelector = this.options.slide ? `${this.options.slide}:not(.slick-cloned)` : ":scope > :not(.slick-cloned)";
      this.$slides = find(this.$slider, slideSelector);
      this.$slides.forEach((slide) => addClass(slide, "slick-slide"));
      this.slideCount = this.$slides.length;
      this.$slides.forEach((slide, index2) => {
        setAttributes(slide, { "data-slick-index": String(index2) });
        setData(slide, "originalStyling", slide.getAttribute("style") || "");
      });
      addClass(this.$slider, "slick-slider");
      if (this.slideCount === 0) {
        this.$slideTrack = document.createElement("div");
        addClass(this.$slideTrack, "slick-track");
        this.$slider.appendChild(this.$slideTrack);
      } else {
        this.$slideTrack = wrapAll(this.$slides, '<div class="slick-track"></div>');
      }
      this.$list = wrap(this.$slideTrack, '<div class="slick-list"></div>');
      setCSS$1(this.$slideTrack, { opacity: "0" });
      if (this.options.centerMode === true || this.options.swipeToSlide === true) {
        this.options.slidesToScroll = 1;
      }
      const lazyImages = find(this.$slider, "img[data-lazy]");
      lazyImages.forEach((img) => {
        if (!img.getAttribute("src")) addClass(img, "slick-loading");
      });
      this.setupInfinite();
      this.buildArrows();
      this.buildDots();
      this.updateDots();
      this.setSlideClasses(typeof this.currentSlide === "number" ? this.currentSlide : 0);
      if (this.options.draggable === true) {
        addClass(this.$list, "draggable");
      }
    };
    this.setProps = function() {
      this.positionProp = this.options.vertical === true ? "top" : "left";
      if (this.positionProp === "top") {
        addClass(this.$slider, "slick-vertical");
      } else {
        removeClass(this.$slider, "slick-vertical");
      }
      const transformSupport = detectTransformSupport();
      if (transformSupport.transition && this.options.useCSS === true) {
        this.cssTransitions = true;
      }
      if (this.options.fade) {
        if (typeof this.options.zIndex === "number" && this.options.zIndex < 3) {
          this.options.zIndex = 3;
        } else if (typeof this.options.zIndex !== "number") {
          this.options.zIndex = this.defaults.zIndex;
        }
      }
      this.animType = transformSupport.animType;
      this.transformType = transformSupport.transformType;
      this.transitionType = transformSupport.transitionType;
      this.transformsEnabled = this.options.useTransform && this.animType !== null && this.animType !== "";
    };
    this.registerBreakpoints = function() {
      const responsiveSettings = this.options.responsive || null;
      if (Array.isArray(responsiveSettings) && responsiveSettings.length) {
        this.respondTo = this.options.respondTo || "window";
        for (const responsive of responsiveSettings) {
          if (responsive.breakpoint) {
            let l = this.breakpoints.length - 1;
            while (l >= 0) {
              if (this.breakpoints[l] === responsive.breakpoint) {
                this.breakpoints.splice(l, 1);
              }
              l--;
            }
            this.breakpoints.push(responsive.breakpoint);
            this.breakpointSettings[responsive.breakpoint] = responsive.settings;
          }
        }
        this.breakpoints.sort((a, b) => this.options.mobileFirst ? a - b : b - a);
      }
    };
    this.setupInfinite = setupInfinite;
    this.setSlideClasses = setSlideClasses;
    this.startLoad = startLoad;
    this.loadSlider = loadSlider;
    this.initUI = initUI;
    this.setDimensions = setDimensions;
    this.setHeight = setHeight;
    this.setPosition = setPosition;
    this.resize = resize;
    this.autoPlay = autoPlay;
    this.autoPlayClear = function() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
      }
    };
    this.autoPlayIterator = autoPlayIterator;
    this.lazyLoad = lazyLoad;
    this.progressiveLazyLoad = progressiveLazyLoad;
    this.getLeft = getLeft;
    this.slideHandler = slideHandler;
    this.postSlide = postSlide;
    this.changeSlide = changeSlide;
    this.selectHandler = selectHandler;
    this.getNavTarget = getNavTarget;
    this.asNavFor = asNavFor;
    this.initializeEvents = initializeEvents;
    this.animateSlide = animateSlide;
    this.animateHeight = animateHeight;
    this.applyTransition = applyTransition;
    this.disableTransition = disableTransition;
    this.fadeSlide = fadeSlide;
    this.fadeSlideOut = fadeSlideOut;
    this.setCSS = setCSS;
    this.setFade = setFade;
    this.buildArrows = buildArrows;
    this.updateArrows = updateArrows;
    this.initArrowEvents = initArrowEvents;
    this.buildDots = buildDots;
    this.updateDots = updateDots;
    this.getDotCount = getDotCount;
    this.initDotEvents = initDotEvents;
    this.interrupt = interrupt;
    this.keyHandler = keyHandler;
    this.swipeHandler = swipeHandler;
    this.swipeStart = swipeStart;
    this.swipeMove = swipeMove;
    this.swipeEnd = swipeEnd;
    this.swipeDirection = swipeDirection;
    this.getSlideCount = getSlideCount;
    this.checkNavigable = checkNavigable;
    this.getNavigableIndexes = getNavigableIndexes;
    this.dragHandler = function(_event) {
    };
    this.checkResponsive = checkResponsive;
    this.initADA = initADA;
    this.activateADA = activateADA;
    this.focusHandler = focusHandler;
    this.slickAdd = slickAdd;
    this.addSlide = slickAdd;
    this.slickRemove = slickRemove;
    this.removeSlide = slickRemove;
    this.slickFilter = slickFilter;
    this.filterSlides = slickFilter;
    this.slickUnfilter = slickUnfilter;
    this.unfilterSlides = slickUnfilter;
    this.slickSetOption = slickSetOption;
    this.setOption = slickSetOption;
    this.unload = unload;
    this.destroy = destroy;
    this.cleanUpRows = cleanUpRows;
    this.cleanUpEvents = cleanUpEvents;
    this.reinit = reinit;
    this.cleanUpSlideEvents = cleanUpSlideEvents;
    this.initSlideEvents = initSlideEvents;
    this.refresh = refresh;
    this.goTo = this.slickGoTo;
    this.next = this.slickNext;
    this.prev = this.slickPrev;
    this.pause = this.slickPause;
    this.play = this.slickPlay;
    this.getCurrent = this.slickCurrentSlide;
    this.getOption = this.slickGetOption;
    this.defaults = { ...defaultOptions };
    Object.assign(this, initialState);
    this.$slider = element;
    this.$slidesCache = null;
    this.instanceUid = instanceUid++;
    this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
    const dataSettings = getData(element, "slicker") || getData(element, "slick") || {};
    this.options = { ...this.defaults, ...settings, ...dataSettings };
    if (this.options.appendArrows == null) {
      this.options.appendArrows = this.$slider;
    }
    if (this.options.appendDots == null) {
      this.options.appendDots = this.$slider;
    }
    this.currentSlide = this.options.initialSlide;
    this.originalSettings = { ...this.options };
    this.boundAutoPlay = this.autoPlay.bind(this);
    this.boundAutoPlayClear = this.autoPlayClear.bind(this);
    this.boundAutoPlayIterator = this.autoPlayIterator.bind(this);
    this.boundChangeSlide = this.changeSlide.bind(this);
    this.boundClickHandler = this.clickHandler.bind(this);
    this.boundSelectHandler = this.selectHandler.bind(this);
    this.boundSetPosition = this.setPosition.bind(this);
    this.boundSwipeHandler = this.swipeHandler.bind(this);
    this.boundDragHandler = this.dragHandler.bind(this);
    this.boundKeyHandler = this.keyHandler.bind(this);
    this.boundResize = this.resize.bind(this);
    this.boundOrientationChange = this.orientationChange.bind(this);
    this.boundVisibility = this.visibility.bind(this);
    this.preventDefault = preventDefault.bind(this);
    this.registerBreakpoints();
    this.init(true);
  }
  // Simple getters
  slickGoTo(slide, dontAnimate) {
    this.changeSlide({ data: { message: "index", index: parseInt(String(slide)) } }, dontAnimate);
  }
  slickNext() {
    this.changeSlide({ data: { message: "next" } });
  }
  slickPrev() {
    this.changeSlide({ data: { message: "previous" } });
  }
  slickPause() {
    this.autoPlayClear();
    this.paused = true;
  }
  slickPlay() {
    this.autoPlay();
    this.options.autoplay = true;
    this.paused = false;
    this.focussed = false;
    this.interrupted = false;
  }
  slickCurrentSlide() {
    return this.currentSlide;
  }
  slickGetOption(option) {
    return this.options[option];
  }
  getSlick() {
    return this;
  }
  unslick(fromBreakpoint) {
    EventManager.trigger(this.$slider, "unslick", [this, fromBreakpoint]);
    this.destroy();
  }
  clickHandler(event) {
    if (this.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }
  orientationChange() {
    this.checkResponsive();
    this.setPosition();
  }
  visibility() {
    if (this.options.autoplay) {
      const doc = document;
      this.interrupted = doc[this.hidden] === true;
    }
  }
}
function init(selector, options) {
  const elements = typeof selector === "string" ? getElements(selector) : [selector];
  const instances = elements.map((element) => {
    const instance = new Slick(element, options);
    element.slicker = instance;
    element.slick = element.slick || instance;
    return instance;
  });
  return instances.length === 1 ? instances[0] : instances;
}
const Slicker = Object.assign(Slick, { init });
if (typeof window !== "undefined") {
  window.Slicker = Slicker;
  window.Slick = window.Slick || Slicker;
}
export {
  Slicker as Slick,
  Slick as SlickCore,
  Slicker,
  Slicker as default
};
//# sourceMappingURL=slicker.esm.js.map
