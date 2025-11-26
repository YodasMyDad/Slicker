/**
 * Arrows Module
 * Handles navigation arrows
 */
import * as DOM from '../utils/dom';
import { EventManager } from './events';
/**
 * Build navigation arrows
 */
export function buildArrows() {
    const _ = this;
    if (_.options.arrows === true) {
        // Create arrow elements
        if (DOM.isHTML(String(_.options.prevArrow))) {
            _.$prevArrow = DOM.createElementFromHTML(String(_.options.prevArrow));
        }
        else {
            _.$prevArrow = _.options.prevArrow;
        }
        DOM.addClass(_.$prevArrow, 'slick-arrow');
        if (DOM.isHTML(String(_.options.nextArrow))) {
            _.$nextArrow = DOM.createElementFromHTML(String(_.options.nextArrow));
        }
        else {
            _.$nextArrow = _.options.nextArrow;
        }
        DOM.addClass(_.$nextArrow, 'slick-arrow');
        if (_.slideCount > _.options.slidesToShow) {
            DOM.removeClass(_.$prevArrow, 'slick-hidden');
            DOM.removeAttributes(_.$prevArrow, 'aria-hidden', 'tabindex');
            DOM.removeClass(_.$nextArrow, 'slick-hidden');
            DOM.removeAttributes(_.$nextArrow, 'aria-hidden', 'tabindex');
            // Append to DOM if HTML strings
            if (DOM.isHTML(String(_.options.prevArrow))) {
                const appendTarget = typeof _.options.appendArrows === 'string' ?
                    DOM.getElement(_.options.appendArrows) :
                    _.options.appendArrows;
                if (appendTarget)
                    DOM.prepend(appendTarget, _.$prevArrow);
            }
            if (DOM.isHTML(String(_.options.nextArrow))) {
                const appendTarget = typeof _.options.appendArrows === 'string' ?
                    DOM.getElement(_.options.appendArrows) :
                    _.options.appendArrows;
                if (appendTarget)
                    DOM.append(appendTarget, _.$nextArrow);
            }
            if (_.options.infinite !== true) {
                DOM.addClass(_.$prevArrow, 'slick-disabled');
                DOM.setAttributes(_.$prevArrow, { 'aria-disabled': 'true' });
            }
        }
        else {
            DOM.addClass(_.$prevArrow, 'slick-hidden');
            DOM.addClass(_.$nextArrow, 'slick-hidden');
            DOM.setAttributes(_.$prevArrow, {
                'aria-disabled': 'true',
                'tabindex': '-1'
            });
            DOM.setAttributes(_.$nextArrow, {
                'aria-disabled': 'true',
                'tabindex': '-1'
            });
        }
    }
}
/**
 * Update arrow states
 */
export function updateArrows() {
    const _ = this;
    if (_.options.arrows === true &&
        _.slideCount > _.options.slidesToShow &&
        !_.options.infinite) {
        DOM.removeClass(_.$prevArrow, 'slick-disabled');
        DOM.setAttributes(_.$prevArrow, { 'aria-disabled': 'false' });
        DOM.removeClass(_.$nextArrow, 'slick-disabled');
        DOM.setAttributes(_.$nextArrow, { 'aria-disabled': 'false' });
        if (_.currentSlide === 0) {
            DOM.addClass(_.$prevArrow, 'slick-disabled');
            DOM.setAttributes(_.$prevArrow, { 'aria-disabled': 'true' });
            DOM.removeClass(_.$nextArrow, 'slick-disabled');
            DOM.setAttributes(_.$nextArrow, { 'aria-disabled': 'false' });
        }
        else if (_.currentSlide >= _.slideCount - _.options.slidesToShow &&
            _.options.centerMode === false) {
            DOM.addClass(_.$nextArrow, 'slick-disabled');
            DOM.setAttributes(_.$nextArrow, { 'aria-disabled': 'true' });
            DOM.removeClass(_.$prevArrow, 'slick-disabled');
            DOM.setAttributes(_.$prevArrow, { 'aria-disabled': 'false' });
        }
        else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
            DOM.addClass(_.$nextArrow, 'slick-disabled');
            DOM.setAttributes(_.$nextArrow, { 'aria-disabled': 'true' });
            DOM.removeClass(_.$prevArrow, 'slick-disabled');
            DOM.setAttributes(_.$prevArrow, { 'aria-disabled': 'false' });
        }
    }
}
/**
 * Initialize arrow events
 */
export function initArrowEvents() {
    const _ = this;
    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
        EventManager.off(_.$prevArrow, 'click.slick');
        EventManager.on(_.$prevArrow, 'click.slick', (event) => {
            event.data = { message: 'previous' };
            _.boundChangeSlide(event, false);
        });
        EventManager.off(_.$nextArrow, 'click.slick');
        EventManager.on(_.$nextArrow, 'click.slick', (event) => {
            event.data = { message: 'next' };
            _.boundChangeSlide(event, false);
        });
        if (_.options.accessibility === true) {
            EventManager.on(_.$prevArrow, 'keydown.slick', _.boundKeyHandler);
            EventManager.on(_.$nextArrow, 'keydown.slick', _.boundKeyHandler);
        }
    }
}
