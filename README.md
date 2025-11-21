# Slick Carousel - Vanilla JavaScript

_the last carousel you'll ever need - now without jQuery_

**Version 1.9.0** - Vanilla TypeScript rewrite with zero dependencies

---

## About This Version

This is a complete vanilla JavaScript/TypeScript rewrite of the original [Slick Carousel by Ken Wheeler](https://github.com/kenwheeler/slick). It maintains 100% feature parity with the original while removing the jQuery dependency entirely.

### Why This Version?

- ✅ **Zero Dependencies** - No jQuery required (saves ~30KB)
- ✅ **Modern JavaScript** - Written in TypeScript with ES6+
- ✅ **Smaller Bundle** - 52KB minified (13KB gzipped) vs 82KB+ with jQuery
- ✅ **Better Performance** - Native DOM APIs are faster
- ✅ **Full TypeScript Support** - Complete type definitions included
- ✅ **Same CSS** - Use existing Slick stylesheets unchanged
- ✅ **Same API** - Nearly identical API, easy migration

**Original Slick by Ken Wheeler** - This project builds upon Ken's excellent work. The original jQuery version is preserved in `slick/slick.js` for reference.

---

## Quick Start

### 1. Include CSS
```html
<link rel="stylesheet" href="slick/slick.css">
<link rel="stylesheet" href="slick/slick-theme.css">
```

### 2. Include JavaScript
```html
<!-- Vanilla version (no jQuery needed) -->
<script src="dist/slick.js"></script>
```

### 3. Initialize
```html
<div class="my-slider">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>

<script>
  var slider = Slick.init('.my-slider', {
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

### ES6 Module
```javascript
import Slick from './dist/slick.esm.js';

const slider = Slick.init('.slider', {
  dots: true,
  arrows: true
});
```

### TypeScript
```typescript
import Slick, { SlickOptions } from './dist/index';

const options: Partial<SlickOptions> = {
  dots: true,
  slidesToShow: 3
};

const slider = Slick.init('.slider', options);
```

### Browser Global (UMD)
```html
<script src="dist/slick.js"></script>
<script>
  var slider = Slick.init('.slider', { dots: true });
</script>
```

---

## Migration from jQuery Version

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

### After (Vanilla Slick)
```javascript
var slider = Slick.init('.slider', {
  dots: true,
  arrows: true
});

slider.slickNext();
document.querySelector('.slider').addEventListener('afterChange', function(e) {
  console.log(e.detail[1]); // currentSlide
});
```

**That's it!** All options work exactly the same.

---

## Settings

All original Slick options are supported:

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

Events are dispatched as native CustomEvents:

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
init | [slick] | When Slick initializes
reInit | [slick] | Every time Slick re-initializes
setPosition | [slick] | Every time Slick recalculates position
swipe | [slick, direction] | After swipe/drag
lazyLoaded | [slick, image, imageSource] | After image loads lazily
lazyLoadError | [slick, image, imageSource] | After image fails to load

---

## Methods

Methods are called directly on the Slick instance:

```javascript
var slider = Slick.init('.slider', { dots: true });

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
------ | -------- | -----------
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
`getSlick` | - | Get Slick instance
`unslick` | - | Destroy Slick

---

## Responsive Example

```javascript
Slick.init('.slider', {
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

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (requires polyfills for Object.entries, etc.)

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
# - dist/slick.js (UMD, minified, 52KB)
# - dist/slick.esm.js (ES Module, 95KB)
# - dist/**/*.d.ts (TypeScript definitions)
```

---

## What's Different?

### Breaking Changes (Minor)
1. **Initialization**: Use `Slick.init()` or `new Slick()` instead of jQuery plugin
2. **Events**: Use native `addEventListener` instead of jQuery `.on()`
3. **Event Data**: Event details are in `e.detail` array instead of callback parameters
4. **No Method Chaining**: Store the instance to call methods

### Improvements
- No jQuery dependency (30KB savings)
- Modern ES6+ code
- Full TypeScript support
- Better performance with native APIs
- Tree-shakeable ES modules
- Smaller bundle size

---

## Project Structure

```
slick/
├── dist/              # Compiled JavaScript (use these)
│   ├── slick.js      # UMD build (52KB minified)
│   ├── slick.esm.js  # ES Module (95KB)
│   └── **/*.d.ts     # TypeScript definitions
├── src/               # TypeScript source
│   ├── core/         # Core functionality
│   ├── modules/      # Feature modules
│   ├── utils/        # Utilities
│   └── types/        # Type definitions
├── slick/             # Original jQuery version + CSS
│   ├── slick.js      # Original (for reference)
│   ├── slick.css     # Core styles (use this)
│   └── slick-theme.css # Default theme (use this)
└── index.html         # Examples
```

---

## Credits

### Original Slick Carousel
**Created by**: [Ken Wheeler](https://github.com/kenwheeler)  
**Original Repository**: https://github.com/kenwheeler/slick  
**License**: MIT

Ken's original Slick carousel revolutionized web carousels with its feature-rich, accessible approach. This vanilla rewrite preserves his vision while modernizing the codebase.

### Vanilla TypeScript Rewrite
**Rewritten in**: TypeScript/Vanilla JavaScript  
**Version**: 1.9.0  
**Changes**: Removed jQuery dependency, added TypeScript support, modernized architecture  
**Original jQuery version**: Preserved in `slick/slick.js` for reference

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

**Free as in Bacon.** 🥓
