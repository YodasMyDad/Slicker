/**
 * Complete Slicker Carousel class (Slick-compatible)
 * Imports all modules and methods
 */

import type { SlickOptions, TouchObject, SlickBreakpointSettings } from '../types';
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
  // Properties (same as before)
  public defaults: SlickOptions;
  public options: SlickOptions;
  public originalSettings: SlickOptions;
  public animating: boolean = false;
  public dragging: boolean = false;
  public autoPlayTimer: number | null = null;
  public currentDirection: number = 0;
  public currentLeft: number | null = null;
  public currentSlide: number = 0;
  public direction: number = 1;
  public $dots: HTMLElement | null = null;
  public listWidth: number | null = null;
  public listHeight: number | null = null;
  public loadIndex: number = 0;
  public $nextArrow: HTMLElement | null = null;
  public $prevArrow: HTMLElement | null = null;
  public scrolling: boolean = false;
  public slideCount: number | null = null;
  public slideWidth: number | null = null;
  public $slideTrack: HTMLElement | null = null;
  public $slides: HTMLElement[] = [];
  public sliding: boolean = false;
  public slideOffset: number = 0;
  public swipeLeft: number | null = null;
  public swiping: boolean = false;
  public $list: HTMLElement | null = null;
  public touchObject: TouchObject = {};
  public transformsEnabled: boolean = false;
  public unslicked: boolean = false;
  public activeBreakpoint: number | null = null;
  public animType: string | null = null;
  public animProp: string | null = null;
  public breakpoints: number[] = [];
  public breakpointSettings: SlickBreakpointSettings = {};
  public cssTransitions: boolean = false;
  public focussed: boolean = false;
  public interrupted: boolean = false;
  public hidden: string = 'hidden';
  public paused: boolean = true;
  public positionProp: string | null = null;
  public respondTo: 'window' | 'slider' | 'min' | null = null;
  public rowCount: number = 1;
  public shouldClick: boolean = true;
  public $slider: HTMLElement;
  public $slidesCache: HTMLElement[] | null = null;
  public transformType: string | null = null;
  public transitionType: string | null = null;
  public visibilityChange: string = 'visibilitychange';
  public windowWidth: number = 0;
  public windowTimer: number | null = null;
  public instanceUid: number = 0;
  public htmlExpr: RegExp = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
  public isInitializing: boolean = false;
  public inResponsiveRefresh: boolean = false;
  
  // Bound methods - public so they can be accessed by event handlers
  public boundAutoPlay!: () => void;
  public boundAutoPlayClear!: () => void;
  public boundAutoPlayIterator!: () => void;
  public boundChangeSlide!: (event: Event, dontAnimate?: boolean) => void;
  public boundClickHandler!: (event: Event) => void;
  public boundSelectHandler!: (event: Event) => void;
  public boundSetPosition!: () => void;
  public boundSwipeHandler!: (event: Event) => void;
  public boundDragHandler!: (event: Event) => void;
  public boundKeyHandler!: (event: KeyboardEvent) => void;
  public boundResize!: () => void;
  public boundOrientationChange!: () => void;
  public boundVisibility!: () => void;
  public preventDefault!: (event: Event) => void;
  
  constructor(element: HTMLElement, settings?: Partial<SlickOptions>) {
    this.defaults = { ...defaultOptions };
    Object.assign(this, initialState);
    
    this.$slider = element;
    this.$slidesCache = null;
    this.instanceUid = instanceUid++;
    this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
    
    // Prefer Slicker-branded settings while keeping legacy data for compatibility
    const dataSettings = DOM.getData(element, 'slicker') || DOM.getData(element, 'slick') || {};
    this.options = { ...this.defaults, ...settings, ...dataSettings };
    
    if (this.options.appendArrows == null) {
      this.options.appendArrows = this.$slider;
    }
    if (this.options.appendDots == null) {
      this.options.appendDots = this.$slider;
    }
    
    this.currentSlide = this.options.initialSlide;
    this.originalSettings = { ...this.options };
    
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
  
  // Assign all methods from modules
  init = function(this: Slick, creation?: boolean) {
    this.isInitializing = true;
    
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
  buildRows = function(this: Slick) {
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
  
  buildOut = function(this: Slick) {
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
    } else {
      this.$slideTrack = DOM.wrapAll(this.$slides, '<div class="slick-track"></div>');
    }
    this.$list = DOM.wrap(this.$slideTrack, '<div class="slick-list"></div>');
    DOM.setCSS(this.$slideTrack, { opacity: '0' });
    if (this.options.centerMode === true || this.options.swipeToSlide === true) {
      this.options.slidesToScroll = 1;
    }
    const lazyImages = DOM.find(this.$slider, 'img[data-lazy]');
    lazyImages.forEach(img => {
      if (!img.getAttribute('src')) DOM.addClass(img, 'slick-loading');
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
  
  setProps = function(this: Slick) {
    this.positionProp = this.options.vertical === true ? 'top' : 'left';
    if (this.positionProp === 'top') {
      DOM.addClass(this.$slider, 'slick-vertical');
    } else {
      DOM.removeClass(this.$slider, 'slick-vertical');
    }
    const transformSupport = detectTransformSupport();
    if (transformSupport.transition && this.options.useCSS === true) {
      this.cssTransitions = true;
    }
    if (this.options.fade) {
      if (typeof this.options.zIndex === 'number' && this.options.zIndex < 3) {
        this.options.zIndex = 3;
      } else if (typeof this.options.zIndex !== 'number') {
        this.options.zIndex = this.defaults.zIndex;
      }
    }
    this.animType = transformSupport.animType;
    this.transformType = transformSupport.transformType;
    this.transitionType = transformSupport.transitionType;
    this.transformsEnabled = this.options.useTransform && this.animType !== null && this.animType !== '';
  };
  
  registerBreakpoints = function(this: Slick) {
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
  setupInfinite = CoreMethods.setupInfinite;
  setSlideClasses = CoreMethods.setSlideClasses;
  startLoad = CoreMethods.startLoad;
  loadSlider = CoreMethods.loadSlider;
  initUI = CoreMethods.initUI;
  setDimensions = CoreMethods.setDimensions;
  setHeight = CoreMethods.setHeight;
  setPosition = CoreMethods.setPosition;
  resize = CoreMethods.resize;
  autoPlay = CoreMethods.autoPlay;
  autoPlayClear = function(this: Slick) {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  };
  autoPlayIterator = CoreMethods.autoPlayIterator;
  lazyLoad = Lazy.lazyLoad;
  progressiveLazyLoad = Lazy.progressiveLazyLoad;
  getLeft = SlideLogic.getLeft;
  slideHandler = SlideLogic.slideHandler;
  postSlide = SlideLogic.postSlide;
  changeSlide = SlideLogic.changeSlide;
  selectHandler = SlideLogic.selectHandler;
  getNavTarget = SlideLogic.getNavTarget;
  asNavFor = SlideLogic.asNavFor;
  initializeEvents = SlideLogic.initializeEvents;
  
  // Animation methods
  animateSlide = Animations.animateSlide;
  animateHeight = Animations.animateHeight;
  applyTransition = Animations.applyTransition;
  disableTransition = Animations.disableTransition;
  fadeSlide = Animations.fadeSlide;
  fadeSlideOut = Animations.fadeSlideOut;
  setCSS = Animations.setCSS;
  setFade = Animations.setFade;
  
  // Navigation methods
  buildArrows = Arrows.buildArrows;
  updateArrows = Arrows.updateArrows;
  initArrowEvents = Arrows.initArrowEvents;
  buildDots = Dots.buildDots;
  updateDots = Dots.updateDots;
  getDotCount = Dots.getDotCount;
  initDotEvents = Dots.initDotEvents;
  interrupt = Dots.interrupt;
  keyHandler = Keyboard.keyHandler;
  
  // Touch methods
  swipeHandler = Touch.swipeHandler;
  swipeStart = Touch.swipeStart;
  swipeMove = Touch.swipeMove;
  swipeEnd = Touch.swipeEnd;
  swipeDirection = Touch.swipeDirection;
  getSlideCount = Touch.getSlideCount;
  checkNavigable = Touch.checkNavigable;
  getNavigableIndexes = Touch.getNavigableIndexes;
  dragHandler = function(this: Slick, _event: Event) { };
  
  // Responsive
  checkResponsive = Responsive.checkResponsive;
  
  // Accessibility
  initADA = Accessibility.initADA;
  activateADA = Accessibility.activateADA;
  focusHandler = Accessibility.focusHandler;
  
  // Public methods
  slickAdd = PublicMethods.slickAdd;
  addSlide = PublicMethods.slickAdd;
  slickRemove = PublicMethods.slickRemove;
  removeSlide = PublicMethods.slickRemove;
  slickFilter = PublicMethods.slickFilter;
  filterSlides = PublicMethods.slickFilter;
  slickUnfilter = PublicMethods.slickUnfilter;
  unfilterSlides = PublicMethods.slickUnfilter;
  slickSetOption = PublicMethods.slickSetOption;
  setOption = PublicMethods.slickSetOption;
  unload = PublicMethods.unload;
  destroy = PublicMethods.destroy;
  cleanUpRows = PublicMethods.cleanUpRows;
  cleanUpEvents = PublicMethods.cleanUpEvents;
  reinit = PublicMethods.reinit;
  cleanUpSlideEvents = PublicMethods.cleanUpSlideEvents;
  initSlideEvents = PublicMethods.initSlideEvents;
  refresh = PublicMethods.refresh;
  
  // Simple getters
  slickGoTo(slide: number, dontAnimate?: boolean) {
    (this.changeSlide as any)({ data: { message: 'index', index: parseInt(String(slide)) } }, dontAnimate);
  }
  goTo = this.slickGoTo;
  
  slickNext() {
    (this.changeSlide as any)({ data: { message: 'next' } });
  }
  next = this.slickNext;
  
  slickPrev() {
    (this.changeSlide as any)({ data: { message: 'previous' } });
  }
  prev = this.slickPrev;
  
  slickPause() {
    this.autoPlayClear();
    this.paused = true;
  }
  pause = this.slickPause;
  
  slickPlay() {
    this.autoPlay();
    this.options.autoplay = true;
    this.paused = false;
    this.focussed = false;
    this.interrupted = false;
  }
  play = this.slickPlay;
  
  slickCurrentSlide() {
    return this.currentSlide;
  }
  getCurrent = this.slickCurrentSlide;
  
  slickGetOption(option: keyof SlickOptions) {
    return this.options[option];
  }
  getOption = this.slickGetOption;
  
  getSlick() {
    return this;
  }
  
  unslick(fromBreakpoint?: number) {
    EventManager.trigger(this.$slider, 'unslick', [this, fromBreakpoint]);
    this.destroy();
  }
  
  clickHandler(event: Event) {
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
      const doc = document as any;
      this.interrupted = doc[this.hidden] === true;
    }
  }
}

