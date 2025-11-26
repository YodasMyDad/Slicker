/**
 * Responsive Module
 * Handles responsive breakpoints
 */
import { EventManager } from './events';
/**
 * Check responsive breakpoints
 */
export function checkResponsive(initial, forceUpdate) {
    const _ = this;
    // Prevent nested responsive changes during a responsive refresh cycle
    if (_.inResponsiveRefresh) {
        return;
    }
    const sliderWidth = _.$slider.offsetWidth;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    let respondToWidth;
    if (_.respondTo === 'window') {
        respondToWidth = windowWidth;
    }
    else if (_.respondTo === 'slider') {
        respondToWidth = sliderWidth;
    }
    else if (_.respondTo === 'min') {
        respondToWidth = Math.min(windowWidth, sliderWidth);
    }
    else {
        respondToWidth = windowWidth;
    }
    if (_.options.responsive &&
        _.options.responsive.length &&
        _.options.responsive !== null) {
        let targetBreakpoint = null;
        for (const breakpoint of _.breakpoints) {
            if (_.originalSettings.mobileFirst === false) {
                if (respondToWidth < breakpoint) {
                    targetBreakpoint = breakpoint;
                }
            }
            else {
                if (respondToWidth > breakpoint) {
                    targetBreakpoint = breakpoint;
                }
            }
        }
        if (targetBreakpoint !== null) {
            if (_.activeBreakpoint !== null) {
                if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                    _.activeBreakpoint = targetBreakpoint;
                    const breakpointSettings = _.breakpointSettings[targetBreakpoint];
                    if (breakpointSettings === 'unslick') {
                        _.unslick(targetBreakpoint);
                    }
                    else {
                        _.options = Object.assign(Object.assign({}, _.originalSettings), breakpointSettings);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        if (initial === true) {
                            _.inResponsiveRefresh = true;
                            _.refresh(initial);
                            _.inResponsiveRefresh = false;
                        }
                        else {
                            _.inResponsiveRefresh = true;
                            _.unload();
                            _.reinit();
                            _.inResponsiveRefresh = false;
                        }
                    }
                    EventManager.trigger(_.$slider, 'breakpoint', [_, targetBreakpoint]);
                }
            }
            else {
                _.activeBreakpoint = targetBreakpoint;
                const breakpointSettings = _.breakpointSettings[targetBreakpoint];
                if (breakpointSettings === 'unslick') {
                    _.unslick(targetBreakpoint);
                }
                else {
                    _.options = Object.assign(Object.assign({}, _.originalSettings), breakpointSettings);
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    if (initial === true) {
                        _.inResponsiveRefresh = true;
                        _.refresh(initial);
                        _.inResponsiveRefresh = false;
                    }
                    else {
                        _.inResponsiveRefresh = true;
                        _.unload();
                        _.reinit();
                        _.inResponsiveRefresh = false;
                    }
                }
                EventManager.trigger(_.$slider, 'breakpoint', [_, targetBreakpoint]);
            }
        }
        else {
            if (_.activeBreakpoint !== null) {
                _.activeBreakpoint = null;
                _.options = _.originalSettings;
                if (initial === true) {
                    _.currentSlide = _.options.initialSlide;
                }
                if (initial === true) {
                    _.inResponsiveRefresh = true;
                    _.refresh(initial);
                    _.inResponsiveRefresh = false;
                }
                else {
                    _.inResponsiveRefresh = true;
                    _.unload();
                    _.reinit();
                    _.inResponsiveRefresh = false;
                }
                EventManager.trigger(_.$slider, 'breakpoint', [_, targetBreakpoint]);
            }
        }
    }
}
