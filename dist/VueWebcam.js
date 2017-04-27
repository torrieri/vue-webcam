'use strict';

// TODO:
// 1. Enable mirror option
// 2. Improve options handling
// 3. Error handling

var Vue = require('vue');

var WebcamComponent = Vue.extend({
    render: function render(h) {
        return h('video', {
            ref: 'video',
            attrs: {
                width: this.width,
                height: this.height,
                src: this.src,
                autoplay: this.autoplay
            }
        });
    },
    props: {
        autoplay: {
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 300
        },
        mirror: {
            type: Boolean,
            default: true
        },
        screenshotFormat: {
            type: String,
            default: 'image/jpeg'
        }
    },
    data: function data() {
        return {
            video: '',
            src: '',
            stream: '',
            hasUserMedia: false,
            styleObject: {
                transform: 'scale(-1, 1)',
                filter: 'FlipH'
            }
        };
    },

    methods: {
        getPhoto: function getPhoto() {
            if (!this.hasUserMedia) return null;

            var canvas = this.getCanvas();
            return canvas.toDataURL(this.screenshotFormat);
        },
        getCanvas: function getCanvas() {
            if (!this.hasUserMedia) return null;

            var video = this.$refs.video;
            if (!this.ctx) {
                var _canvas = document.createElement('canvas');
                _canvas.height = video.clientHeight;
                _canvas.width = video.clientWidth;
                this.canvas = _canvas;

                this.ctx = _canvas.getContext('2d');

                /*if (this.mirror) {
                    const context = canvas.getContext('2d');
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                    this.ctx = context;
                } else {
                    this.ctx = canvas.getContext('2d');
                }*/
            }

            var ctx = this.ctx,
                canvas = this.canvas;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            return canvas;
        }
    },
    mounted: function mounted() {
        var _this = this;

        this.video = this.$refs.video;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, function (stream) {
                _this.src = window.URL.createObjectURL(stream);
                _this.stream = stream;
                _this.hasUserMedia = true;
            }, function (error) {
                console.log(error);
            });
        }
    },
    beforeDestroy: function beforeDestroy() {
        this.video.pause();
        this.src = '';
        this.stream.getTracks()[0].stop();
    },
    destroyed: function destroyed() {
        console.log('Destroyed');
    }
});

var VueWebcam = Vue.component('vue-webcam', WebcamComponent);

module.exports = VueWebcam;