/**
 * Keyboard Module
 * Handles keyboard navigation
 */
/**
 * Keyboard event handler
 */
export function keyHandler(event) {
    const _ = this;
    const target = event.target;
    // Don't slide if cursor is inside form fields and arrow keys are pressed
    if (target.tagName.match('TEXTAREA|INPUT|SELECT')) {
        return;
    }
    if (event.keyCode === 37 && _.options.accessibility === true) {
        const message = _.options.rtl === true ? 'next' : 'previous';
        event.data = { message };
        _.changeSlide(event, false);
    }
    else if (event.keyCode === 39 && _.options.accessibility === true) {
        const message = _.options.rtl === true ? 'previous' : 'next';
        event.data = { message };
        _.changeSlide(event, false);
    }
}
