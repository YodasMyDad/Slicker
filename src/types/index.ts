/**
 * Slicker Carousel TypeScript Definitions
 * Vanilla JS rewrite - no jQuery dependency
 */

export type ResponsiveBreakpoint = 'window' | 'slider' | 'min';
export type LazyLoadType = 'ondemand' | 'progressive' | 'anticipated';
export type EasingType = 'linear' | 'swing' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface ResponsiveSettings {
  breakpoint: number;
  settings: Partial<SlickOptions> | 'unslick';
}

export interface SlickOptions {
  accessibility: boolean;
  adaptiveHeight: boolean;
  appendArrows: HTMLElement | string;
  appendDots: HTMLElement | string;
  arrows: boolean;
  asNavFor: HTMLElement | string | null;
  prevArrow: string | HTMLElement;
  nextArrow: string | HTMLElement;
  autoplay: boolean;
  autoplaySpeed: number;
  centerMode: boolean;
  centerPadding: string;
  cssEase: string;
  customPaging: (slider: any, i: number) => HTMLElement;
  dots: boolean;
  dotsClass: string;
  draggable: boolean;
  easing: EasingType;
  edgeFriction: number;
  fade: boolean;
  focusOnSelect: boolean;
  focusOnChange: boolean;
  infinite: boolean;
  initialSlide: number;
  lazyLoad: LazyLoadType;
  mobileFirst: boolean;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  pauseOnDotsHover: boolean;
  respondTo: ResponsiveBreakpoint;
  responsive: ResponsiveSettings[] | null;
  rows: number;
  rtl: boolean;
  slide: string;
  slidesPerRow: number;
  slidesToShow: number;
  slidesToScroll: number;
  speed: number;
  swipe: boolean;
  swipeToSlide: boolean;
  touchMove: boolean;
  touchThreshold: number;
  useCSS: boolean;
  useTransform: boolean;
  variableWidth: boolean;
  vertical: boolean;
  verticalSwiping: boolean;
  waitForAnimate: boolean;
  zIndex: number;
}

export interface SlickState {
  animating: boolean;
  dragging: boolean;
  autoPlayTimer: number | null;
  currentDirection: number;
  currentLeft: number | null;
  currentSlide: number;
  direction: number;
  $dots: HTMLElement | null;
  listWidth: number | null;
  listHeight: number | null;
  loadIndex: number;
  $nextArrow: HTMLElement | null;
  $prevArrow: HTMLElement | null;
  scrolling: boolean;
  slideCount: number | null;
  slideWidth: number | null;
  $slideTrack: HTMLElement | null;
  $slides: HTMLElement[];
  sliding: boolean;
  slideOffset: number;
  swipeLeft: number | null;
  swiping: boolean;
  $list: HTMLElement | null;
  touchObject: TouchObject;
  transformsEnabled: boolean;
  unslicked: boolean;
}

export interface TouchObject {
  startX?: number;
  startY?: number;
  curX?: number;
  curY?: number;
  fingerCount?: number;
  minSwipe?: number;
  swipeLength?: number;
  edgeHit?: boolean;
}

export interface SlickBreakpointSettings {
  [breakpoint: number]: Partial<SlickOptions> | 'unslick';
}

export interface SlickInstance {
  // Internal properties
  defaults: SlickOptions;
  options: SlickOptions;
  originalSettings: SlickOptions;
  
  // State
  activeBreakpoint: number | null;
  animType: string | null;
  animProp: string | null;
  breakpoints: number[];
  breakpointSettings: SlickBreakpointSettings;
  cssTransitions: boolean;
  focussed: boolean;
  interrupted: boolean;
  hidden: string;
  paused: boolean;
  positionProp: string | null;
  respondTo: ResponsiveBreakpoint | null;
  rowCount: number;
  shouldClick: boolean;
  $slider: HTMLElement;
  $slidesCache: HTMLElement[] | null;
  transformType: string | null;
  transitionType: string | null;
  visibilityChange: string;
  windowWidth: number;
  windowTimer: number | null;
  instanceUid: number;
  htmlExpr: RegExp;
  
  // Public methods
  slickAdd(markup: string | HTMLElement, index?: number | boolean, addBefore?: boolean): void;
  addSlide(markup: string | HTMLElement, index?: number | boolean, addBefore?: boolean): void;
  slickRemove(index: number | boolean, removeBefore?: boolean, removeAll?: boolean): boolean | void;
  removeSlide(index: number | boolean, removeBefore?: boolean, removeAll?: boolean): boolean | void;
  slickFilter(filter: string | ((index: number, element: HTMLElement) => boolean)): void;
  filterSlides(filter: string | ((index: number, element: HTMLElement) => boolean)): void;
  slickUnfilter(): void;
  unfilterSlides(): void;
  slickGoTo(slide: number, dontAnimate?: boolean): void;
  goTo(slide: number, dontAnimate?: boolean): void;
  slickNext(): void;
  next(): void;
  slickPrev(): void;
  prev(): void;
  slickPause(): void;
  pause(): void;
  slickPlay(): void;
  play(): void;
  slickCurrentSlide(): number;
  getCurrent(): number;
  slickGetOption(option: keyof SlickOptions): any;
  getOption(option: keyof SlickOptions): any;
  slickSetOption(option: string | Partial<SlickOptions>, value?: any, refresh?: boolean): void;
  setOption(option: string | Partial<SlickOptions>, value?: any, refresh?: boolean): void;
  getSlick(): SlickInstance;
  unslick(fromBreakpoint?: number): void;
  destroy(refresh?: boolean): void;
  refresh(initializing?: boolean): void;
  reinit(): void;
  
  // Internal methods (partial list - these won't be in public API but needed for typing)
  init(creation?: boolean): void;
  setPosition(): void;
  slideHandler(index: number, sync?: boolean, dontAnimate?: boolean): void;
}

export interface EventDetail {
  slick: SlickInstance;
  [key: string]: any;
}

export interface SlickEvent extends CustomEvent<EventDetail> {
  detail: EventDetail;
}

// Event handler types
export type SlickEventHandler = (event: SlickEvent) => void;

// Export main class type for external use
export type SlickConstructor = {
  new (element: HTMLElement, options?: Partial<SlickOptions>): SlickInstance;
  init(selector: string | HTMLElement, options?: Partial<SlickOptions>): SlickInstance | SlickInstance[];
};

// Slicker-branded aliases for the rewritten library
export type SlickerOptions = SlickOptions;
export type SlickerState = SlickState;
export type SlickerBreakpointSettings = SlickBreakpointSettings;
export type SlickerInstance = SlickInstance;
export type SlickerEvent = SlickEvent;
export type SlickerEventHandler = SlickEventHandler;
export type SlickerConstructor = SlickConstructor;

