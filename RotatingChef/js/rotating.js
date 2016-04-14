var details = [0, 7, 14, 26];
var detailsInfo;
// the current index in the details array
var detailIndex = 0;
var api;
var space = 150;
var frames;
var spin;
var slide;
var image;
var imageSize = {
    "width": 0,
    "height": 0
}
// use helper method to generate an array of image urls. We have 34 frames in total
frames = SpriteSpin.sourceArray('img/male/chef_male_{frame}.jpg', {
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

    $.getJSON("js/details.json", function (result) {
        $.each(result, function (i, field) {
            detailsInfo = result.details;

        });

    });
    spin = $('#spinner');
    slide = $('#slider');

    //createImage();
    console.log(imageSize.width);

    spin.spritespin({
        // path to the source images.
        source: frames,
        width: 259,  // width in pixels of the window/frame
        height: 551,  // height in pixels of the window/frame
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
        //data.stage.prepend($("#Map0"));
        data.stage.find(".detail").hide();         // hide current details
    }).bind("onFrame", function () {
        var data = api.data;
        data.stage.find(".detail:visible").stop(false).fadeOut();
        data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
    });

    $("#btn-prev").click(function () {
        detailIndex--
        setDetailIndex(detailIndex);
    });

    $("#btn-next").click(function () {
        detailIndex++
        setDetailIndex(detailIndex);
    });
    $("#btn-home").click(function () {
        $('#home').show();
        $('.div-detail').addClass('hide').removeClass('show');
    })
    image = $('img');
    image.mapster({
        fillColor: 'CCCCCC',
        fillOpacity: 0.3,
        stroke: true,
        strokeColor: "000000",
        strokeOpacity: 0.8,
        mapKey: 'data-key',
        showToolTip: true,
        isSelectable: false,
        onClick: function (e) {
            console.log(e.key);
            var id = '#' + e.key;
            var selector = $(id).attr("data-id");
            var title = $(id).attr("data-title");
            selector = parseInt(selector, 10);
            $('#home').hide();
            $('.div-detail').addClass('hide').removeClass('show');
            $(id).addClass('show').removeClass('hide');



            $(id).html('<h1>' + title + '</h1><p>' + detailsInfo[selector] + '</p>');
            // update text depending on area selected
            // if Asparagus selected, change the tooltip

        }
    });
    createDivs();
}

function createDivs() {
    var d = $('area[data-key]');
    var i = 0;
    d.each(function () {
        var val = $(this).attr('data-key');
        var title = $(this).attr('data-title');
        $('#information').append('<div class="col-sm-12 div-detail hide" data-title="' + title + '" data-id="' + i + '" id="' + val + '"></div>');
        console.log($(this).attr('data-key'), i, title);
        i++;
    });


    $('#information').append($('#nav'));
}

$(window).resize(function () {
    //$('#spinner').width(Math.round((window.innerHeight - space) * (imageSize.width / imageSize.height)))
    //$('#spinner canvas').width(Math.round((window.innerHeight - space) * (imageSize.width / imageSize.height)))
    //$('#spinner').height(Math.round(window.innerHeight - space))
    //$('#spinner canvas').height(Math.round(window.innerHeight - space))

});

function createImage() {
    for (var i = 0; i < details.length; i++) {
        var n = details[i];
        if (i == 0) {
            $('.details').append('<div class="detail detail-' + n + '"><img src="' + frames[n] + '"  usemap="#Map0"/></div>')
        }
        else {
            $('.details').append('<div class="detail detail-' + n + '"><img src="' + frames[n] + '" /></div>')
        }
    }
    $('.detail-0').append($('#Map0'))
}

function setDetailIndex(index) {
    $('.detail').css({ "display": "none" })
    detailIndex = index;
    if (detailIndex < 0) {
        detailIndex = details.length - 1;
    }
    if (detailIndex >= details.length) {
        detailIndex = 0;
    }

    api.playTo(details[detailIndex]);
}