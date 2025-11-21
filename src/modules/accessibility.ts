/**
 * Accessibility Module
 * Handles ADA/ARIA compliance
 */

import type { Slick } from '../core/SlickComplete';
import * as DOM from '../utils/dom';
import { EventManager } from './events';

/**
 * Initialize ADA compliance
 */
export function initADA(this: Slick): void {
  const _ = this;
  
  const numDotGroups = Math.ceil(_.slideCount! / _.options.slidesToScroll);
  const tabControlIndexes = _.getNavigableIndexes().filter(val => {
    return (val >= 0) && (val < _.slideCount!);
  });
  
  // Set all slides and cloned slides as hidden
  const allSlides = [..._.$slides, ...DOM.find(_.$slideTrack!, '.slick-cloned')];
  allSlides.forEach(slide => {
    DOM.setAttributes(slide, {
      'aria-hidden': 'true',
      'tabindex': '-1'
    });
    
    const interactiveElements = DOM.find(slide, 'a, input, button, select');
    interactiveElements.forEach(el => {
      DOM.setAttributes(el, { 'tabindex': '-1' });
    });
  });
  
  if (_.$dots !== null) {
    const nonClonedSlides = _.$slides.filter(slide => !DOM.hasClass(slide, 'slick-cloned'));
    
    nonClonedSlides.forEach((slide, i) => {
      const slideControlIndex = tabControlIndexes.indexOf(i);
      
      DOM.setAttributes(slide, {
        'role': 'tabpanel',
        'id': `slick-slide${_.instanceUid}${i}`,
        'tabindex': '-1'
      });
      
      if (slideControlIndex !== -1) {
        const ariaButtonControl = `slick-slide-control${_.instanceUid}${slideControlIndex}`;
        const controlElement = document.getElementById(ariaButtonControl);
        
        if (controlElement) {
          DOM.setAttributes(slide, {
            'aria-describedby': ariaButtonControl
          });
        }
      }
    });
    
    DOM.setAttributes(_.$dots, { 'role': 'tablist' });
    
    const dotItems = DOM.find(_.$dots, 'li');
    dotItems.forEach((li, i) => {
      const mappedSlideIndex = tabControlIndexes[i];
      
      DOM.setAttributes(li, { 'role': 'presentation' });
      
      const button = DOM.findOne(li, 'button');
      if (button) {
        DOM.setAttributes(button, {
          'role': 'tab',
          'id': `slick-slide-control${_.instanceUid}${i}`,
          'aria-controls': `slick-slide${_.instanceUid}${mappedSlideIndex}`,
          'aria-label': `${i + 1} / ${numDotGroups}`,
          'aria-selected': 'null',
          'tabindex': '-1'
        });
      }
    });
    
    const currentDotButton = dotItems[_.currentSlide] && 
      DOM.findOne(dotItems[_.currentSlide], 'button');
    
    if (currentDotButton) {
      DOM.setAttributes(currentDotButton, {
        'aria-selected': 'true',
        'tabindex': '0'
      });
    }
  }
  
  // Set visible slides
  for (let i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
    if (_.$slides[i]) {
      if (_.options.focusOnChange) {
        DOM.setAttributes(_.$slides[i], { 'tabindex': '0' });
      } else {
        DOM.removeAttributes(_.$slides[i], 'tabindex');
      }
    }
  }
  
  _.activateADA();
}

/**
 * Activate ADA for visible slides
 */
export function activateADA(this: Slick): void {
  const _ = this;
  
  const activeSlides = DOM.find(_.$slideTrack!, '.slick-active');
  activeSlides.forEach(slide => {
    DOM.setAttributes(slide, {
      'aria-hidden': 'false',
      'tabindex': '0'
    });
    
    const interactiveElements = DOM.find(slide, 'a, input, button, select');
    interactiveElements.forEach(el => {
      DOM.setAttributes(el, { 'tabindex': '0' });
    });
  });
}

/**
 * Focus handler for accessibility
 */
export function focusHandler(this: Slick): void {
  const _ = this;
  
  EventManager.off(_.$slider, 'focusin.slick focusout.slick');
  
  EventManager.on(_.$slider, 'focusin.slick', (event) => {
    setTimeout(() => {
      const target = event.target as HTMLElement;
      if (_.options.pauseOnFocus && target.matches(':focus')) {
        _.focussed = true;
        _.autoPlay();
      }
    }, 0);
  });
  
  EventManager.on(_.$slider, 'focusout.slick', () => {
    if (_.options.pauseOnFocus) {
      _.focussed = false;
      _.autoPlay();
    }
  });
}

