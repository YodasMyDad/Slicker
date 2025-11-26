import type { SlickOptions } from '../types';
/**
 * Default Slick options
 * Matches original jQuery Slick configuration
 */
export declare const defaultOptions: SlickOptions;
/**
 * Initial state values
 */
export declare const initialState: {
    animating: boolean;
    dragging: boolean;
    autoPlayTimer: null;
    currentDirection: number;
    currentLeft: null;
    currentSlide: number;
    direction: number;
    $dots: null;
    listWidth: null;
    listHeight: null;
    loadIndex: number;
    $nextArrow: null;
    $prevArrow: null;
    scrolling: boolean;
    slideCount: null;
    slideWidth: null;
    $slideTrack: null;
    $slides: never[];
    sliding: boolean;
    slideOffset: number;
    swipeLeft: null;
    swiping: boolean;
    $list: null;
    touchObject: {};
    transformsEnabled: boolean;
    unslicked: boolean;
};
