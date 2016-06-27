// begin variable listing
var current;
var male = new Character([0, 7, 14, 26], "");
var female = new Character([0, 7, 14, 26], "");
setFrame(male, 'img/male/chef_male_{frame}.jpg');
setFrame(female, 'img/female/chef_female_{frame}.jpg');

var detailsInfo;
// Loading the JSON containing the information (details.json)
$.getJSON("js/details.json", function (result) {
    $.each(result, function (i, field) {
        detailsInfo = result.details;
    });
});


/**
  * @desc Character class
  * @param 'array' detail, which stores the number of specific frames to show detail in (image maps)
*/
function Character(detail, spin){
    this.frames = [];
    this.detail = detail;
    this.spin = spin;
    this.api = "";
    this.index = 0;
    this.clone = function (string) {
        string.clone();
        string.remove();
        return string;
    }
    this.content;
}

/**
  * @desc initialize the main core libraries and frameworks
  * @desc hopefully it will work
*/
function init() {
    male.spin = $('#spinner-male');
    female.spin = $('#spinner-female');
    // spritespin initialize
    female.spin.spritespin({
        // path to the source images.
        source: female.frames,
        width: 259,  // width in pixels of the window/frame
        height: 551,  // height in pixels of the window/frame
        animate: false,
        wrap: true,
        sense: 0,
        behaviour: '360',
        reverse: false,
        onLoad: function () {

        },
        onFrame: function (e, data) {
        }
    });
    // spritespin initialize
    male.spin.spritespin({
        // path to the source images.
        source: male.frames,
        width: 259,  // width in pixels of the window/frame
        height: 551,  // height in pixels of the window/frame
        animate: false,
        wrap: true,
        behaviour: '360',
        sense: 0,
        reverse: false,
        onLoad: function () {
            
        },
        onFrame: function (e, data) {
        }
    });

    female.spin.hide();
    male.api = male.spin.spritespin('api');
    female.api = female.spin.spritespin('api');
    current = male;
    createImage('.details-male', 'male', male);
    createImage('.details-female', 'female', female);

    male.content = male.clone($(".details-male .detail"));
    female.content = female.clone($(".details-female .detail"));
    createNavigation($('#navigational'));
    current.spin.bind("onLoad", function () {
        var data = current.api.data;
            data.stage.prepend(current.content); // add current details
        //data.stage.prepend($("#Map0"));
        data.stage.find(".detail").hide();         // hide current details
        createImageMapster("img.male");
    }).bind("onFrame", function () {
        var data = current.api.data;
        data.stage.find(".detail:visible").stop(false).fadeOut();
        data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
    });
    female.spin.bind("onLoad", function () {
        var data = female.api.data;
        data.stage.prepend(female.content); // add current details
        //data.stage.prepend($("#Map0"));
        data.stage.find(".detail").hide();         // hide current details
        createImageMapster("img.female");
    }).bind("onFrame", function () {
        var data = female.api.data;
        data.stage.find(".detail:visible").stop(false).fadeOut();
        data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
    });
}

/**
  * @desc Dynamically create the image for image mapster to work.
  * @desc hopefully it will work though haha
*/
function createImage(string, gender, current) {
    for (var i = 0; i < current.detail.length; i++) {
        var n = current.detail[i];
        $(string).append('<div class="detail detail-' + n + '"><img class="'+gender+'"src="' + current.frames[n] + '"  usemap="#'+ gender +'Map' + n + '"/></div>')
        //$('.details-male').append('<div class="detail detail-' + n + '"><img src="' + current.frames[n] + '"  usemap="#maleMap' + n + '"/></div>')
        //else {
        //    $('.details-male').append('<div class="detail detail-' + n + '"><img src="' + frames[n] + '" /></div>')
        //}
    }
    var map = $('#Map0')
    $('.detail-0').append(map)
}
/**
  * @desc Initiation the image maps for specific parts of the images
  * @desc hopefully it will work
*/
function createImageMapster(string) {
    image = $(string);
    console.log(image);
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
   
        createDivs();
    $("#show-all").hover(function () {

        $('area').mapster('select');
    },
   function () {
       $('area').mapster('deselect');
   });
}
/**
  * @desc create the individual details menu!
  * @desc hopefully it will work
*/
function createDivs() {
    var d = $('area[data-key]');
    var i = 0;
    d.each(function () {
        var val = $(this).attr('data-key');
        var title = $(this).attr('title');
        $('#information').append('<div class="col-sm-12 div-detail hide" data-title="' + title + '" data-id="' + i + '" id="' + val + '"></div>');
        console.log($(this).attr('data-key'), i, title);
        i++;
    });
    $('#information').append($('#nav'));
}

/**
  * @desc set each frames for 360 image
  * @param 'object' c, which object to store the frame array
  * @param 'string' source, img file directory 
*/
function setFrame(c,source) {
    c.frames = SpriteSpin.sourceArray(source, {
        frame: [1, 32],
        digits: 2
    })
}

/**
  * @desc create navigation for the details.
*/
function createNavigation(string) {
    var a = string;
    var c = 1;

    for (var i = 0; i < current.detail.length; i++) {
        var b = '<li><a href="#" onclick="setDetailIndex(' + i + ')">' + c + '</a></li>';
        a.append(b);
        c++;
    }
}
/**
  * @desc set the index for specific frames
  * @param 'int' index to determine which frame;
*/
function setDetailIndex(index) {
    $('.detail').css({ "display": "none" })
    current.index = index;
    if (current.index < 0) {
        current.index = current.detail.length - 1;
    }
    if (current.index >= current.detail.length) {
        current.index = 0;
    }

    current.api.playTo(current.detail[current.index]);
}

/**
  * @desc preloading immage
  * @param 'array' arrayOfImages, fill in with array please
*/
function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src', this).appendTo('body').css('display', 'none');
    });
}
preload(male.frames);
preload(female.frames);
/**
  * @desc preloads everything first, and then run the following code below
*/
window.onload = function () {
    $('#overlay').fadeOut();
    init();
    $("#btn-home").click(function () {
        $('#home').show();
        $('.div-detail').addClass('hide').removeClass('show');
    })
    $("#btn-female").click(function () {
        female.spin.show();
        male.spin.hide();
        current = female;
    })
    $("#btn-male").click(function () {
        male.spin.show();
        female.spin.hide();
        current = male;
    })

}