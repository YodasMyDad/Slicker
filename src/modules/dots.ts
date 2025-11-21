/**
 * Dots Module
 * Handles pagination dots
 */

import type { Slick } from '../core/SlickComplete';
import * as DOM from '../utils/dom';
import { EventManager } from './events';

/**
 * Build pagination dots
 */
export function buildDots(this: Slick): void {
  const _ = this;
  
  if (_.options.dots === true && _.slideCount! > _.options.slidesToShow) {
    DOM.addClass(_.$slider, 'slick-dotted');
    
    const dot = document.createElement('ul');
    DOM.addClass(dot, _.options.dotsClass);
    
    const dotCount = _.getDotCount();
    
    for (let i = 0; i <= dotCount; i += 1) {
      const li = document.createElement('li');
      const button = _.options.customPaging.call(this, _, i);
      li.appendChild(button);
      dot.appendChild(li);
    }
    
    const appendTarget = typeof _.options.appendDots === 'string' ?
      DOM.getElement(_.options.appendDots) :
      _.options.appendDots as HTMLElement;
    
    if (appendTarget) {
      appendTarget.appendChild(dot);
    }
    _.$dots = dot;
    
    const firstDot = DOM.findOne(_.$dots, 'li');
    if (firstDot) {
      DOM.addClass(firstDot, 'slick-active');
    }
  }
}

/**
 * Update dots
 */
export function updateDots(this: Slick): void {
  const _ = this;
  
  if (_.$dots !== null) {
    const dots = DOM.find(_.$dots, 'li');
    dots.forEach(dot => DOM.removeClass(dot, 'slick-active'));
    
    const activeDotIndex = Math.floor(_.currentSlide / _.options.slidesToScroll);
    if (dots[activeDotIndex]) {
      DOM.addClass(dots[activeDotIndex], 'slick-active');
    }
  }
}

/**
 * Get dot count
 */
export function getDotCount(this: Slick): number {
  const _ = this;
  
  let breakPoint = 0;
  let counter = 0;
  let pagerQty = 0;
  
  if (_.options.infinite === true) {
    if (_.slideCount! <= _.options.slidesToShow) {
      ++pagerQty;
    } else {
      while (breakPoint < _.slideCount!) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToScroll;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? 
          _.options.slidesToScroll : _.options.slidesToShow;
      }
    }
  } else if (_.options.centerMode === true) {
    pagerQty = _.slideCount!;
  } else if (!_.options.asNavFor) {
    pagerQty = 1 + Math.ceil((_.slideCount! - _.options.slidesToShow) / _.options.slidesToScroll);
  } else {
    while (breakPoint < _.slideCount!) {
      ++pagerQty;
      breakPoint = counter + _.options.slidesToScroll;
      counter += _.options.slidesToScroll <= _.options.slidesToShow ? 
        _.options.slidesToScroll : _.options.slidesToShow;
    }
  }
  
  return pagerQty - 1;
}

/**
 * Initialize dot events
 */
export function initDotEvents(this: Slick): void {
  const _ = this;
  
  if (_.options.dots === true && _.slideCount! > _.options.slidesToShow) {
    EventManager.delegate(_.$dots!, 'click.slick', 'li', (event, target) => {
      event.preventDefault();
      // Each dot represents a full "page" jump, so map the dot index to the
      // correct slide index based on slidesToScroll (mirrors jQuery Slick).
      const pageIndex = DOM.index(target);
      const slideIndex = pageIndex * _.options.slidesToScroll;
      (event as any).data = { message: 'index', index: slideIndex };
      _.boundChangeSlide(event);
    });
    
    if (_.options.accessibility === true) {
      EventManager.on(_.$dots!, 'keydown.slick', _.boundKeyHandler as EventListener);
    }
  }
  
  if (_.options.dots === true && 
      _.options.pauseOnDotsHover === true && 
      _.slideCount! > _.options.slidesToShow) {
    EventManager.delegate(_.$dots!, 'mouseenter.slick', 'li', () => {
      _.interrupt(true);
    });
    
    EventManager.delegate(_.$dots!, 'mouseleave.slick', 'li', () => {
      _.interrupt(false);
    });
  }
}

/**
 * Interrupt autoplay
 */
export function interrupt(this: Slick, toggle: boolean): void {
  const _ = this;
  
  if (!toggle) {
    _.autoPlay();
  }
  _.interrupted = toggle;
}

