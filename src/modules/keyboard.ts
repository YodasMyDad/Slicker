/**
 * Keyboard Module
 * Handles keyboard navigation
 */

import type { Slick } from '../core/SlickComplete';

/**
 * Keyboard event handler
 */
export function keyHandler(this: Slick, event: KeyboardEvent): void {
  const _ = this;
  
  const target = event.target as HTMLElement;
  
  // Don't slide if cursor is inside form fields and arrow keys are pressed
  if (target.tagName.match('TEXTAREA|INPUT|SELECT')) {
    return;
  }
  
  if (event.keyCode === 37 && _.options.accessibility === true) {
    const message = _.options.rtl === true ? 'next' : 'previous';
    (event as any).data = { message };
    _.changeSlide(event, false);
  } else if (event.keyCode === 39 && _.options.accessibility === true) {
    const message = _.options.rtl === true ? 'previous' : 'next';
    (event as any).data = { message };
    _.changeSlide(event, false);
  }
}

