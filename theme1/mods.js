$(function() {

  var IMAGE_KEY = 'img';
  var url = purl();
  var currentId = url.param(IMAGE_KEY);

  var updateQueryStringParam = function (key, value) {
      var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
          urlQueryString = document.location.search,
          newParam = key + '=' + value,
          params = '?' + newParam;

      // If the "search" string exists, then build params from it
      if (urlQueryString) {
          keyRegex = new RegExp('([\?&])' + key + '[^&]*');

          // If param exists already, update it
          if (urlQueryString.match(keyRegex) !== null) {
              params = urlQueryString.replace(keyRegex, "$1" + newParam);
          } else { // Otherwise, add it to end of query string
              params = urlQueryString + '&' + newParam;
          }
      }
      window.history.replaceState({}, "", baseUrl + params);
  };

  var getAllImages = function() {
    return $.map($('.slide'), function(el, i) {
      var $el = $(el);
      return {
        offset: $el.offset().top,
        id: $el.find('a').first().data('id')};
    });
  };

  var getCurrentImageIndex = function() {
    var threshold = 100;
    var currentPos = $(document).scrollTop() + threshold;
    var dists = getAllImages();
    return dists.findIndex(function(el, index, arr) {
      if (index+1 == arr.length) {
        return true;
      }
      return (currentPos >= (el.offset-threshold) && currentPos < (arr[index+1].offset-threshold));
    });
  };


  var handleScroll = function() {
    $('.slide a').each(function () {
        var images = getAllImages();
        var idx = getCurrentImageIndex();
        var hash = images[idx].id;
        if (currentId != hash) {
            updateQueryStringParam(IMAGE_KEY, hash);
            currentId = hash;
            return false;
        }
      });
  };


    if (currentId) {
      var imgs = getAllImages();
      var img = imgs.find(function(el) {return (el.id == currentId)});
      $('html, body').animate({
          scrollTop: img.offset
      }, 100);
    }

  //$(document).scroll(handleScroll);

  $(document).scroll(function() {
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(handleScroll, 10));
  });

    var handleNav = function(e) {
      var imgs = getAllImages();
      var thisImageIndex = getCurrentImageIndex();
      var keyCode = e.keyCode || e.charCode;
      if (keyCode === 106 || keyCode === 39) {
        $('html, body').animate({
            scrollTop: imgs[thisImageIndex+1].offset
        }, 100);
      } else if (keyCode === 107 || keyCode === 37){
        $('html, body').animate({
            scrollTop: imgs[thisImageIndex-1].offset
        }, 100);
      }
    };

    window.onkeypress = handleNav;
    window.onkeydown = handleNav;

  })
