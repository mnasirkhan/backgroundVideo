 /*!
 * backgroundVideo v0.1.0
 * [ENTER URL HERE]
 * Use HTML5 video to create an effect like the CSS property, 'background-size: cover'. Includes parallax option.
 *
 * Copyright 2014 Sam Linnett
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 *
 */

;(function ( $, window, document, undefined ) {
    "use strict";

    // Create the defaults once
    var pluginName = "backgroundVideo",
        defaults = {
            $videoWrap: $('#video-wrap'),
            $outerWrap: $(window),
            $window: $(window),
            minimumVideoWidth: 400,
            preventContextMenu: false,
            parallax: true,
            parallaxOptions: {
                offset: 0,
                // Enter number between 0 and 1
                effect: 0.5
            },
            pauseVideoOnViewLoss: true
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        var me = this;
        this.element = element;
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
        this.options.$video = $(element);

        this.detectBrowser();
        this.options.has3d = this.detect3d();

        // Apply overflow hidden fix to the video wrap
        this.options.$videoWrap.css('overflow', 'hidden');

        this.options.$video.on('canplay canplaythrough', readyCallback);
        // If the video is in the cache of the browser,
        // the 'canplaythrough' event might have been triggered
        // before we registered the event handler.
        if (this.options.$video[0].readyState > 3) {
            readyCallback();
        }

        function readyCallback() {
            me.options.originalVideoW = me.options.$video[0].videoWidth;
            me.options.originalVideoH = me.options.$video[0].videoHeight;
            me.init();
        }
    }

    Plugin.prototype = {

        init: function() {
            var me = this;

            // Run videoCover function on window resize
            this.options.$window.resize(function() {
                me.videoCover(me.options.$video, me.options.$videoWrap);
            });

            // Use Parallax effect on the video
            if(this.options.parallax) {
                me.parallaxScroll(this.options.$video);
            }

            // Pause video when the video goes out of the browser view
            if(this.options.pauseVideoOnViewLoss) {
                this.playPauseVideo();
            }

            // Prevent context menu on right click for video
            if(this.options.preventContextMenu) {
                this.options.$video.on('contextmenu',function() { return false; });
            }

            // Prompt resize to trigger videoCover function to run
            this.options.$window.trigger('resize');
        },

        detect3d: function () {
            var el = document.createElement('p'), t, has3d,
            transforms = {
                'WebkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'MSTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

            /* Add it to the body to get the computed style.*/
            document.body.insertBefore(el, document.body.lastChild);

            for(t in transforms){
                if( el.style[t] !== undefined ){
                    el.style[t] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
                    has3d = window.getComputedStyle(el).getPropertyValue( transforms[t] );
                }
            }

            if( has3d !== undefined ){
                return has3d !== 'none';
            } else {
                return false;
            }
        },

        detectBrowser: function () {
            var val = navigator.userAgent.toLowerCase();

            if( val.indexOf('chrome') > -1 || val.indexOf('safari') > -1 ) {
                this.options.browser = 'webkit';
                this.options.browserPrexix = '-webkit-';
            }
            else if( val.indexOf('firefox') > -1 ) {
                this.options.browser = 'firefox';
                this.options.browserPrexix = '-moz-';
            }
            else if (val.indexOf('MSIE') !== -1 || val.indexOf('Trident/') > 0) {
                this.options.browser = 'ie';
                this.options.browserPrexix = '-ms-';
            }
            else if( val.indexOf('Opera') > -1 ) {
                this.options.browser = 'opera';
                this.options.browserPrexix = '-o-';
            }
        },

        videoCover: function($video, $videoWrap) {
            var me = this,
                heightScale,
                widthScale,
                scaleFactor;

            // Set the video wrap to the outerWrap size (defaulted to window)
            $videoWrap.width(this.options.$outerWrap.width());
            $videoWrap.height(this.options.$outerWrap.height());

            heightScale = this.options.$window.width() / this.options.originalVideoW;
            widthScale = this.options.$window.height() / this.options.originalVideoH;

            scaleFactor = heightScale > widthScale ? heightScale : widthScale;

            if (scaleFactor * this.options.originalVideoW < this.options.minimumVideoWidth) {
                scaleFactor = this.options.minimumVideoWidth / this.options.originalVideoW;
            }

            // Scale
            $video.width(scaleFactor * this.options.originalVideoW);
            $video.height(scaleFactor * this.options.originalVideoH);

            // Center Video to behave like background-position: 50% 50%
            this.options.$videoWrap.scrollLeft(($video.width() - this.options.$window.width()) / 2);
            this.options.$videoWrap.scrollTop(($video.height() - this.options.$window.height()) / 2);

        },

        parallaxScroll: function($video) {
            var me = this, scrolled, translate, translateStr;

            // Set scroll listener for parallax effect
            this.options.$window.on('scroll.backgroundVideoParallax', function () {
                // When scrolling, trigger parallax after offset (e.g. header)
                if($(this).scrollTop() > me.options.parallaxOptions.offset) {
                    scrolled = $(this).scrollTop() - me.options.parallaxOptions.offset;
                    translate = scrolled * me.options.parallaxOptions.effect;
                    translateStr = (me.options.has3d) ? 'translate3d(0, ' + translate + 'px, 0)' : 'translate(0, ' + translate + 'px)';

                    // If the video scrolls out of view, prevent translate for performance
                    if($(this).scrollTop() < me.options.$videoWrap.height()) {
                        $video.css(me.options.browserPrexix + 'transform', translateStr);
                        $video.css('transform', translateStr);
                    }
                }
                // If the user scrolls higher than viewport, reset the translate
                else {
                    translateStr = (me.options.has3d) ? 'translate3d(0, 0, 0)' : 'translate(0, 0)';

                    $video.css(me.options.browserPrexix + 'transform', translateStr);
                    $video.css('transform', translateStr);
                }
            });
        },

        disableParallax: function () {
            this.options.$window.unbind('.backgroundVideoParallax');
        },

        playPauseVideo: function () {
            var me = this;

            this.options.$window.on('scroll.backgroundVideoPlayPause', function () {
                // Play/Pause video depending on where the user is in the browser
                if($(this).scrollTop() < me.options.$videoWrap.height()) {
                    me.options.$video.get(0).play();
                } else {
                    me.options.$video.get(0).pause();
                }
            });
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );