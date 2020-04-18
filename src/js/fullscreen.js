// ==========================================================================
// Fullscreen wrapper
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#prefixing
// https://webkit.org/blog/7929/designing-websites-for-iphone-x/
// ==========================================================================

import { on, triggerEvent } from './utils/events';
import is from './utils/is';

class Fullscreen {


    constructor(player) {
        // Keep reference to parent
        this.player = player;

        // eslint-disable-next-line no-underscore-dangle
        this._active = this.enabled;


        // Fullscreen toggle on double click
        on.call(this.player, this.player.elements.container, 'dblclick', event => {
            // Ignore double click in controls
            if (is.element(this.player.elements.controls) && this.player.elements.controls.contains(event.target)) {
                return;
            }

            this.toggle();
        });


    }

    // Determine if native supported
    static get native() {
        return !!(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        );
    }

    // If we're actually using native
    // eslint-disable-next-line class-methods-use-this
    get usingNative() {
        return true;
    }


    // Determine if fullscreen is enabled
    get enabled() {
        return (
            (Fullscreen.native || this.player.config.fullscreen.fallback) &&
            this.player.config.fullscreen.enabled &&
            this.player.supported.ui &&
            this.player.isVideo
        );
    }

    // Get active state
    get active() {
        if (!this.enabled) {
            return false;
        }

        // eslint-disable-next-line no-underscore-dangle
        return this._active;
    }


    set active(value) {
        if (!this.enabled) {
            return false;
        }
        // eslint-disable-next-line no-underscore-dangle
        this._active = value;
        return this.onChange();
    }


    onChange() {
        if (!this.enabled) {
            return;
        }

        // Update toggle button
        const button = this.player.elements.buttons.fullscreen;
        if (is.element(button)) {
            button.pressed = this.active;
        }

        // Trigger an event
        triggerEvent.call(this.player, this.target, this.active ? 'enterfullscreen' : 'exitfullscreen', true);
    }


    // Make an element fullscreen
    enter() {
        if (!this.enabled) {
            return;
        }
        this.active = true;
    }

    // Bail from fullscreen
    exit() {
        if (!this.enabled) {
            return;
        }

       this.active=false
    }

    // Toggle state
    toggle() {
        if (!this.active) {
            this.enter();
        } else {
            this.exit();
        }
    }
}

export default Fullscreen;
