/**
 * CSS and Animation Utilities
 * Handles transforms, transitions, and animations
 */

export interface TransformSupport {
  transform: boolean;
  transition: boolean;
  transformType: string | null;
  transitionType: string | null;
  animType: string | null;
}

/**
 * Detect CSS transform and transition support
 */
export function detectTransformSupport(): TransformSupport {
  const bodyStyle = document.body.style;
  const support: TransformSupport = {
    transform: false,
    transition: false,
    transformType: null,
    transitionType: null,
    animType: null
  };

  // Check for transform support
  if (bodyStyle.transform !== undefined) {
    support.transform = true;
    support.transformType = 'transform';
    support.animType = 'transform';
  } else if ((bodyStyle as any).webkitTransform !== undefined) {
    support.transform = true;
    support.transformType = '-webkit-transform';
    support.animType = 'webkitTransform';
  } else if ((bodyStyle as any).MozTransform !== undefined) {
    support.transform = true;
    support.transformType = '-moz-transform';
    support.animType = 'MozTransform';
  } else if ((bodyStyle as any).msTransform !== undefined) {
    support.transform = true;
    support.transformType = '-ms-transform';
    support.animType = 'msTransform';
  } else if ((bodyStyle as any).OTransform !== undefined) {
    support.transform = true;
    support.transformType = '-o-transform';
    support.animType = 'OTransform';
  }

  // Check for transition support
  if (bodyStyle.transition !== undefined) {
    support.transition = true;
    support.transitionType = 'transition';
  } else if ((bodyStyle as any).webkitTransition !== undefined) {
    support.transition = true;
    support.transitionType = 'webkitTransition';
  } else if ((bodyStyle as any).MozTransition !== undefined) {
    support.transition = true;
    support.transitionType = 'MozTransition';
  } else if ((bodyStyle as any).msTransition !== undefined) {
    support.transition = true;
    support.transitionType = 'msTransition';
  } else if ((bodyStyle as any).OTransition !== undefined) {
    support.transition = true;
    support.transitionType = 'OTransition';
  }

  // Check for perspective support (needed for 3D transforms)
  const perspectiveProperty = (bodyStyle as any).perspectiveProperty;
  const webkitPerspective = (bodyStyle as any).webkitPerspective;
  const MozPerspective = (bodyStyle as any).MozPerspective;

  if (support.animType === 'OTransform' && 
      perspectiveProperty === undefined && 
      webkitPerspective === undefined) {
    support.animType = null;
  }
  if (support.animType === 'MozTransform' && 
      perspectiveProperty === undefined && 
      MozPerspective === undefined) {
    support.animType = null;
  }
  if (support.animType === 'webkitTransform' && 
      perspectiveProperty === undefined && 
      webkitPerspective === undefined) {
    support.animType = null;
  }

  return support;
}

/**
 * Set CSS transform
 */
export function setTransform(element: HTMLElement, value: string, transformType: string): void {
  (element.style as any)[transformType] = value;
}

/**
 * Set CSS transition
 */
export function setTransition(element: HTMLElement, value: string, transitionType: string): void {
  (element.style as any)[transitionType] = value;
}

/**
 * Remove CSS transition
 */
export function removeTransition(element: HTMLElement, transitionType: string): void {
  (element.style as any)[transitionType] = '';
}

/**
 * Easing function mapping (jQuery easing to CSS cubic-bezier)
 */
export const easingMap: Record<string, string> = {
  'linear': 'linear',
  'swing': 'ease',
  'ease': 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

export function getEasing(easing: string): string {
  return easingMap[easing] || easing;
}

/**
 * Animate using CSS transitions
 */
export interface AnimateOptions {
  duration: number;
  easing: string;
  complete?: () => void;
}

export function animateCSS(
  element: HTMLElement,
  props: Partial<CSSStyleDeclaration>,
  options: AnimateOptions,
  transitionType: string
): void {
  const { duration, easing, complete } = options;
  
  // Build transition string
  const transitions = Object.keys(props).map(prop => {
    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `${cssProp} ${duration}ms ${getEasing(easing)}`;
  }).join(', ');
  
  // Set transition
  setTransition(element, transitions, transitionType);
  
  // Apply properties
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      (element.style as any)[key] = value;
    }
  });
  
  // Handle completion
  if (complete) {
    let completed = false;
    const onTransitionEnd = () => {
      if (completed) return;
      completed = true;
      element.removeEventListener('transitionend', onTransitionEnd);
      element.removeEventListener('webkitTransitionEnd', onTransitionEnd);
      clearTimeout(fallbackTimeout);
      removeTransition(element, transitionType);
      complete();
    };
    
    element.addEventListener('transitionend', onTransitionEnd);
    element.addEventListener('webkitTransitionEnd', onTransitionEnd);
    
    // Fallback timeout in case transitionend doesn't fire
    const fallbackTimeout = setTimeout(() => {
      if (completed) return;
      completed = true;
      element.removeEventListener('transitionend', onTransitionEnd);
      element.removeEventListener('webkitTransitionEnd', onTransitionEnd);
      removeTransition(element, transitionType);
      complete();
    }, duration + 50);
  }
}

/**
 * Animate using requestAnimationFrame (fallback for browsers without CSS transitions)
 */
export function animateRAF(
  element: HTMLElement,
  props: Record<string, number>,
  options: AnimateOptions
): void {
  const { duration, easing, complete } = options;
  const startTime = performance.now();
  const startValues: Record<string, number> = {};
  
  // Get initial values
  Object.keys(props).forEach(key => {
    const currentValue = (element.style as any)[key];
    startValues[key] = parseFloat(currentValue) || 0;
  });
  
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Apply easing (simple linear for now, can be extended)
    const easedProgress = easing === 'linear' ? progress : 
                         easing === 'ease-in' ? progress * progress :
                         easing === 'ease-out' ? progress * (2 - progress) :
                         progress; // default
    
    // Update properties
    Object.entries(props).forEach(([key, endValue]) => {
      const startValue = startValues[key];
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      (element.style as any)[key] = `${Math.ceil(currentValue)}px`;
    });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (complete) {
      complete();
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Fade animation
 */
export function fade(
  element: HTMLElement,
  opacity: number,
  duration: number,
  callback?: () => void
): void {
  const start = parseFloat(window.getComputedStyle(element).opacity) || 0;
  const startTime = performance.now();
  
  function animate(currentTime: number) {
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

