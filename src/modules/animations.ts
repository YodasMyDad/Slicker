/**
 * Animation Module
 * Handles slide animations, fades, and transitions
 */

import type { Slick } from '../core/SlickComplete';
import * as DOM from '../utils/dom';
import { animateCSS, animateRAF, fade, setTransform, setTransition, removeTransition } from '../utils/css';

/**
 * Animate slide to target position
 */
export function animateSlide(this: Slick, targetLeft: number, callback?: () => void): void {
  const _ = this;
  
  _.animateHeight();
  
  if (_.options.rtl === true && _.options.vertical === false) {
    targetLeft = -targetLeft;
  }
  
  if (_.transformsEnabled === false) {
    // Use jQuery-style animation (fallback)
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
      // Use manual animation with transforms
      if (_.options.rtl === true) {
        _.currentLeft = -(_.currentLeft || 0);
      }
      
      const startLeft = _.currentLeft || 0;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / _.options.speed, 1);
        const now = Math.ceil(startLeft + (targetLeft - startLeft) * progress);
        
        if (_.$slideTrack) {
          if (_.options.vertical === false) {
            const transform = `translate(${now}px, 0px)`;
            setTransform(_.$slideTrack, transform, _.animType || 'transform');
          } else {
            const transform = `translate(0px, ${now}px)`;
            setTransform(_.$slideTrack, transform, _.animType || 'transform');
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
      // Use CSS transitions
      _.applyTransition();
      targetLeft = Math.ceil(targetLeft);
      
      if (_.$slideTrack) {
        let transform: string;
        if (_.options.vertical === false) {
          transform = `translate3d(${targetLeft}px, 0px, 0px)`;
        } else {
          transform = `translate3d(0px, ${targetLeft}px, 0px)`;
        }
        
        setTransform(_.$slideTrack, transform, _.animType || 'transform');
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

/**
 * Animate height for adaptive height
 */
export function animateHeight(this: Slick): void {
  const _ = this;
  
  if (_.options.slidesToShow === 1 && 
      _.options.adaptiveHeight === true && 
      _.options.vertical === false) {
    const targetHeight = DOM.outerHeight(_.$slides[_.currentSlide], true);
    
    if (_.$list) {
      animateCSS(_.$list, {
        height: `${targetHeight}px`
      }, {
        duration: _.options.speed,
        easing: _.options.easing
      }, _.transitionType || 'transition');
    }
  }
}

/**
 * Apply CSS transition
 */
export function applyTransition(this: Slick, slide?: number): void {
  const _ = this;
  
  if (!_.transitionType) return;
  
  let transitionValue: string;
  
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
    if (slide !== undefined && _.$slides[slide]) {
      setTransition(_.$slides[slide], transitionValue, _.transitionType);
    }
  }
}

/**
 * Disable CSS transition
 */
export function disableTransition(this: Slick, slide?: number): void {
  const _ = this;
  
  if (!_.transitionType) return;
  
  if (_.options.fade === false) {
    if (_.$slideTrack) {
      removeTransition(_.$slideTrack, _.transitionType);
    }
  } else {
    if (slide !== undefined && _.$slides[slide]) {
      removeTransition(_.$slides[slide], _.transitionType);
    }
  }
}

/**
 * Fade in a slide
 */
export function fadeSlide(this: Slick, slideIndex: number, callback?: () => void): void {
  const _ = this;
  
  if (_.cssTransitions === false) {
    DOM.setCSS(_.$slides[slideIndex], {
      zIndex: String(_.options.zIndex)
    });
    
    fade(_.$slides[slideIndex], 1, _.options.speed, callback);
  } else {
    _.applyTransition(slideIndex);
    
    DOM.setCSS(_.$slides[slideIndex], {
      opacity: '1',
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

/**
 * Fade out a slide
 */
export function fadeSlideOut(this: Slick, slideIndex: number): void {
  const _ = this;
  
  if (_.cssTransitions === false) {
    fade(_.$slides[slideIndex], 0, _.options.speed, () => {
      DOM.setCSS(_.$slides[slideIndex], {
        zIndex: String(_.options.zIndex - 2)
      });
    });
  } else {
    _.applyTransition(slideIndex);
    
    DOM.setCSS(_.$slides[slideIndex], {
      opacity: '0',
      zIndex: String(_.options.zIndex - 2)
    });
  }
}

/**
 * Set CSS transform position
 */
export function setCSS(this: Slick, position: number): void {
  const _ = this;
  
  if (_.options.rtl === true) {
    position = -position;
  }
  
  const x = _.positionProp === 'left' ? Math.ceil(position) + 'px' : '0px';
  const y = _.positionProp === 'top' ? Math.ceil(position) + 'px' : '0px';
  
  if (_.transformsEnabled === false) {
    if (_.$slideTrack) {
      DOM.setCSS(_.$slideTrack, {
        [_.positionProp as string]: _.positionProp === 'left' ? x : y
      });
    }
  } else {
    let transform: string;
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

/**
 * Set fade styling
 */
export function setFade(this: Slick): void {
  const _ = this;
  
  _.$slides.forEach((slide, index) => {
    const targetLeft = (_.slideWidth || 0) * index * -1;
    
    if (_.options.rtl === true) {
      DOM.setCSS(slide, {
        position: 'relative',
        right: `${targetLeft}px`,
        top: '0',
        zIndex: String(_.options.zIndex - 2),
        opacity: '0'
      });
    } else {
      DOM.setCSS(slide, {
        position: 'relative',
        left: `${targetLeft}px`,
        top: '0',
        zIndex: String(_.options.zIndex - 2),
        opacity: '0'
      });
    }
  });
  
  DOM.setCSS(_.$slides[_.currentSlide], {
    zIndex: String(_.options.zIndex - 1),
    opacity: '1'
  });
}

