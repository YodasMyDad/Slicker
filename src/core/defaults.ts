import type { SlickOptions } from '../types';

/**
 * Default Slick options
 * Matches original jQuery Slick configuration
 */
export const defaultOptions: SlickOptions = {
  accessibility: true,
  adaptiveHeight: false,
  appendArrows: null as any, // Will be set to slider element in constructor
  appendDots: null as any, // Will be set to slider element in constructor
  arrows: true,
  asNavFor: null,
  prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
  nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
  autoplay: false,
  autoplaySpeed: 3000,
  centerMode: false,
  centerPadding: '50px',
  cssEase: 'ease',
  customPaging: (_slider: any, i: number): HTMLElement => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(i + 1);
    return button;
  },
  dots: false,
  dotsClass: 'slick-dots',
  draggable: true,
  easing: 'linear',
  edgeFriction: 0.35,
  fade: false,
  focusOnSelect: false,
  focusOnChange: false,
  infinite: true,
  initialSlide: 0,
  lazyLoad: 'ondemand',
  mobileFirst: false,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnDotsHover: false,
  respondTo: 'window',
  responsive: null,
  rows: 1,
  rtl: false,
  slide: '',
  slidesPerRow: 1,
  slidesToShow: 1,
  slidesToScroll: 1,
  speed: 500,
  swipe: true,
  swipeToSlide: false,
  touchMove: true,
  touchThreshold: 5,
  useCSS: true,
  useTransform: true,
  variableWidth: false,
  vertical: false,
  verticalSwiping: false,
  waitForAnimate: true,
  zIndex: 1000
};

/**
 * Initial state values
 */
export const initialState = {
  animating: false,
  dragging: false,
  autoPlayTimer: null,
  currentDirection: 0,
  currentLeft: null,
  currentSlide: 0,
  direction: 1,
  $dots: null,
  listWidth: null,
  listHeight: null,
  loadIndex: 0,
  $nextArrow: null,
  $prevArrow: null,
  scrolling: false,
  slideCount: null,
  slideWidth: null,
  $slideTrack: null,
  $slides: [],
  sliding: false,
  slideOffset: 0,
  swipeLeft: null,
  swiping: false,
  $list: null,
  touchObject: {},
  transformsEnabled: false,
  unslicked: false
};

