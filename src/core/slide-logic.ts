/**
 * Slide Logic
 * Core sliding functionality
 */

import type { Slick } from './SlickComplete';
import * as DOM from '../utils/dom';
import { EventManager } from '../modules/events';

/**
 * Change slide (from event)
 */
export function changeSlide(this: Slick, event: Event, dontAnimate?: boolean): void {
  const _ = this;
  const eventData = (event as any).data || {};
  const target = event.currentTarget as HTMLElement;

  // If target is a link, prevent default
  if (target && DOM.is(target, 'a')) {
    event.preventDefault();
  }

  // Find the closest li if not already
  let $target = target;
  if ($target && !DOM.is($target, 'li')) {
    const closest = DOM.closest($target, 'li');
    if (closest) $target = closest;
  }

  const unevenOffset = (_.slideCount! % _.options.slidesToScroll !== 0);
  const indexOffset = unevenOffset ? 0 : (_.slideCount! - _.currentSlide) % _.options.slidesToScroll;

  let slideOffset: number;

  switch (eventData.message) {
    case 'previous':
      slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
      if (_.slideCount! > _.options.slidesToShow) {
        _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
      }
      break;

    case 'next':
      slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
      if (_.slideCount! > _.options.slidesToShow) {
        _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
      }
      break;

    case 'index':
      const index = eventData.index === 0 ? 0 :
        eventData.index || ($target ? DOM.index($target) * _.options.slidesToScroll : 0);

      _.slideHandler(_.checkNavigable(index), false, dontAnimate);

      if ($target) {
        const focusable = DOM.children($target);
        if (focusable.length > 0) {
          DOM.focus(focusable[0]);
        }
      }
      break;

    default:
      return;
  }
}

/**
 * Select handler (focus on select)
 */
export function selectHandler(this: Slick, event: Event): void {
  const _ = this;

  const target = event.target as HTMLElement;
  const targetElement = DOM.is(target, '.slick-slide') ?
    target :
    DOM.closest(target, '.slick-slide');

  if (!targetElement) return;

  const index = parseInt(targetElement.getAttribute('data-slick-index') || '0');

  if (!index) {
    // index = 0 is valid
  }

  if (_.slideCount! <= _.options.slidesToShow) {
    _.slideHandler(index, false, true);
    return;
  }

  _.slideHandler(index);
}

/**
 * Main slide handler
 */
export function slideHandler(this: Slick, index: number, sync = false, dontAnimate?: boolean): void {
  const _ = this;

  if (_.animating === true && _.options.waitForAnimate === true) {
    return;
  }

  if (_.options.fade === true && _.currentSlide === index) {
    return;
  }

  if (sync === false) {
    _.asNavFor(index);
  }

  let targetSlide = index;
  const targetLeft = _.getLeft(targetSlide);
  const slideLeft = _.getLeft(_.currentSlide);

  _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

  if (_.options.infinite === false && _.options.centerMode === false &&
    (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
    if (_.options.fade === false) {
      targetSlide = _.currentSlide;
      if (dontAnimate !== true && _.slideCount! > _.options.slidesToShow) {
        _.animateSlide(slideLeft, () => {
          _.postSlide(targetSlide);
        });
      } else {
        _.postSlide(targetSlide);
      }
    }
    return;
  } else if (_.options.infinite === false && _.options.centerMode === true &&
    (index < 0 || index > (_.slideCount! - _.options.slidesToScroll))) {
    if (_.options.fade === false) {
      targetSlide = _.currentSlide;
      if (dontAnimate !== true && _.slideCount! > _.options.slidesToShow) {
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
    clearInterval(_.autoPlayTimer!);
  }

  let animSlide: number;

  if (targetSlide < 0) {
    if (_.slideCount! % _.options.slidesToScroll !== 0) {
      animSlide = _.slideCount! - (_.slideCount! % _.options.slidesToScroll);
    } else {
      animSlide = _.slideCount! + targetSlide;
    }
  } else if (targetSlide >= _.slideCount!) {
    if (_.slideCount! % _.options.slidesToScroll !== 0) {
      animSlide = 0;
    } else {
      animSlide = targetSlide - _.slideCount!;
    }
  } else {
    animSlide = targetSlide;
  }

  _.animating = true;

  EventManager.trigger(_.$slider, 'beforeChange', [_, _.currentSlide, animSlide]);

  const oldSlide = _.currentSlide;
  _.currentSlide = animSlide;

  _.setSlideClasses(_.currentSlide);

  if (_.options.asNavFor) {
    const navTargets = _.getNavTarget();
    navTargets.forEach(target => {
      const slickInstance = (target as any).slick;
      if (slickInstance && !slickInstance.unslicked) {
        if (slickInstance.slideCount! <= slickInstance.options.slidesToShow) {
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

  if (dontAnimate !== true && _.slideCount! > _.options.slidesToShow) {
    _.animateSlide(targetLeft, () => {
      _.postSlide(animSlide);
    });
  } else {
    _.postSlide(animSlide);
  }
}

/**
 * Post slide (after animation)
 */
export function postSlide(this: Slick, index: number): void {
  const _ = this;

  if (!_.unslicked) {
    EventManager.trigger(_.$slider, 'afterChange', [_, index]);

    _.animating = false;

    if (_.slideCount! > _.options.slidesToShow) {
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
          DOM.setAttributes($currentSlide, { tabindex: '0' });
          DOM.focus($currentSlide);
        }
      }
    }
  }
}

/**
 * Get left position for slide
 */
export function getLeft(this: Slick, slideIndex: number): number {
  const _ = this;

  let targetLeft: number;
  let verticalHeight: number;
  let verticalOffset = 0;
  let targetSlide: HTMLElement | null;
  let coef: number;

  _.slideOffset = 0;
  verticalHeight = _.$slides[0] ? DOM.outerHeight(_.$slides[0], true) : 0;

  if (_.options.infinite === true) {
    if (_.slideCount! > _.options.slidesToShow) {
      _.slideOffset = ((_.slideWidth || 0) * _.options.slidesToShow) * -1;
      coef = -1;

      if (_.options.vertical === true && _.options.centerMode === true) {
        if (_.options.slidesToShow === 2) {
          coef = -1.5;
        } else if (_.options.slidesToShow === 1) {
          coef = -2;
        }
      }
      verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
    }

    if (_.slideCount! % _.options.slidesToScroll !== 0) {
      if (slideIndex + _.options.slidesToScroll > _.slideCount! &&
        _.slideCount! > _.options.slidesToShow) {
        if (slideIndex > _.slideCount!) {
          _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount!)) * (_.slideWidth || 0)) * -1;
          verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount!)) * verticalHeight) * -1;
        } else {
          _.slideOffset = ((_.slideCount! % _.options.slidesToScroll) * (_.slideWidth || 0)) * -1;
          verticalOffset = ((_.slideCount! % _.options.slidesToScroll) * verticalHeight) * -1;
        }
      }
    }
  } else {
    if (slideIndex + _.options.slidesToShow > _.slideCount!) {
      _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount!) * (_.slideWidth || 0);
      verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount!) * verticalHeight;
    }
  }

  if (_.slideCount! <= _.options.slidesToShow) {
    _.slideOffset = 0;
    verticalOffset = 0;
  }

  if (_.options.centerMode === true && _.slideCount! <= _.options.slidesToShow) {
    _.slideOffset = (((_.slideWidth || 0) * Math.floor(_.options.slidesToShow)) / 2) -
      (((_.slideWidth || 0) * _.slideCount!) / 2);
  } else if (_.options.centerMode === true && _.options.infinite === true) {
    _.slideOffset += (_.slideWidth || 0) * Math.floor(_.options.slidesToShow / 2) - (_.slideWidth || 0);
  } else if (_.options.centerMode === true) {
    _.slideOffset = 0;
    _.slideOffset += (_.slideWidth || 0) * Math.floor(_.options.slidesToShow / 2);
  }

  if (_.options.vertical === false) {
    targetLeft = ((slideIndex * (_.slideWidth || 0)) * -1) + _.slideOffset;
  } else {
    targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
  }

  if (_.options.variableWidth === true) {
    const allSlides = DOM.find(_.$slideTrack!, '.slick-slide');

    if (_.slideCount! <= _.options.slidesToShow || _.options.infinite === false) {
      targetSlide = allSlides[slideIndex] || null;
    } else {
      targetSlide = allSlides[slideIndex + _.options.slidesToShow] || null;
    }

    if (_.options.rtl === true) {
      if (targetSlide) {
        targetLeft = (_.$slideTrack!.offsetWidth - targetSlide.offsetLeft - DOM.outerWidth(targetSlide)) * -1;
      } else {
        targetLeft = 0;
      }
    } else {
      targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
    }

    if (_.options.centerMode === true) {
      if (_.slideCount! <= _.options.slidesToShow || _.options.infinite === false) {
        targetSlide = allSlides[slideIndex] || null;
      } else {
        targetSlide = allSlides[slideIndex + _.options.slidesToShow + 1] || null;
      }

      if (_.options.rtl === true) {
        if (targetSlide) {
          targetLeft = (_.$slideTrack!.offsetWidth - targetSlide.offsetLeft - DOM.outerWidth(targetSlide)) * -1;
        } else {
          targetLeft = 0;
        }
      } else {
        targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
      }

      targetLeft += (_.$list!.offsetWidth - DOM.outerWidth(targetSlide!)) / 2;
    }
  }

  return targetLeft;
}

/**
 * Get nav target (for asNavFor)
 */
export function getNavTarget(this: Slick): HTMLElement[] {
  const asNavFor = this.options.asNavFor;

  if (asNavFor && asNavFor !== null) {
    if (typeof asNavFor === 'string') {
      return DOM.getElements(asNavFor).filter(el => el !== this.$slider);
    } else if (asNavFor !== this.$slider) {
      return [asNavFor];
    }
  }

  return [];
}

/**
 * AsNavFor sync
 */
export function asNavFor(this: Slick, index: number): void {
  const _ = this;
  const targets = _.getNavTarget();

  targets.forEach(target => {
    const slickInstance = (target as any).slick;
    if (slickInstance && !slickInstance.unslicked) {
      slickInstance.slideHandler(index, true);
    }
  });
}

/**
 * Initialize all events
 */
export function initializeEvents(this: Slick): void {
  const _ = this;

  _.initArrowEvents();
  _.initDotEvents();
  _.initSlideEvents();

  if (_.$list) {
    EventManager.on(_.$list, 'touchstart.slick mousedown.slick', (event) => {
      (event as any).data = { action: 'start' };
      _.boundSwipeHandler(event);
    });

    EventManager.on(_.$list, 'touchmove.slick mousemove.slick', (event) => {
      (event as any).data = { action: 'move' };
      _.boundSwipeHandler(event);
    });

    EventManager.on(_.$list, 'touchend.slick mouseup.slick', (event) => {
      (event as any).data = { action: 'end' };
      _.boundSwipeHandler(event);
    });

    EventManager.on(_.$list, 'touchcancel.slick mouseleave.slick', (event) => {
      (event as any).data = { action: 'end' };
      _.boundSwipeHandler(event);
    });

    EventManager.on(_.$list, 'click.slick', _.boundClickHandler);
  }

  // Visibility change
  if (typeof document.hidden !== 'undefined') {
    _.hidden = 'hidden';
    _.visibilityChange = 'visibilitychange';
  } else if (typeof (document as any).msHidden !== 'undefined') {
    _.hidden = 'msHidden';
    _.visibilityChange = 'msvisibilitychange';
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    _.hidden = 'webkitHidden';
    _.visibilityChange = 'webkitvisibilitychange';
  }

  EventManager.on(document, _.visibilityChange, _.boundVisibility);

  if (_.options.accessibility === true && _.$list) {
    EventManager.on(_.$list, 'keydown.slick', _.boundKeyHandler as EventListener);
  }

  if (_.options.focusOnSelect === true) {
    const trackChildren = DOM.children(_.$slideTrack!);
    trackChildren.forEach(child => {
      EventManager.on(child, 'click.slick', _.boundSelectHandler);
    });
  }

  EventManager.on(window, `orientationchange.slick.slick-${_.instanceUid}`, _.boundOrientationChange);
  EventManager.on(window, `resize.slick.slick-${_.instanceUid}`, _.boundResize);

  const draggableElements = DOM.find(_.$slideTrack!, ':not([draggable="true"])');
  draggableElements.forEach(el => {
    el.addEventListener('dragstart', _.preventDefault);
  });

  EventManager.on(window, `load.slick.slick-${_.instanceUid}`, _.boundSetPosition);
  _.setPosition();
}

