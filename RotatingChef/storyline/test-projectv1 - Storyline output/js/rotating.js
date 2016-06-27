// Details variable for four sides of angles
var details = [0, 7, 14, 26];
var detailsInfo;
var detailIndex = 0;

var detailMale;
var detailFemale;

// Variables for 360 Spin Frameworks
var api;
var space = 150;
var frames;
var framesFemale
var spin;
var slide;

// Booleans
var runOnce = false;

// First image
var image;
var imageSize = {
    "width": 0,
    "height": 0
}

// Frames for male and female pictures
frames = SpriteSpin.sourceArray('img/male/chef_male_{frame}.jpg', {
    frame: [1, 32],
    digits: 2
});
framesFemale = SpriteSpin.sourceArray('img/female/chef_female_{frame}.jpg', {
    frame: [1, 32],
    digits: 2
});

// Set image size width and height for imagemaps;
var img = new Image();
img.onload = function () {
    imageSize.width = this.width;
    imageSize.height = this.height;
    createImage();
};
img.src = frames[0];

// Preloading the images
function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src', this).appendTo('body').css('display', 'none');
    });
}
preload(frames);

// Loading the JSON containing the information (details.json)
$.getJSON("js/details.json", function (result) {
    $.each(result, function (i, field) {
        detailsInfo = result.details;
    });
});


// Create the spinner
function createSpinner(framesX, boolX, gender) {
    createImage();

    spin = $('#spinner-male');
    spin.spritespin({
        // path to the source images.
        source: framesX,
        width: 259,  // width in pixels of the window/frame
        height: 551,  // height in pixels of the window/frame
        animate: false,
        wrap: true,
        behaviour: '360',
        reverse: false,
        onLoad: function () {
            if (boolX) {
                $('#overlay').fadeOut();
            }
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
        //var string = $(".details .detail").clone();
        if (gender == "male") {
            data.stage.prepend(detailMale); // add current details
        }
        if (gender == "female") {
            data.stage.prepend(detailFemale); // add current details
        }
        //data.stage.prepend($("#Map0"));
        data.stage.find(".detail").hide();         // hide current details
        createImageMapster();
    }).bind("onFrame", function () {
        var data = api.data;
        data.stage.find(".detail:visible").stop(false).fadeOut();
        data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
    });
}


// Initiation the image maps for specific parts of the images
function createImageMapster() {
    image = $('img');
    image.mapster({
        fillColor: '6c6c6c',
        fillOpacity: 0.5,
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
    if (!runOnce) {
        runOnce = true;
        createDivs();
    }
    $("#show-all").hover(function () {

        $('area').mapster('select');
    },
   function () {
       $('area').mapster('deselect');
   });
}

function createNavigation() {
    var a = $('#navigational');
    var c = 1;

    for (var i = 0; i < details.length; i++) {
        var b = '<li><a href="#" onclick="setDetailIndex(' + i + ')">' + c + '</a></li>';
        a.append(b);
        c++;
    }
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

function createImage() {
    for (var i = 0; i < details.length; i++) {
        var n = details[i];
            $('.details-male').append('<div class="detail detail-' + n + '"><img src="' + frames[n] + '"  usemap="#Map'+ n +'"/></div>')
        //else {
        //    $('.details-male').append('<div class="detail detail-' + n + '"><img src="' + frames[n] + '" /></div>')
        //}
    }
    var map = $('#Map0')
    $('.detail-0').append(map)
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

// Run this once DOM element is loaded
window.onload = function () {
    detailMale = $(".details-male .detail").clone();
    $(".details-male .detail").remove();
    $('#slider').slider();


    spin = $('#spinner-male');
    slide = $('#slider');

    //createImage();
    //console.log(imageSize.width);

    createSpinner(frames, true, "male")

    $("#btn-home").click(function () {
        $('#home').show();
        $('.div-detail').addClass('hide').removeClass('show');
    })
    $("#btn-female").click(function () {
        createSpinner(framesFemale, false, "female")
    })
    $("#btn-male").click(function () {
        createSpinner(frames, false, "male")
    })
    createNavigation();
}



