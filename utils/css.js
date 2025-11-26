/**
 * CSS and Animation Utilities
 * Handles transforms, transitions, and animations
 */
/**
 * Detect CSS transform and transition support
 */
export function detectTransformSupport() {
    const bodyStyle = document.body.style;
    const support = {
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
    }
    else if (bodyStyle.webkitTransform !== undefined) {
        support.transform = true;
        support.transformType = '-webkit-transform';
        support.animType = 'webkitTransform';
    }
    else if (bodyStyle.MozTransform !== undefined) {
        support.transform = true;
        support.transformType = '-moz-transform';
        support.animType = 'MozTransform';
    }
    else if (bodyStyle.msTransform !== undefined) {
        support.transform = true;
        support.transformType = '-ms-transform';
        support.animType = 'msTransform';
    }
    else if (bodyStyle.OTransform !== undefined) {
        support.transform = true;
        support.transformType = '-o-transform';
        support.animType = 'OTransform';
    }
    // Check for transition support
    if (bodyStyle.transition !== undefined) {
        support.transition = true;
        support.transitionType = 'transition';
    }
    else if (bodyStyle.webkitTransition !== undefined) {
        support.transition = true;
        support.transitionType = 'webkitTransition';
    }
    else if (bodyStyle.MozTransition !== undefined) {
        support.transition = true;
        support.transitionType = 'MozTransition';
    }
    else if (bodyStyle.msTransition !== undefined) {
        support.transition = true;
        support.transitionType = 'msTransition';
    }
    else if (bodyStyle.OTransition !== undefined) {
        support.transition = true;
        support.transitionType = 'OTransition';
    }
    // Check for perspective support (needed for 3D transforms)
    const perspectiveProperty = bodyStyle.perspectiveProperty;
    const webkitPerspective = bodyStyle.webkitPerspective;
    const MozPerspective = bodyStyle.MozPerspective;
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
export function setTransform(element, value, transformType) {
    element.style[transformType] = value;
}
/**
 * Set CSS transition
 */
export function setTransition(element, value, transitionType) {
    element.style[transitionType] = value;
}
/**
 * Remove CSS transition
 */
export function removeTransition(element, transitionType) {
    element.style[transitionType] = '';
}
/**
 * Easing function mapping (jQuery easing to CSS cubic-bezier)
 */
export const easingMap = {
    'linear': 'linear',
    'swing': 'ease',
    'ease': 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out'
};
export function getEasing(easing) {
    return easingMap[easing] || easing;
}
export function animateCSS(element, props, options, transitionType) {
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
            element.style[key] = value;
        }
    });
    // Handle completion
    if (complete) {
        let completed = false;
        const onTransitionEnd = () => {
            if (completed)
                return;
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
            if (completed)
                return;
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
export function animateRAF(element, props, options) {
    const { duration, easing, complete } = options;
    const startTime = performance.now();
    const startValues = {};
    // Get initial values
    Object.keys(props).forEach(key => {
        const currentValue = element.style[key];
        startValues[key] = parseFloat(currentValue) || 0;
    });
    function animate(currentTime) {
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
            element.style[key] = `${Math.ceil(currentValue)}px`;
        });
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else if (complete) {
            complete();
        }
    }
    requestAnimationFrame(animate);
}
/**
 * Fade animation
 */
export function fade(element, opacity, duration, callback) {
    const start = parseFloat(window.getComputedStyle(element).opacity) || 0;
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        element.style.opacity = String(start + (opacity - start) * progress);
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
        else if (callback) {
            callback();
        }
    }
    requestAnimationFrame(animate);
}
