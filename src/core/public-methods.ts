/**
 * Public API Methods
 * All public-facing methods for the Slick carousel
 */

import type { Slick } from './SlickComplete';
import type { SlickOptions } from '../types';
import * as DOM from '../utils/dom';
import { EventManager } from '../modules/events';

/**
 * Add slide
 */
export function slickAdd(
  this: Slick, 
  markup: string | HTMLElement, 
  index?: number | boolean, 
  addBefore?: boolean
): void {
  const _ = this;
  
  if (typeof index === 'boolean') {
    addBefore = index;
    index = undefined;
  } else if (typeof index === 'number' && (index < 0 || index >= _.slideCount!)) {
    return;
  }
  
  _.unload();
  
  let newSlide: HTMLElement;
  if (typeof markup === 'string') {
    newSlide = DOM.createElementFromHTML(markup);
  } else {
    newSlide = markup;
  }
  
  if (typeof index === 'number') {
    if (index === 0 && _.$slides.length === 0) {
      DOM.append(_.$slideTrack!, newSlide);
    } else if (addBefore) {
      DOM.insertBefore(newSlide, _.$slides[index]);
    } else {
      DOM.insertAfter(newSlide, _.$slides[index]);
    }
  } else {
    if (addBefore === true) {
      DOM.prepend(_.$slideTrack!, newSlide);
    } else {
      DOM.append(_.$slideTrack!, newSlide);
    }
  }
  
  const slideSelector = _.options.slide || ':scope > *';
  _.$slides = DOM.find(_.$slideTrack!, slideSelector);
  
  // Detach and reappend to reset order
  _.$slides.forEach(slide => DOM.detach(slide));
  _.$slides.forEach(slide => DOM.append(_.$slideTrack!, slide));
  
  // Reset data attributes
  _.$slides.forEach((slide, idx) => {
    DOM.setAttributes(slide, { 'data-slick-index': String(idx) });
  });
  
  _.$slidesCache = _.$slides;
  _.reinit();
}

/**
 * Remove slide
 */
export function slickRemove(
  this: Slick,
  index: number | boolean,
  removeBefore?: boolean,
  removeAll?: boolean
): boolean | void {
  const _ = this;
  
  if (typeof index === 'boolean') {
    removeBefore = index;
    index = removeBefore === true ? 0 : _.slideCount! - 1;
  } else {
    index = removeBefore === true ? --index : index;
  }
  
  if (_.slideCount! < 1 || index < 0 || index > _.slideCount! - 1) {
    return false;
  }
  
  _.unload();
  
  if (removeAll === true) {
    _.$slides.forEach(slide => DOM.remove(slide));
  } else {
    const slideSelector = _.options.slide || ':scope > *';
    const slides = DOM.find(_.$slideTrack!, slideSelector);
    if (slides[index]) {
      DOM.remove(slides[index]);
    }
  }
  
  const slideSelector = _.options.slide || ':scope > *';
  _.$slides = DOM.find(_.$slideTrack!, slideSelector);
  
  _.$slides.forEach(slide => DOM.detach(slide));
  _.$slides.forEach(slide => DOM.append(_.$slideTrack!, slide));
  
  _.$slidesCache = _.$slides;
  _.reinit();
}

/**
 * Filter slides
 */
export function slickFilter(
  this: Slick,
  filter: string | ((index: number, element: HTMLElement) => boolean)
): void {
  const _ = this;
  
  if (filter !== null) {
    _.$slidesCache = _.$slides;
    _.unload();
    
    const slideSelector = _.options.slide || ':scope > *';
    const slides = DOM.find(_.$slideTrack!, slideSelector);
    slides.forEach(slide => DOM.detach(slide));
    
    let filteredSlides: HTMLElement[];
    if (typeof filter === 'string') {
      filteredSlides = _.$slidesCache!.filter(slide => slide.matches(filter));
    } else {
      filteredSlides = _.$slidesCache!.filter((slide, index) => filter(index, slide));
    }
    
    filteredSlides.forEach(slide => DOM.append(_.$slideTrack!, slide));
    _.reinit();
  }
}

/**
 * Unfilter slides
 */
export function slickUnfilter(this: Slick): void {
  const _ = this;
  
  if (_.$slidesCache !== null) {
    _.unload();
    
    const slideSelector = _.options.slide || ':scope > *';
    const slides = DOM.find(_.$slideTrack!, slideSelector);
    slides.forEach(slide => DOM.detach(slide));
    
    _.$slidesCache.forEach(slide => DOM.append(_.$slideTrack!, slide));
    _.reinit();
  }
}

/**
 * Set option
 */
export function slickSetOption(
  this: Slick,
  option: string | Partial<SlickOptions>,
  value?: any,
  refresh = false
): void {
  const _ = this;
  
  let type: 'single' | 'multiple' | 'responsive' | null = null;
  
  if (typeof option === 'object' && option !== null) {
    type = 'multiple';
  } else if (typeof option === 'string') {
    if (option === 'responsive' && Array.isArray(value)) {
      type = 'responsive';
    } else if (value !== undefined) {
      type = 'single';
    }
  }
  
  if (type === 'single') {
    (_.options as any)[option as string] = value;
  } else if (type === 'multiple') {
    Object.entries(option as Partial<SlickOptions>).forEach(([opt, val]) => {
      (_.options as any)[opt] = val;
    });
  } else if (type === 'responsive') {
    for (const item of value) {
      if (!Array.isArray(_.options.responsive)) {
        _.options.responsive = [item];
      } else {
        let l = _.options.responsive.length - 1;
        
        // Remove duplicates
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
  
  if (refresh) {
    _.unload();
    _.reinit();
  }
}

/**
 * Unload slider
 */
export function unload(this: Slick): void {
  const _ = this;
  
  const clonedSlides = DOM.find(_.$slider, '.slick-cloned');
  clonedSlides.forEach(slide => DOM.remove(slide));
  
  if (_.$dots) {
    DOM.remove(_.$dots);
  }
  
  if (_.$prevArrow && DOM.isHTML(String(_.options.prevArrow))) {
    DOM.remove(_.$prevArrow);
  }
  
  if (_.$nextArrow && DOM.isHTML(String(_.options.nextArrow))) {
    DOM.remove(_.$nextArrow);
  }
  
  _.$slides.forEach(slide => {
    DOM.removeClass(slide, 'slick-slide', 'slick-active', 'slick-visible', 'slick-current');
    DOM.setAttributes(slide, { 'aria-hidden': 'true' });
    DOM.setCSS(slide, { width: '' });
  });
}

/**
 * Destroy slider
 */
export function destroy(this: Slick, refresh?: boolean): void {
  const _ = this;
  
  _.autoPlayClear();
  _.touchObject = {};
  _.cleanUpEvents();
  
  const clonedSlides = DOM.find(_.$slider, '.slick-cloned');
  clonedSlides.forEach(slide => DOM.remove(slide));
  
  if (_.$dots) {
    DOM.remove(_.$dots);
  }
  
  if (_.$prevArrow && _.$prevArrow.parentNode) {
    DOM.removeClass(_.$prevArrow, 'slick-disabled', 'slick-arrow', 'slick-hidden');
    DOM.removeAttributes(_.$prevArrow, 'aria-hidden', 'aria-disabled', 'tabindex');
    DOM.setCSS(_.$prevArrow, { display: '' });
    
    if (DOM.isHTML(String(_.options.prevArrow))) {
      DOM.remove(_.$prevArrow);
    }
  }
  
  if (_.$nextArrow && _.$nextArrow.parentNode) {
    DOM.removeClass(_.$nextArrow, 'slick-disabled', 'slick-arrow', 'slick-hidden');
    DOM.removeAttributes(_.$nextArrow, 'aria-hidden', 'aria-disabled', 'tabindex');
    DOM.setCSS(_.$nextArrow, { display: '' });
    
    if (DOM.isHTML(String(_.options.nextArrow))) {
      DOM.remove(_.$nextArrow);
    }
  }
  
  if (_.$slides) {
    _.$slides.forEach(slide => {
      DOM.removeClass(slide, 'slick-slide', 'slick-active', 'slick-center', 'slick-visible', 'slick-current');
      DOM.removeAttributes(slide, 'aria-hidden', 'data-slick-index');
      
      const originalStyling = DOM.getData(slide, 'originalStyling');
      if (originalStyling) {
        slide.setAttribute('style', originalStyling);
      } else {
        slide.removeAttribute('style');
      }
    });
    
    const slideSelector = _.options.slide || ':scope > *';
    const slides = DOM.find(_.$slideTrack!, slideSelector);
    slides.forEach(slide => DOM.detach(slide));
    
    if (_.$slideTrack) DOM.detach(_.$slideTrack);
    if (_.$list) DOM.detach(_.$list);
    
    _.$slides.forEach(slide => DOM.append(_.$slider, slide));
  }
  
  _.cleanUpRows();
  
  DOM.removeClass(_.$slider, 'slick-slider', 'slick-initialized', 'slick-dotted');
  _.unslicked = true;
  
  if (!refresh) {
    EventManager.trigger(_.$slider, 'destroy', [_]);
  }
}

/**
 * Clean up rows
 */
export function cleanUpRows(this: Slick): void {
  const _ = this;
  
  // Only unwrap if multi-row/grid markup was created.
  if (!(_.options.rows > 1 || _.options.slidesPerRow > 1)) {
    return;
  }

  if (_.options.rows > 0) {
    const originalSlides = DOM.find(_.$slider, 'div > div > div');
    originalSlides.forEach(slide => {
      slide.removeAttribute('style');
    });
    
    DOM.empty(_.$slider);
    originalSlides.forEach(slide => DOM.append(_.$slider, slide));
  }
}

/**
 * Clean up events
 */
export function cleanUpEvents(this: Slick): void {
  const _ = this;
  
  if (_.options.dots && _.$dots !== null) {
    EventManager.off(_.$dots, 'click.slick');
    EventManager.off(_.$dots, 'mouseenter.slick');
    EventManager.off(_.$dots, 'mouseleave.slick');
    
    if (_.options.accessibility === true) {
      EventManager.off(_.$dots, 'keydown.slick');
    }
  }
  
  EventManager.off(_.$slider, 'focusin.slick focusout.slick');
  
  if (_.options.arrows === true && _.slideCount! > _.options.slidesToShow) {
    if (_.$prevArrow) {
      EventManager.off(_.$prevArrow, 'click.slick');
      if (_.options.accessibility === true) {
        EventManager.off(_.$prevArrow, 'keydown.slick');
      }
    }
    
    if (_.$nextArrow) {
      EventManager.off(_.$nextArrow, 'click.slick');
      if (_.options.accessibility === true) {
        EventManager.off(_.$nextArrow, 'keydown.slick');
      }
    }
  }
  
  if (_.$list) {
    EventManager.off(_.$list, 'touchstart.slick mousedown.slick');
    EventManager.off(_.$list, 'touchmove.slick mousemove.slick');
    EventManager.off(_.$list, 'touchend.slick mouseup.slick');
    EventManager.off(_.$list, 'touchcancel.slick mouseleave.slick');
    EventManager.off(_.$list, 'click.slick');
    EventManager.off(_.$list, 'mouseenter.slick');
    EventManager.off(_.$list, 'mouseleave.slick');
    
    if (_.options.accessibility === true) {
      EventManager.off(_.$list, 'keydown.slick');
    }
  }
  
  if (_.options.focusOnSelect === true) {
    const trackChildren = DOM.children(_.$slideTrack!);
    trackChildren.forEach(child => {
      EventManager.off(child, 'click.slick');
    });
  }
  
  EventManager.off(document, _.visibilityChange);
  EventManager.off(window, `orientationchange.slick.slick-${_.instanceUid}`);
  EventManager.off(window, `resize.slick.slick-${_.instanceUid}`);
  EventManager.off(window, `load.slick.slick-${_.instanceUid}`);
  
  const draggableElements = DOM.find(_.$slideTrack!, ':not([draggable="true"])');
  draggableElements.forEach(el => {
    el.removeEventListener('dragstart', _.preventDefault);
  });
}

/**
 * Reinitialize slider
 */
export function reinit(this: Slick): void {
  const _ = this;
  
  const slideSelector = _.options.slide || ':scope > *';
  _.$slides = DOM.find(_.$slideTrack!, slideSelector);
  _.$slides.forEach(slide => DOM.addClass(slide, 'slick-slide'));
  
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
    const trackChildren = DOM.children(_.$slideTrack!);
    trackChildren.forEach(child => {
      EventManager.on(child, 'click.slick', _.boundSelectHandler);
    });
  }
  
  _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
  _.setPosition();
  _.focusHandler();
  
  _.paused = !_.options.autoplay;
  _.autoPlay();
  
  EventManager.trigger(_.$slider, 'reInit', [_]);
}

/**
 * Clean up slide events
 */
export function cleanUpSlideEvents(this: Slick): void {
  const _ = this;
  
  if (_.$list) {
    EventManager.off(_.$list, 'mouseenter.slick');
    EventManager.off(_.$list, 'mouseleave.slick');
  }
}

/**
 * Initialize slide events
 */
export function initSlideEvents(this: Slick): void {
  const _ = this;
  
  if (_.options.pauseOnHover && _.$list) {
    EventManager.on(_.$list, 'mouseenter.slick', () => {
      _.interrupt(true);
    });
    
    EventManager.on(_.$list, 'mouseleave.slick', () => {
      _.interrupt(false);
    });
  }
}

/**
 * Refresh slider
 */
export function refresh(this: Slick, initializing?: boolean): void {
  const _ = this;
  
  const lastVisibleIndex = _.slideCount! - _.options.slidesToShow;
  
  // In non-infinite sliders, don't go past the last visible index
  if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
    _.currentSlide = lastVisibleIndex;
  }
  
  // If less slides than to show, go to start
  if (_.slideCount! <= _.options.slidesToShow) {
    _.currentSlide = 0;
  }
  
  const currentSlide = _.currentSlide;
  _.destroy(true);
  
  Object.assign(_, { currentSlide });
  _.init();
  
  if (!initializing) {
    (_.changeSlide as any)({
      data: {
        message: 'index',
        index: currentSlide
      }
    }, false);
  }
}

/**
 * Prevent default
 */
export function preventDefault(event: Event): void {
  event.preventDefault();
}

