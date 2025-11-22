# Slicker Carousel
**Version 1.0.0** - Vanilla TypeScript rewrite with zero dependencies

## About This Version

Slicker is the modern TypeScript rewrite of Ken Wheeler's Slick carousel (Credits and links below). It keeps every feature, removes the jQuery requirement, and ships both ES modules and UMD builds with a single unified CSS file. The original jQuery distribution is preserved untouched in `slick/` (CSS + JS) for legacy projects and reference.

- No dependencies - no jQuery required
- Modern JavaScript (ES6+) with TypeScript types included
- Smaller bundles and faster performance via native DOM APIs
- Single CSS file combining core and theme styles
- Same API surface as the original Slick

---

## Quick Start

### 1. Include CSS (single unified stylesheet)
```html
<link rel="stylesheet" href="dist/slicker.css">
```

### 2. Include JavaScript
```html
<!-- Slicker version (no jQuery needed) -->
<script src="dist/slicker.js"></script>
```

### 3. Initialize
```html
<div class="my-slider">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>

<script>
  var slider = Slicker.init('.my-slider', {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  });
</script>
```

---

## Installation

### ES Module
```javascript
import Slicker from './dist/slicker.esm.js';

const slider = Slicker.init('.slider', {
  dots: true,
  arrows: true
});
```

### TypeScript
```typescript
import Slicker, { SlickerOptions } from './dist';

const options: Partial<SlickerOptions> = {
  dots: true,
  slidesToShow: 3
};

const slider = Slicker.init('.slider', options);
```

### Browser Global (UMD)
```html
<script src="dist/slicker.js"></script>
<script>
  var slider = Slicker.init('.slider', { 
    dots: true,
    arrows: true  // enabled by default
  });
</script>
```

---

## Migration from jQuery Slick

### Before (jQuery Slick)
```javascript
$('.slider').slick({
  dots: true,
  arrows: true
});

$('.slider').slick('slickNext');
$('.slider').on('afterChange', function(event, slick, currentSlide) {
  console.log(currentSlide);
});
```

### After (Slicker)
```javascript
var slider = Slicker.init('.slider', {
  dots: true,
  arrows: true
});

slider.slickNext();
document.querySelector('.slider').addEventListener('afterChange', function(e) {
  console.log(e.detail[1]); // currentSlide
});
```

All original options behave the same; the global name and import paths now use Slicker. The legacy jQuery bundle is still available in `slick/` if you need it.

---

## Settings

All original Slick options are supported by Slicker:

Option | Type | Default | Description
------ | ---- | ------- | -----------
accessibility | boolean | true | Enables tabbing and arrow key navigation
adaptiveHeight | boolean | false | Adapts slider height to the current slide
appendArrows | HTMLElement\|string | element | Where navigation arrows are attached
appendDots | HTMLElement\|string | element | Where navigation dots are attached
arrows | boolean | true | Enable Next/Prev arrows
asNavFor | HTMLElement\|string | null | Enables syncing of multiple sliders
autoplay | boolean | false | Enables auto play of slides
autoplaySpeed | int | 3000 | Auto play change interval
centerMode | boolean | false | Enables centered view with partial prev/next slides
centerPadding | string | '50px' | Side padding when in center mode (px or %)
cssEase | string | 'ease' | CSS3 easing
customPaging | function | n/a | Custom paging templates
dots | boolean | false | Current slide indicator dots
dotsClass | string | 'slick-dots' | Class for slide indicator dots container
draggable | boolean | true | Enables desktop dragging
easing | string | 'linear' | Fallback easing
edgeFriction | number | 0.35 | Resistance when swiping edges of non-infinite carousels
fade | boolean | false | Enables fade
focusOnSelect | boolean | false | Enable focus on selected element (click)
focusOnChange | boolean | false | Puts focus on slide after change
infinite | boolean | true | Infinite looping
initialSlide | integer | 0 | Slide to start on
lazyLoad | string | 'ondemand' | 'ondemand', 'progressive', or 'anticipated'
mobileFirst | boolean | false | Responsive settings use mobile first calculation
nextArrow | string\|HTMLElement | `<button...>Next</button>` | Customize the "Next" arrow
pauseOnDotsHover | boolean | false | Pauses autoplay when a dot is hovered
pauseOnFocus | boolean | true | Pauses autoplay when slider is focused
pauseOnHover | boolean | true | Pauses autoplay on hover
prevArrow | string\|HTMLElement | `<button...>Previous</button>` | Customize the "Previous" arrow
respondTo | string | 'window' | 'window', 'slider' or 'min'
responsive | array | null | Array of breakpoint settings objects
rows | int | 1 | Grid mode - number of rows
rtl | boolean | false | Change direction to right-to-left
slide | string | '' | Slide element query
slidesPerRow | int | 1 | Slides per row in grid mode
slidesToScroll | int | 1 | Number of slides to scroll at a time
slidesToShow | int | 1 | Number of slides to show at a time
speed | int | 500 | Transition speed (ms)
swipe | boolean | true | Enables touch swipe
swipeToSlide | boolean | false | Swipe to slide irrespective of slidesToScroll
touchMove | boolean | true | Enables slide moving with touch
touchThreshold | int | 5 | Swipe distance threshold
useCSS | boolean | true | Enable/Disable CSS Transitions
useTransform | boolean | true | Enable/Disable CSS Transforms
variableWidth | boolean | false | Disables automatic slide width calculation
vertical | boolean | false | Vertical slide direction
verticalSwiping | boolean | false | Changes swipe direction to vertical
waitForAnimate | boolean | true | Ignores requests to advance slide while animating
zIndex | number | 1000 | Set the zIndex values for slides

---

## Events

Events are dispatched as native `CustomEvent`s:

```javascript
var sliderElement = document.querySelector('.slider');

sliderElement.addEventListener('afterChange', function(e) {
  var slick = e.detail[0];
  var currentSlide = e.detail[1];
  console.log('Changed to slide:', currentSlide);
});
```

Event | Detail | Description
------ | -------- | -----------
afterChange | [slick, currentSlide] | After slide change
beforeChange | [slick, currentSlide, nextSlide] | Before slide change
breakpoint | [slick, breakpoint] | After a breakpoint is hit
destroy | [slick] | When slider is destroyed
edge | [slick, direction] | Overscrolled in non-infinite mode
init | [slick] | When Slicker initializes
reInit | [slick] | Every time Slicker re-initializes
setPosition | [slick] | Every time Slicker recalculates position
swipe | [slick, direction] | After swipe/drag
lazyLoaded | [slick, image, imageSource] | After image loads lazily
lazyLoadError | [slick, image, imageSource] | After image fails to load

---

## Methods

Methods are called directly on the Slicker instance:

```javascript
var slider = Slicker.init('.slider', { dots: true });

// Navigate
slider.slickNext();
slider.slickPrev();
slider.slickGoTo(2);
slider.slickGoTo(3, true); // skip animation

// Control
slider.slickPause();
slider.slickPlay();

// Modify
slider.slickAdd('<div>New Slide</div>');
slider.slickRemove(0);
slider.slickFilter('.filter-class');
slider.slickUnfilter();

// Query
var current = slider.slickCurrentSlide();
var option = slider.slickGetOption('speed');

// Update
slider.slickSetOption('speed', 1000, true);
slider.slickSetOption({
  dots: false,
  arrows: true
}, true);

// Destroy
slider.unslick();
```

Method | Arguments | Description
------ | --------- | -----------
`slickNext` | - | Go to next slide
`slickPrev` | - | Go to previous slide
`slickPause` | - | Pause autoplay
`slickPlay` | - | Start autoplay
`slickGoTo` | index, dontAnimate | Go to slide by index
`slickCurrentSlide` | - | Returns current slide index
`slickAdd` | markup, index, addBefore | Add a slide
`slickRemove` | index, removeBefore | Remove a slide
`slickFilter` | selector | Filter slides
`slickUnfilter` | - | Remove filter
`slickGetOption` | option | Get an option value
`slickSetOption` | option, value, refresh | Set option(s)
`getSlick` | - | Get Slicker instance
`unslick` | - | Destroy Slicker

---

## Responsive Example

```javascript
Slicker.init('.slider', {
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (requires polyfills for `Object.entries`, etc.)

---

## Build From Source

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Output files:
# - dist/slicker.js (UMD, minified)
# - dist/slicker.esm.js (ES Module)
# - dist/**/*.d.ts (TypeScript definitions)
```

---

## What's Different?

### Breaking Changes (Minor)
1. Initialization uses `Slicker.init()` or `new Slicker()` instead of the jQuery plugin.
2. Events are native `addEventListener` instead of jQuery `.on()`.
3. Event details are in `e.detail` arrays instead of callback parameters.
4. No jQuery method chaining - store the instance to call methods.

### Improvements
- No jQuery dependency (smaller and faster)
- Modern ES6+ code and tree-shakeable modules
- Full TypeScript support
- Better performance with native APIs
- Smaller bundle size

---

## Project Structure

```
dist/          # Compiled Slicker builds (JS: ESM + UMD, CSS: unified, types: .d.ts)
src/           # TypeScript source for Slicker (includes slicker.scss)
slick/         # Original jQuery Slick distribution (JS + CSS) for reference/legacy
index.html     # Examples and demos
```

---

## Credits

### Original Slick Carousel
**Created by**: [Ken Wheeler](https://github.com/kenwheeler)  
**Original Repository**: https://github.com/kenwheeler/slick  
**License**: MIT  

Ken's original Slick carousel revolutionized web carousels with its feature-rich, accessible approach. The Slicker rewrite preserves his vision while modernizing the codebase. The untouched original files remain in `slick/` for reference and legacy use.

### Slicker TypeScript Rewrite
**Rewritten in**: TypeScript/Vanilla JavaScript  
**Version**: 1.0.0  
**Changes**: Removed jQuery dependency, added TypeScript support, modernized architecture  

---

## License

MIT License

Copyright (c) 2017 Ken Wheeler  
Copyright (c) 2025 Vanilla TypeScript Rewrite  

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Free as in Bacon.**
