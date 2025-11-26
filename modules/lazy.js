/**
 * Lazy Loading Module
 * Handles lazy image loading
 */
import * as DOM from '../utils/dom';
import { EventManager } from './events';
/**
 * Lazy load images
 */
export function lazyLoad() {
    const _ = this;
    let rangeStart;
    let rangeEnd;
    function loadImages(imagesScope) {
        imagesScope.forEach(scope => {
            const images = DOM.find(scope, 'img[data-lazy]');
            images.forEach(image => {
                const imageSource = image.getAttribute('data-lazy');
                const imageSrcSet = image.getAttribute('data-srcset');
                const imageSizes = image.getAttribute('data-sizes') || _.$slider.getAttribute('data-sizes');
                const imageToLoad = document.createElement('img');
                imageToLoad.onload = () => {
                    DOM.setCSS(image, { opacity: '0' });
                    setTimeout(() => {
                        if (imageSrcSet) {
                            image.setAttribute('srcset', imageSrcSet);
                            if (imageSizes) {
                                image.setAttribute('sizes', imageSizes);
                            }
                        }
                        image.setAttribute('src', imageSource || '');
                        DOM.setCSS(image, { opacity: '1' });
                        setTimeout(() => {
                            DOM.removeAttributes(image, 'data-lazy', 'data-srcset', 'data-sizes');
                            DOM.removeClass(image, 'slick-loading');
                        }, 200);
                        EventManager.trigger(_.$slider, 'lazyLoaded', [_, image, imageSource]);
                    }, 100);
                };
                imageToLoad.onerror = () => {
                    DOM.removeAttributes(image, 'data-lazy');
                    DOM.removeClass(image, 'slick-loading');
                    DOM.addClass(image, 'slick-lazyload-error');
                    EventManager.trigger(_.$slider, 'lazyLoadError', [_, image, imageSource]);
                };
                imageToLoad.src = imageSource || '';
            });
        });
    }
    if (_.options.centerMode === true) {
        if (_.options.infinite === true) {
            rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
            rangeEnd = rangeStart + _.options.slidesToShow + 2;
        }
        else {
            rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
            rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
        }
    }
    else {
        rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
        rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
        if (_.options.fade === true) {
            if (rangeStart > 0)
                rangeStart--;
            if (rangeEnd <= _.slideCount)
                rangeEnd++;
        }
    }
    const allSlides = DOM.find(_.$slider, '.slick-slide');
    const loadRange = allSlides.slice(rangeStart, rangeEnd);
    if (_.options.lazyLoad === 'anticipated') {
        let prevSlide = rangeStart - 1;
        let nextSlide = rangeEnd;
        for (let i = 0; i < _.options.slidesToScroll; i++) {
            if (prevSlide < 0)
                prevSlide = _.slideCount - 1;
            if (allSlides[prevSlide])
                loadRange.push(allSlides[prevSlide]);
            if (allSlides[nextSlide])
                loadRange.push(allSlides[nextSlide]);
            prevSlide--;
            nextSlide++;
        }
    }
    loadImages(loadRange);
    if (_.slideCount <= _.options.slidesToShow) {
        const cloneRange = DOM.find(_.$slider, '.slick-slide');
        loadImages(cloneRange);
    }
    else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
        const clonedSlides = DOM.find(_.$slider, '.slick-cloned');
        const cloneRange = clonedSlides.slice(0, _.options.slidesToShow);
        loadImages(cloneRange);
    }
    else if (_.currentSlide === 0) {
        const clonedSlides = DOM.find(_.$slider, '.slick-cloned');
        const cloneRange = clonedSlides.slice(_.options.slidesToShow * -1);
        loadImages(cloneRange);
    }
}
/**
 * Progressive lazy load
 */
export function progressiveLazyLoad(tryCount = 1) {
    const _ = this;
    const imgsToLoad = DOM.find(_.$slider, 'img[data-lazy]');
    if (imgsToLoad.length) {
        const image = imgsToLoad[0];
        const imageSource = image.getAttribute('data-lazy');
        const imageSrcSet = image.getAttribute('data-srcset');
        const imageSizes = image.getAttribute('data-sizes') || _.$slider.getAttribute('data-sizes');
        const imageToLoad = document.createElement('img');
        imageToLoad.onload = () => {
            if (imageSrcSet) {
                image.setAttribute('srcset', imageSrcSet);
                if (imageSizes) {
                    image.setAttribute('sizes', imageSizes);
                }
            }
            image.setAttribute('src', imageSource || '');
            DOM.removeAttributes(image, 'data-lazy', 'data-srcset', 'data-sizes');
            DOM.removeClass(image, 'slick-loading');
            if (_.options.adaptiveHeight === true) {
                _.setPosition();
            }
            EventManager.trigger(_.$slider, 'lazyLoaded', [_, image, imageSource]);
            _.progressiveLazyLoad();
        };
        imageToLoad.onerror = () => {
            if (tryCount < 3) {
                setTimeout(() => {
                    _.progressiveLazyLoad(tryCount + 1);
                }, 500);
            }
            else {
                DOM.removeAttributes(image, 'data-lazy');
                DOM.removeClass(image, 'slick-loading');
                DOM.addClass(image, 'slick-lazyload-error');
                EventManager.trigger(_.$slider, 'lazyLoadError', [_, image, imageSource]);
                _.progressiveLazyLoad();
            }
        };
        imageToLoad.src = imageSource || '';
    }
    else {
        EventManager.trigger(_.$slider, 'allImagesLoaded', [_]);
    }
}
