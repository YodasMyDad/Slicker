/**
 * Complete Slicker Carousel class (Slick-compatible)
 * Imports all modules and methods
 */
import { defaultOptions, initialState } from './defaults';
// Import all method modules
import * as CoreMethods from './methods';
import * as SlideLogic from './slide-logic';
import * as Animations from '../modules/animations';
import * as Arrows from '../modules/arrows';
import * as Dots from '../modules/dots';
import * as Keyboard from '../modules/keyboard';
import * as Touch from '../modules/touch';
import * as Lazy from '../modules/lazy';
import * as Responsive from '../modules/responsive';
import * as Accessibility from '../modules/accessibility';
import * as PublicMethods from './public-methods';
import { EventManager } from '../modules/events';
import * as DOM from '../utils/dom';
import { detectTransformSupport } from '../utils/css';
let instanceUid = 0;
export class Slick {
    constructor(element, settings) {
        this.animating = false;
        this.dragging = false;
        this.autoPlayTimer = null;
        this.currentDirection = 0;
        this.currentLeft = null;
        this.currentSlide = 0;
        this.direction = 1;
        this.$dots = null;
        this.listWidth = null;
        this.listHeight = null;
        this.loadIndex = 0;
        this.$nextArrow = null;
        this.$prevArrow = null;
        this.scrolling = false;
        this.slideCount = null;
        this.slideWidth = null;
        this.$slideTrack = null;
        this.$slides = [];
        this.sliding = false;
        this.slideOffset = 0;
        this.swipeLeft = null;
        this.swiping = false;
        this.$list = null;
        this.touchObject = {};
        this.transformsEnabled = false;
        this.unslicked = false;
        this.activeBreakpoint = null;
        this.animType = null;
        this.animProp = null;
        this.breakpoints = [];
        this.breakpointSettings = {};
        this.cssTransitions = false;
        this.focussed = false;
        this.interrupted = false;
        this.hidden = 'hidden';
        this.paused = true;
        this.positionProp = null;
        this.respondTo = null;
        this.rowCount = 1;
        this.shouldClick = true;
        this.$slidesCache = null;
        this.transformType = null;
        this.transitionType = null;
        this.visibilityChange = 'visibilitychange';
        this.windowWidth = 0;
        this.windowTimer = null;
        this.instanceUid = 0;
        this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
        this.isInitializing = false;
        this.inResponsiveRefresh = false;
        // Assign all methods from modules
        this.init = function (creation) {
            this.isInitializing = true;
            // Responsive refresh calls destroy(true) before init; make sure the new
            // instance starts as a live slider again.
            this.unslicked = false;
            this.animating = false;
            if (!DOM.hasClass(this.$slider, 'slick-initialized')) {
                DOM.addClass(this.$slider, 'slick-initialized');
                this.buildRows();
                this.buildOut();
                this.setProps();
                this.startLoad();
                this.loadSlider();
                this.initializeEvents();
                this.updateArrows();
                this.updateDots();
                this.checkResponsive(true);
                this.focusHandler();
            }
            if (creation) {
                EventManager.trigger(this.$slider, 'init', [this]);
            }
            if (this.options.accessibility === true) {
                this.initADA();
            }
            if (this.options.autoplay) {
                this.paused = false;
                this.autoPlay();
            }
            this.isInitializing = false;
        };
        // Core methods
        this.buildRows = function () {
            // Only build the multi-row structure when explicitly requested.
            // Leaving single-row sliders untouched preserves inline widths (needed for variableWidth).
            if (!(this.options.rows > 1 || this.options.slidesPerRow > 1)) {
                return;
            }
            if (this.options.rows > 0) {
                const slidesPerSection = this.options.slidesPerRow * this.options.rows;
                const originalSlides = DOM.children(this.$slider);
                const numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);
                const newSlides = document.createDocumentFragment();
                for (let a = 0; a < numOfSlides; a++) {
                    const slide = document.createElement('div');
                    for (let b = 0; b < this.options.rows; b++) {
                        const row = document.createElement('div');
                        for (let c = 0; c < this.options.slidesPerRow; c++) {
                            const target = (a * slidesPerSection + ((b * this.options.slidesPerRow) + c));
                            if (originalSlides[target]) {
                                row.appendChild(originalSlides[target]);
                            }
                        }
                        slide.appendChild(row);
                    }
                    newSlides.appendChild(slide);
                }
                DOM.empty(this.$slider);
                this.$slider.appendChild(newSlides);
                const rowChildren = DOM.find(this.$slider, 'div > div > div');
                rowChildren.forEach(child => {
                    DOM.setCSS(child, {
                        width: (100 / this.options.slidesPerRow) + '%',
                        display: 'inline-block'
                    });
                });
            }
        };
        this.buildOut = function () {
            const slideSelector = this.options.slide ?
                `${this.options.slide}:not(.slick-cloned)` : ':scope > :not(.slick-cloned)';
            this.$slides = DOM.find(this.$slider, slideSelector);
            this.$slides.forEach(slide => DOM.addClass(slide, 'slick-slide'));
            this.slideCount = this.$slides.length;
            this.$slides.forEach((slide, index) => {
                DOM.setAttributes(slide, { 'data-slick-index': String(index) });
                DOM.setData(slide, 'originalStyling', slide.getAttribute('style') || '');
            });
            DOM.addClass(this.$slider, 'slick-slider');
            if (this.slideCount === 0) {
                this.$slideTrack = document.createElement('div');
                DOM.addClass(this.$slideTrack, 'slick-track');
                this.$slider.appendChild(this.$slideTrack);
            }
            else {
                this.$slideTrack = DOM.wrapAll(this.$slides, '<div class="slick-track"></div>');
            }
            this.$list = DOM.wrap(this.$slideTrack, '<div class="slick-list"></div>');
            DOM.setCSS(this.$slideTrack, { opacity: '0' });
            if (this.options.centerMode === true || this.options.swipeToSlide === true) {
                this.options.slidesToScroll = 1;
            }
            const lazyImages = DOM.find(this.$slider, 'img[data-lazy]');
            lazyImages.forEach(img => {
                if (!img.getAttribute('src'))
                    DOM.addClass(img, 'slick-loading');
            });
            this.setupInfinite();
            this.buildArrows();
            this.buildDots();
            this.updateDots();
            this.setSlideClasses(typeof this.currentSlide === 'number' ? this.currentSlide : 0);
            if (this.options.draggable === true) {
                DOM.addClass(this.$list, 'draggable');
            }
        };
        this.setProps = function () {
            this.positionProp = this.options.vertical === true ? 'top' : 'left';
            if (this.positionProp === 'top') {
                DOM.addClass(this.$slider, 'slick-vertical');
            }
            else {
                DOM.removeClass(this.$slider, 'slick-vertical');
            }
            const transformSupport = detectTransformSupport();
            if (transformSupport.transition && this.options.useCSS === true) {
                this.cssTransitions = true;
            }
            if (this.options.fade) {
                if (typeof this.options.zIndex === 'number' && this.options.zIndex < 3) {
                    this.options.zIndex = 3;
                }
                else if (typeof this.options.zIndex !== 'number') {
                    this.options.zIndex = this.defaults.zIndex;
                }
            }
            this.animType = transformSupport.animType;
            this.transformType = transformSupport.transformType;
            this.transitionType = transformSupport.transitionType;
            this.transformsEnabled = this.options.useTransform && this.animType !== null && this.animType !== '';
        };
        this.registerBreakpoints = function () {
            const responsiveSettings = this.options.responsive || null;
            if (Array.isArray(responsiveSettings) && responsiveSettings.length) {
                this.respondTo = this.options.respondTo || 'window';
                for (const responsive of responsiveSettings) {
                    if (responsive.breakpoint) {
                        let l = this.breakpoints.length - 1;
                        while (l >= 0) {
                            if (this.breakpoints[l] === responsive.breakpoint) {
                                this.breakpoints.splice(l, 1);
                            }
                            l--;
                        }
                        this.breakpoints.push(responsive.breakpoint);
                        this.breakpointSettings[responsive.breakpoint] = responsive.settings;
                    }
                }
                this.breakpoints.sort((a, b) => this.options.mobileFirst ? a - b : b - a);
            }
        };
        // Import methods from modules
        this.setupInfinite = CoreMethods.setupInfinite;
        this.setSlideClasses = CoreMethods.setSlideClasses;
        this.startLoad = CoreMethods.startLoad;
        this.loadSlider = CoreMethods.loadSlider;
        this.initUI = CoreMethods.initUI;
        this.setDimensions = CoreMethods.setDimensions;
        this.setHeight = CoreMethods.setHeight;
        this.setPosition = CoreMethods.setPosition;
        this.resize = CoreMethods.resize;
        this.autoPlay = CoreMethods.autoPlay;
        this.autoPlayClear = function () {
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer);
            }
        };
        this.autoPlayIterator = CoreMethods.autoPlayIterator;
        this.lazyLoad = Lazy.lazyLoad;
        this.progressiveLazyLoad = Lazy.progressiveLazyLoad;
        this.getLeft = SlideLogic.getLeft;
        this.slideHandler = SlideLogic.slideHandler;
        this.postSlide = SlideLogic.postSlide;
        this.changeSlide = SlideLogic.changeSlide;
        this.selectHandler = SlideLogic.selectHandler;
        this.getNavTarget = SlideLogic.getNavTarget;
        this.asNavFor = SlideLogic.asNavFor;
        this.initializeEvents = SlideLogic.initializeEvents;
        // Animation methods
        this.animateSlide = Animations.animateSlide;
        this.animateHeight = Animations.animateHeight;
        this.applyTransition = Animations.applyTransition;
        this.disableTransition = Animations.disableTransition;
        this.fadeSlide = Animations.fadeSlide;
        this.fadeSlideOut = Animations.fadeSlideOut;
        this.setCSS = Animations.setCSS;
        this.setFade = Animations.setFade;
        // Navigation methods
        this.buildArrows = Arrows.buildArrows;
        this.updateArrows = Arrows.updateArrows;
        this.initArrowEvents = Arrows.initArrowEvents;
        this.buildDots = Dots.buildDots;
        this.updateDots = Dots.updateDots;
        this.getDotCount = Dots.getDotCount;
        this.initDotEvents = Dots.initDotEvents;
        this.interrupt = Dots.interrupt;
        this.keyHandler = Keyboard.keyHandler;
        // Touch methods
        this.swipeHandler = Touch.swipeHandler;
        this.swipeStart = Touch.swipeStart;
        this.swipeMove = Touch.swipeMove;
        this.swipeEnd = Touch.swipeEnd;
        this.swipeDirection = Touch.swipeDirection;
        this.getSlideCount = Touch.getSlideCount;
        this.checkNavigable = Touch.checkNavigable;
        this.getNavigableIndexes = Touch.getNavigableIndexes;
        this.dragHandler = function (_event) { };
        // Responsive
        this.checkResponsive = Responsive.checkResponsive;
        // Accessibility
        this.initADA = Accessibility.initADA;
        this.activateADA = Accessibility.activateADA;
        this.focusHandler = Accessibility.focusHandler;
        // Public methods
        this.slickAdd = PublicMethods.slickAdd;
        this.addSlide = PublicMethods.slickAdd;
        this.slickRemove = PublicMethods.slickRemove;
        this.removeSlide = PublicMethods.slickRemove;
        this.slickFilter = PublicMethods.slickFilter;
        this.filterSlides = PublicMethods.slickFilter;
        this.slickUnfilter = PublicMethods.slickUnfilter;
        this.unfilterSlides = PublicMethods.slickUnfilter;
        this.slickSetOption = PublicMethods.slickSetOption;
        this.setOption = PublicMethods.slickSetOption;
        this.unload = PublicMethods.unload;
        this.destroy = PublicMethods.destroy;
        this.cleanUpRows = PublicMethods.cleanUpRows;
        this.cleanUpEvents = PublicMethods.cleanUpEvents;
        this.reinit = PublicMethods.reinit;
        this.cleanUpSlideEvents = PublicMethods.cleanUpSlideEvents;
        this.initSlideEvents = PublicMethods.initSlideEvents;
        this.refresh = PublicMethods.refresh;
        this.goTo = this.slickGoTo;
        this.next = this.slickNext;
        this.prev = this.slickPrev;
        this.pause = this.slickPause;
        this.play = this.slickPlay;
        this.getCurrent = this.slickCurrentSlide;
        this.getOption = this.slickGetOption;
        this.defaults = Object.assign({}, defaultOptions);
        Object.assign(this, initialState);
        this.$slider = element;
        this.$slidesCache = null;
        this.instanceUid = instanceUid++;
        this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
        // Prefer Slicker-branded settings while keeping legacy data for compatibility
        const dataSettings = DOM.getData(element, 'slicker') || DOM.getData(element, 'slick') || {};
        this.options = Object.assign(Object.assign(Object.assign({}, this.defaults), settings), dataSettings);
        if (this.options.appendArrows == null) {
            this.options.appendArrows = this.$slider;
        }
        if (this.options.appendDots == null) {
            this.options.appendDots = this.$slider;
        }
        this.currentSlide = this.options.initialSlide;
        this.originalSettings = Object.assign({}, this.options);
        // Bind methods
        this.boundAutoPlay = this.autoPlay.bind(this);
        this.boundAutoPlayClear = this.autoPlayClear.bind(this);
        this.boundAutoPlayIterator = this.autoPlayIterator.bind(this);
        this.boundChangeSlide = this.changeSlide.bind(this);
        this.boundClickHandler = this.clickHandler.bind(this);
        this.boundSelectHandler = this.selectHandler.bind(this);
        this.boundSetPosition = this.setPosition.bind(this);
        this.boundSwipeHandler = this.swipeHandler.bind(this);
        this.boundDragHandler = this.dragHandler.bind(this);
        this.boundKeyHandler = this.keyHandler.bind(this);
        this.boundResize = this.resize.bind(this);
        this.boundOrientationChange = this.orientationChange.bind(this);
        this.boundVisibility = this.visibility.bind(this);
        this.preventDefault = PublicMethods.preventDefault.bind(this);
        this.registerBreakpoints();
        this.init(true);
    }
    // Simple getters
    slickGoTo(slide, dontAnimate) {
        this.changeSlide({ data: { message: 'index', index: parseInt(String(slide)) } }, dontAnimate);
    }
    slickNext() {
        this.changeSlide({ data: { message: 'next' } });
    }
    slickPrev() {
        this.changeSlide({ data: { message: 'previous' } });
    }
    slickPause() {
        this.autoPlayClear();
        this.paused = true;
    }
    slickPlay() {
        this.autoPlay();
        this.options.autoplay = true;
        this.paused = false;
        this.focussed = false;
        this.interrupted = false;
    }
    slickCurrentSlide() {
        return this.currentSlide;
    }
    slickGetOption(option) {
        return this.options[option];
    }
    getSlick() {
        return this;
    }
    unslick(fromBreakpoint) {
        EventManager.trigger(this.$slider, 'unslick', [this, fromBreakpoint]);
        this.destroy();
    }
    clickHandler(event) {
        if (this.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }
    }
    orientationChange() {
        this.checkResponsive();
        this.setPosition();
    }
    visibility() {
        if (this.options.autoplay) {
            const doc = document;
            this.interrupted = doc[this.hidden] === true;
        }
    }
}
