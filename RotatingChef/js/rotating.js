var details = [0, 7, 14, 26];
// the current index in the details array
var detailIndex = 0;
var api;
var space = 150;
var frames;
var spin;
var slide;
var imageSize = {
    "width": 0,
    "height": 0
}
// use helper method to generate an array of image urls. We have 34 frames in total
frames = SpriteSpin.sourceArray('/img/male/chef_male_{frame}.jpg', {
    frame: [1, 32],
    digits: 2
});
// set image size width and height;
var img = new Image();
img.onload = function () {
    imageSize.width = this.width;
    imageSize.height = this.height;
    createImage();
};
img.src = frames[0];
window.onload = function () {
    $('#slider').slider();
    

    spin = $('#spinner');
    slide = $('#slider');
    
    //createImage();
    console.log(imageSize.width);
    
    spin.spritespin({
        // path to the source images.
        source: frames,
        width: Math.round((window.innerHeight - space) * (imageSize.width / imageSize.height)),  // width in pixels of the window/frame
        height: Math.round(window.innerHeight - space),  // height in pixels of the window/frame
        animate: false,
        wrap: false,
        onLoad: function () {
            slide.slider({
                min: 0,
                max: frames.length - 1,
                slide: function (e, ui) {
                    var api = spin.spritespin('api');
                    api.stopAnimation();
                    api.updateFrame(ui.value);
                }
            })
        },
        onFrame: function (e, data) {
            slide.slider('value', data.frame);
            $('.detail').css({ "display": "none" });
        }
    });
    api = spin.spritespin("api");

    spin.bind("onLoad", function () {
        var data = api.data;
        data.stage.prepend($(".details .detail")); // add current details
        data.stage.find(".detail").hide();         // hide current details
    }).bind("onFrame", function () {
        var data = api.data;
        data.stage.find(".detail:visible").stop(false).fadeOut();
        data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
    });

    $("#prev").click(function () {
        detailIndex--
        setDetailIndex(detailIndex);
    });

    $("#next").click(function () {
        detailIndex++
        setDetailIndex(detailIndex);
    });

}

$(window).resize(function () {
    $('#spinner').width(Math.round((window.innerHeight - space) * (imageSize.width / imageSize.height)))
    $('#spinner canvas').width(Math.round((window.innerHeight - space) * (imageSize.width / imageSize.height)))
    $('#spinner').height(Math.round(window.innerHeight - space))
    $('#spinner canvas').height(Math.round(window.innerHeight - space))
   
});

function createImage() {
    for (var i = 0; i < details.length; i++) {
        var n = details[i];
        $('.details').append('<div class="detail detail-' + n + '"><img src="' + frames[n] +'" style="width:100%;"/></div>')
    }
}

function setDetailIndex(index) {
    $('.detail').css({"display": "none"})
    detailIndex = index;
    if (detailIndex < 0) {
        detailIndex = details.length - 1;
    }
    if (detailIndex >= details.length) {
        detailIndex = 0;
    }

    api.playTo(details[detailIndex]);
}