/**
 * Core Slick Methods
 * Main functionality methods for the Slick class
 */

import type { Slick } from './SlickComplete';
import * as DOM from '../utils/dom';
import { EventManager } from '../modules/events';

/**
 * Setup infinite scrolling (clone slides)
 */
export function setupInfinite(this: Slick): void {
  const _ = this;

  if (_.options.fade === true) {
    _.options.centerMode = false;
  }

  if (_.options.infinite === true && _.options.fade === false) {
    let slideIndex: number | null = null;

    if (_.slideCount! > _.options.slidesToShow) {
      const infiniteCount = _.options.centerMode === true ?
        _.options.slidesToShow + 1 :
        _.options.slidesToShow;

      // Clone slides at the end
      for (let i = _.slideCount!; i > (_.slideCount! - infiniteCount); i -= 1) {
        slideIndex = i - 1;
        const clonedSlide = DOM.clone(_.$slides[slideIndex], true);
        DOM.removeAttributes(clonedSlide, 'id');
        DOM.setAttributes(clonedSlide, {
          'data-slick-index': String(slideIndex - _.slideCount!)
        });
        DOM.addClass(clonedSlide, 'slick-cloned');
        DOM.prepend(_.$slideTrack!, clonedSlide);
      }

      // Clone slides at the beginning
      for (let i = 0; i < infiniteCount; i += 1) {
        slideIndex = i;
        const clonedSlide = DOM.clone(_.$slides[slideIndex], true);
        DOM.removeAttributes(clonedSlide, 'id');
        DOM.setAttributes(clonedSlide, {
          'data-slick-index': String(slideIndex + _.slideCount!)
        });
        DOM.addClass(clonedSlide, 'slick-cloned');
        DOM.append(_.$slideTrack!, clonedSlide);
      }

      // Remove IDs from cloned elements
      const clonedElements = DOM.find(_.$slideTrack!, '.slick-cloned [id]');
      clonedElements.forEach(el => DOM.removeAttributes(el, 'id'));
    }
  }
}

/**
 * Set slide classes (active, center, current)
 */
export function setSlideClasses(this: Slick, index: number): void {
  const _ = this;

  const allSlides = DOM.find(_.$slider, '.slick-slide');
  const activeElement = document.activeElement as HTMLElement | null;
  allSlides.forEach(slide => {
    // If a focused element is about to be hidden, blur it to avoid aria-hidden focus warnings
    if (activeElement && slide.contains(activeElement)) {
      activeElement.blur();
    }
    DOM.removeClass(slide, 'slick-active', 'slick-center', 'slick-current');
    DOM.setAttributes(slide, { 'aria-hidden': 'true', 'tabindex': '-1' });
  });

  DOM.addClass(_.$slides[index], 'slick-current');
  DOM.setAttributes(_.$slides[index], { 'tabindex': '0' });

  if (_.options.centerMode === true) {
    let evenCoef: number;
    let centerOffset: number;

    if (_.options.slidesToShow >= _.$slides.length) {
      evenCoef = -1;
      centerOffset = _.options.slidesToShow = _.$slides.length;
    } else {
      evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
      centerOffset = Math.floor(_.options.slidesToShow / 2);
    }

    if (_.options.infinite === true) {
      if (index >= centerOffset && index <= (_.slideCount! - 1) - centerOffset) {
        const startIndex = index - centerOffset + evenCoef;
        const endIndex = index + centerOffset + 1;

        for (let i = startIndex; i < endIndex; i++) {
          DOM.addClass(_.$slides[i], 'slick-active');
          DOM.setAttributes(_.$slides[i], { 'aria-hidden': 'false', 'tabindex': '0' });
        }
      } else {
        const indexOffset = _.options.slidesToShow + index;
        const start = indexOffset - centerOffset + 1 + evenCoef;
        const end = indexOffset + centerOffset + 2;

        for (let i = start; i < end && i < allSlides.length; i++) {
          DOM.addClass(allSlides[i], 'slick-active');
          DOM.setAttributes(allSlides[i], { 'aria-hidden': 'false', 'tabindex': '0' });
        }
      }

      if (index === 0) {
        const targetSlide = allSlides[_.options.slidesToShow + _.slideCount! + 1];
        if (targetSlide) {
          DOM.addClass(targetSlide, 'slick-center');
        }
      } else if (index === _.slideCount! - 1) {
        const targetSlide = allSlides[_.options.slidesToShow];
        if (targetSlide) {
          DOM.addClass(targetSlide, 'slick-center');
        }
      }
    }

    DOM.addClass(_.$slides[index], 'slick-center');
  } else {
    if (index >= 0 && index <= (_.slideCount! - _.options.slidesToShow)) {
      for (let i = index; i < index + _.options.slidesToShow; i++) {
        DOM.addClass(_.$slides[i], 'slick-active');
        DOM.setAttributes(_.$slides[i], { 'aria-hidden': 'false', 'tabindex': '0' });
      }
    } else if (allSlides.length <= _.options.slidesToShow) {
      allSlides.forEach(slide => {
        DOM.addClass(slide, 'slick-active');
        DOM.setAttributes(slide, { 'aria-hidden': 'false', 'tabindex': '0' });
      });
    } else {
      const remainder = _.slideCount! % _.options.slidesToShow;
      const indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

      if (_.options.slidesToShow === _.options.slidesToScroll &&
        (_.slideCount! - index) < _.options.slidesToShow) {
        const start = indexOffset - (_.options.slidesToShow - remainder);
        const end = indexOffset + remainder;

        for (let i = start; i < end && i < allSlides.length; i++) {
          DOM.addClass(allSlides[i], 'slick-active');
          DOM.setAttributes(allSlides[i], { 'aria-hidden': 'false', 'tabindex': '0' });
        }
      } else {
        const end = indexOffset + _.options.slidesToShow;
        for (let i = indexOffset; i < end && i < allSlides.length; i++) {
          DOM.addClass(allSlides[i], 'slick-active');
          DOM.setAttributes(allSlides[i], { 'aria-hidden': 'false', 'tabindex': '0' });
        }
      }
    }
  }

  if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
    _.lazyLoad();
  }
}

/**
 * Start load (hide arrows and dots initially)
 */
export function startLoad(this: Slick): void {
  const _ = this;

  if (_.options.arrows === true && _.slideCount! > _.options.slidesToShow) {
    if (_.$prevArrow) DOM.setCSS(_.$prevArrow, { display: 'none' });
    if (_.$nextArrow) DOM.setCSS(_.$nextArrow, { display: 'none' });
  }

  if (_.options.dots === true && _.slideCount! > _.options.slidesToShow) {
    if (_.$dots) DOM.setCSS(_.$dots, { display: 'none' });
  }

  DOM.addClass(_.$slider, 'slick-loading');
}

/**
 * Load slider (show it)
 */
export function loadSlider(this: Slick): void {
  const _ = this;

  _.setPosition();

  if (_.$slideTrack) {
    DOM.setCSS(_.$slideTrack, { opacity: '1' });
  }

  DOM.removeClass(_.$slider, 'slick-loading');

  _.initUI();

  if (_.options.lazyLoad === 'progressive') {
    _.progressiveLazyLoad();
  }
}

/**
 * Initialize UI (show arrows and dots)
 */
export function initUI(this: Slick): void {
  const _ = this;

  if (_.options.arrows === true && _.slideCount! > _.options.slidesToShow) {
    if (_.$prevArrow) DOM.setCSS(_.$prevArrow, { display: '' });
    if (_.$nextArrow) DOM.setCSS(_.$nextArrow, { display: '' });
  }

  if (_.options.dots === true && _.slideCount! > _.options.slidesToShow) {
    if (_.$dots) DOM.setCSS(_.$dots, { display: '' });
  }
}

/**
 * Set dimensions
 */
export function setDimensions(this: Slick): void {
  const _ = this;

  if (_.options.vertical === false) {
    if (_.options.centerMode === true) {
      DOM.setCSS(_.$list!, {
        padding: `0px ${_.options.centerPadding}`
      });
    }
  } else {
    const firstSlideHeight = DOM.outerHeight(_.$slides[0], true);
    DOM.setCSS(_.$list!, {
      height: `${firstSlideHeight * _.options.slidesToShow}px`
    });

    if (_.options.centerMode === true) {
      DOM.setCSS(_.$list!, {
        padding: `${_.options.centerPadding} 0px`
      });
    }
  }

  // Match jQuery's .width()/.height() behavior (content box, exclude padding/border)
  _.listWidth = Math.ceil(DOM.width(_.$list!));
  _.listHeight = Math.ceil(DOM.height(_.$list!));

  if (_.options.vertical === false && _.options.variableWidth === false) {
    _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
    const trackWidth = _.slideWidth * DOM.children(_.$slideTrack!, '.slick-slide').length;
    DOM.setCSS(_.$slideTrack!, { width: `${Math.ceil(trackWidth)}px` });
  } else if (_.options.variableWidth === true) {
    DOM.setCSS(_.$slideTrack!, { width: `${5000 * _.slideCount!}px` });
  } else {
    _.slideWidth = Math.ceil(_.listWidth);
    const firstSlideHeight = DOM.outerHeight(_.$slides[0], true);
    const trackHeight = firstSlideHeight * DOM.children(_.$slideTrack!, '.slick-slide').length;
    DOM.setCSS(_.$slideTrack!, { height: `${Math.ceil(trackHeight)}px` });
  }

  const offset = DOM.outerWidth(_.$slides[0], true) - _.$slides[0].offsetWidth;
  if (_.options.variableWidth === false) {
    const slideChildren = DOM.children(_.$slideTrack!, '.slick-slide');
    slideChildren.forEach(slide => {
      DOM.setCSS(slide, { width: `${(_.slideWidth || 0) - offset}px` });
    });
  }
}

/**
 * Set height (for adaptive height)
 */
export function setHeight(this: Slick): void {
  const _ = this;

  if (_.options.slidesToShow === 1 &&
    _.options.adaptiveHeight === true &&
    _.options.vertical === false) {
    const targetHeight = DOM.outerHeight(_.$slides[_.currentSlide], true);
    DOM.setCSS(_.$list!, { height: `${targetHeight}px` });
  }
}

/**
 * Set position
 */
export function setPosition(this: Slick): void {
  const _ = this;

  _.setDimensions();
  _.setHeight();

  if (_.options.fade === false) {
    _.setCSS(_.getLeft(_.currentSlide));
  } else {
    _.setFade();
  }

  EventManager.trigger(_.$slider, 'setPosition', [_]);
}

/**
 * Resize handler
 */
export function resize(this: Slick): void {
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

/**
 * Autoplay
 */
export function autoPlay(this: Slick): void {
  const _ = this;

  _.autoPlayClear();

  if (_.slideCount! > _.options.slidesToShow) {
    _.autoPlayTimer = window.setInterval(_.boundAutoPlayIterator, _.options.autoplaySpeed);
  }
}

/**
 * Autoplay iterator
 */
export function autoPlayIterator(this: Slick): void {
  const _ = this;
  let slideTo = _.currentSlide + _.options.slidesToScroll;

  if (!_.paused && !_.interrupted && !_.focussed) {
    if (_.options.infinite === false) {
      if (_.direction === 1 && (_.currentSlide + 1) === (_.slideCount! - 1)) {
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

/**
 * Placeholder for methods to be implemented
 */
export function lazyLoad(_: Slick): void {
  // Implemented in lazy loading module
}

export function progressiveLazyLoad(_: Slick, _tryCount?: number): void {
  // Implemented in lazy loading module
}

export function getLeft(_: Slick, _slideIndex: number): number {
  // Implemented in slide-logic module
  return 0;
}

export function slideHandler(_: Slick, _index: number, _sync?: boolean, _dontAnimate?: boolean): void {
  // Implemented in slide-logic module
}

