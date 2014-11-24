backgroundVideo - v0.1.0 (beta)
============
## About
### What is backgroundVideo?
backgroundVideo makes your HTML5 `<video>` behave like the CSS property `background-size: cover`, making it fully responsive and scaling to aspect ratio. Also includeed is an optional Parallax effect on the video. If you would like the Parallax effect to behave like `background-attachment: fixed` instead of Parallax, you can set `parallaxOptions.effect: 1`.

### Why is this plugin required?
You may be aware of the CSS property `object-fill: cover`. Unfortunately, this is currently only supported in Chrome ([http://caniuse.com/#feat=object-fit](http://caniuse.com/#feat=object-fit)). This plugin will allow you to use a video as a responsive background.

### Browser Support
HTML5 video supported browsers on desktop:
* IE9+
* Chrome
* Firefox
* Safari
* Opera

> *Please note this plugin will **not work on mobile devices**. Background videos will never work until autoplay is allowed. A responsive image is suggested as fallback*

## How to use
The HTML structure is the most important part here. The rest of the work will be taken care of by the JavaScript.

For the most basic implementation, add the following to your `<body>`:
```
<div id="video-wrap">
    <video id="my-video" preload="metadata" autoplay loop>
        <source src="yourVideoName.mp4" type="video/mp4">
        <source src="yourVideoName.webm" type="video/webm">
    </video>
</div>
```

Then, before your closing `<body>` tag add:

```
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="backgroundVideo.js"></script>
<script>
    $(document).ready(function() {
        $(element).backgroundVideo();
    });
</script>
```
In its most simple form, this will create a video based on the `window` height and width and apply a Parallax effect of 0.5.

#### Other usage

```
<div id="outer-wrap" style="width: 100%; height: 450px;>"
    <div id="video-wrap">
        <video id="my-video" preload="metadata" autoplay loop>
            <source src="yourVideoName.mp4" type="video/mp4">
            <source src="yourVideoName.webm" type="video/webm">
        </video>
    </div>
</div>
```

## Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
$videoWrap | jQuery object | $('#video-wrap') | The div that wraps around the video
$outerWrap | jQuery object | $(window) | The containing div where outer measurements are taken
minimumVideoWidth | number | 400 | Minimum width of the video for scaling purposes
preventContextMenu | boolean | false | Prevents the user from viewing the context menu on the video (prevent right-click/secondary-click)
parallax | boolean | true | Toggle's parallax video feature
parallaxOptions.offset | number | 0 | Offset the parallax effect (e.g. when using sticky header)
parallaxOptions.effect | number | 0.5 | The intensity of the parallax effect (1: fix)
pauseVideoOnViewLoss | boolean | true | Pause the video when the user scrolls out of view


## Dependencies

jQuery 2.1.1

## License

Copyright (c) 2014 Sam Linnett

Licensed under the MIT license.