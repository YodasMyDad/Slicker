/**
 * Touch/Swipe Module
 * Handles touch and mouse swipe interactions
 */

import type { Slick } from '../core/SlickComplete';
import * as DOM from '../utils/dom';
import { EventManager } from './events';

/**
 * Swipe handler (main dispatcher)
 */
export function swipeHandler(this: Slick, event: Event): void {
  const _ = this;
  
  if (!_.options.swipe || ('ontouchend' in document && !_.options.swipe)) {
    return;
  } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
    return;
  }
  
  const originalEvent = (event as any).originalEvent || event;
  const touches = originalEvent.touches;
  
  _.touchObject.fingerCount = touches !== undefined ? touches.length : 1;
  _.touchObject.minSwipe = _.listWidth! / _.options.touchThreshold;
  
  if (_.options.verticalSwiping === true) {
    _.touchObject.minSwipe = _.listHeight! / _.options.touchThreshold;
  }
  
  const actionData = (event as any).data?.action || (event as any).action;
  
  switch (actionData) {
    case 'start':
      _.swipeStart(event);
      break;
    case 'move':
      _.swipeMove(event);
      break;
    case 'end':
      _.swipeEnd(event);
      break;
  }
}

/**
 * Swipe start
 */
export function swipeStart(this: Slick, event: Event): void | false {
  const _ = this;
  
  _.interrupted = true;
  
  if (_.touchObject.fingerCount !== 1 || _.slideCount! <= _.options.slidesToShow) {
    _.touchObject = {};
    return;
  }
  
  const originalEvent = (event as any).originalEvent || event;
  const touches = originalEvent.touches;
  
  if (touches !== undefined) {
    _.touchObject.startX = _.touchObject.curX = touches[0].pageX;
    _.touchObject.startY = _.touchObject.curY = touches[0].pageY;
  } else {
    _.touchObject.startX = _.touchObject.curX = (event as MouseEvent).clientX;
    _.touchObject.startY = _.touchObject.curY = (event as MouseEvent).clientY;
  }
  
  _.dragging = true;
}

/**
 * Swipe move
 */
export function swipeMove(this: Slick, event: Event): void | false {
  const _ = this;
  
  const originalEvent = (event as any).originalEvent || event;
  const touches = originalEvent.touches;
  
  if (!_.dragging || _.scrolling || (touches && touches.length !== 1)) {
    return;
  }
  
  const curLeft = _.getLeft(_.currentSlide);
  
  if (touches !== undefined) {
    _.touchObject.curX = touches[0].pageX;
    _.touchObject.curY = touches[0].pageY;
  } else {
    _.touchObject.curX = (event as MouseEvent).clientX;
    _.touchObject.curY = (event as MouseEvent).clientY;
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
  
  const swipeDirection = _.swipeDirection();
  
  if (originalEvent !== undefined && (_.touchObject.swipeLength || 0) > 4) {
    _.swiping = true;
    event.preventDefault();
  }
  
  const positionOffset = (_.options.rtl === false ? 1 : -1) * 
    ((_.touchObject.curX || 0) > (_.touchObject.startX || 0) ? 1 : -1);
  
  if (_.options.verticalSwiping === true) {
    const vPosOffset = (_.touchObject.curY || 0) > (_.touchObject.startY || 0) ? 1 : -1;
    const swipeLength = _.touchObject.swipeLength || 0;
    
    _.touchObject.edgeHit = false;
    
    if (_.options.infinite === false) {
      if ((_.currentSlide === 0 && swipeDirection === 'right') || 
          (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
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
      if ((_.currentSlide === 0 && swipeDirection === 'right') || 
          (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
        const adjustedLength = swipeLength * _.options.edgeFriction;
        _.touchObject.swipeLength = adjustedLength;
        _.touchObject.edgeHit = true;
      }
    }
    
    if (_.options.vertical === false) {
      _.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      _.swipeLeft = curLeft + (swipeLength * (_.$list!.offsetHeight / _.listWidth!)) * positionOffset;
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

/**
 * Swipe end
 */
export function swipeEnd(this: Slick, _event: Event): void {
  const _ = this;
  
  _.dragging = false;
  _.swiping = false;
  
  if (_.scrolling) {
    _.scrolling = false;
    return;
  }
  
  _.interrupted = false;
  _.shouldClick = (_.touchObject.swipeLength || 0) > 10 ? false : true;
  
  if (_.touchObject.curX === undefined) {
    return;
  }
  
  if (_.touchObject.edgeHit === true) {
    EventManager.trigger(_.$slider, 'edge', [_, _.swipeDirection()]);
  }
  
  if ((_.touchObject.swipeLength || 0) >= (_.touchObject.minSwipe || 0)) {
    const direction = _.swipeDirection();
    
    let slideCount: number;
    
    switch (direction) {
      case 'left':
      case 'down':
        slideCount = _.options.swipeToSlide ?
          _.checkNavigable(_.currentSlide + _.getSlideCount()) :
          _.currentSlide + _.getSlideCount();
        _.currentDirection = 0;
        break;
      
      case 'right':
      case 'up':
        slideCount = _.options.swipeToSlide ?
          _.checkNavigable(_.currentSlide - _.getSlideCount()) :
          _.currentSlide - _.getSlideCount();
        _.currentDirection = 1;
        break;
      
      default:
        slideCount = _.currentSlide;
    }
    
    if (direction !== 'vertical') {
      _.slideHandler(slideCount);
      _.touchObject = {};
      EventManager.trigger(_.$slider, 'swipe', [_, direction]);
    }
  } else {
    if ((_.touchObject.startX || 0) !== (_.touchObject.curX || 0)) {
      _.slideHandler(_.currentSlide);
      _.touchObject = {};
    }
  }
}

/**
 * Swipe direction
 */
export function swipeDirection(this: Slick): string {
  const _ = this;
  
  const xDist = (_.touchObject.startX || 0) - (_.touchObject.curX || 0);
  const yDist = (_.touchObject.startY || 0) - (_.touchObject.curY || 0);
  const r = Math.atan2(yDist, xDist);
  
  let swipeAngle = Math.round(r * 180 / Math.PI);
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  
  if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
    return (_.options.rtl === false ? 'left' : 'right');
  }
  if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
    return (_.options.rtl === false ? 'left' : 'right');
  }
  if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
    return (_.options.rtl === false ? 'right' : 'left');
  }
  if (_.options.verticalSwiping === true) {
    if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
      return 'down';
    } else {
      return 'up';
    }
  }
  
  return 'vertical';
}

/**
 * Get slide count for swipe
 */
export function getSlideCount(this: Slick): number {
  const _ = this;
  
  const centerOffset = _.options.centerMode === true ? 
    Math.floor(_.$list!.offsetWidth / 2) : 0;
  const swipeTarget = ((_.swipeLeft || 0) * -1) + centerOffset;
  
  if (_.options.swipeToSlide === true) {
    const slides = DOM.find(_.$slideTrack!, '.slick-slide');
    let swipedSlide: HTMLElement | null = null;
    
    for (const slide of slides) {
      const slideOuterWidth = DOM.outerWidth(slide);
      const slideOffset = slide.offsetLeft;
      const adjustedOffset = _.options.centerMode !== true ? 
        slideOffset + (slideOuterWidth / 2) : slideOffset;
      const slideRightBoundary = adjustedOffset + slideOuterWidth;
      
      if (swipeTarget < slideRightBoundary) {
        swipedSlide = slide;
        break;
      }
    }
    
    if (swipedSlide) {
      const slickIndex = parseInt(swipedSlide.getAttribute('data-slick-index') || '0');
      return Math.abs(slickIndex - _.currentSlide) || 1;
    }
    
    return _.options.slidesToScroll;
  } else {
    return _.options.slidesToScroll;
  }
}

/**
 * Check navigable index
 */
export function checkNavigable(this: Slick, index: number): number {
  const _ = this;
  
  const navigables = _.getNavigableIndexes();
  let prevNavigable = 0;
  
  if (index > navigables[navigables.length - 1]) {
    index = navigables[navigables.length - 1];
  } else {
    for (const n of navigables) {
      if (index < n) {
        index = prevNavigable;
        break;
      }
      prevNavigable = n;
    }
  }
  
  return index;
}

/**
 * Get navigable indexes
 */
export function getNavigableIndexes(this: Slick): number[] {
  const _ = this;
  
  let breakPoint = 0;
  let counter = 0;
  const indexes: number[] = [];
  let max: number;
  
  if (_.options.infinite === false) {
    max = _.slideCount!;
  } else {
    breakPoint = _.options.slidesToScroll * -1;
    counter = _.options.slidesToScroll * -1;
    max = _.slideCount! * 2;
  }
  
  while (breakPoint < max) {
    indexes.push(breakPoint);
    breakPoint = counter + _.options.slidesToScroll;
    counter += _.options.slidesToScroll <= _.options.slidesToShow ? 
      _.options.slidesToScroll : _.options.slidesToShow;
  }
  
  return indexes;
}

