;(function(){

  /*
  'http://..../.....jpg',
   {tn: {w:100, h:100}, index: {w:300, h: 200}},
   function(images){ ... }
  */
  window.bettercropper = function(url, params, callback){
    var img = $('<div class="sourceimg"><img src="'+url+'"></div>');
    var links = $('<div class="links"></div>');
    var preview = $('<div class="preview"></div>')
    var buttons = $('<div class="buttons"><div class="button">Готово</div><div class="button cancel">Отмена</div></div>')

    $.each(params, function(i,v){
      links.append($('<a href="#" data-target="'+i+'">'+i+'</a>'));
    })
    var el = $('<div></div>').append(links,img, preview, buttons)
    var popup = openPopup(el);


    links.find('a').click(function(){
      $(this).addClass('active').siblings('.active').removeClass('active');
      var target = $(this).data('target');

      $('.preview').css({
          width: params[target].w,
          height: params[target].h
      })
      $().cropper("destroy").
      cropper = img.find('img').cropper({
        aspectRatio: params[target].w / params[target].h,
        zoomable : false,
        data: {
          width: params[target].w,
          height: params[target].h,
          x : params[target].x||false,
          y : params[target].y||false
        },
        preview : '.preview',
        done: function(data) {
          params[target].w = data.width;
          params[target].h = data.height;
          params[target].x = data.x;
          params[target].y = data.y;
          params[target].rotate = data.rotate;
        }
      });
      popup.syncSize();
    })

    imagesLoaded(el, function(){
      links.find('a:eq(0)').click();
    })

    buttons.find('.button:not(.cancel)').click(function(){
      callback(params);
      popup.close();
    })
  }

  function openPopup(el, cls) {
    var popup = { el : $('<div class="popup"><div class="background"></div><div class="scroll"><div class="playout"></div></div>') },
      close = $('<div class="cross">X</div>');

    popup.layout = popup.el.find('.playout'),
    popup.background = popup.el.find('.background')
    popup.scroll = popup.el.find('.scroll')

    if (cls) popup.el.addClass(cls)
    popup.layout.append(close);
    popup.layout.append(el);
    $('body').append(popup.el);

    popup.syncSize = function() {
      var
        ph = popup.layout.height(),
        pw = popup.layout.width(),
        wh = $(window).height()

      if (wh > ph+100) {
        popup.layout.css({
          top : '50%',
          marginLeft : popup.layout.outerWidth()*-0.5,
          marginTop : popup.layout.outerHeight()*-0.5
        })
        popup.scroll.removeClass('active');
      } else {
        popup.layout.css({
          top : 10,
          marginLeft : popup.layout.width()*-0.5,
          marginTop : 50,
          marginBottom : 50,
        })
        popup.scroll.addClass('active');
      }
    }

    popup.syncSize();
    popup.el.find('img').load(function(){
      popup.syncSize();
    })
    $(window).bind('resize.popup', function(){
      popup.syncSize();
    })
    popup.close = function() {
      popup.el.remove();
      if (popup.onClose) popup.onClose();
      $(window).unbind('.popup');
      $(window).unbind('mousewheel')
    }

    close.on('click',function(){
      popup.close();
    })

    popup.scroll.click(function(e){
      var t = $(e.target);
      if (t.hasClass('playout') || t.parents('.playout').length) return;
      popup.close();
    });

    latestPopup = popup
    return popup;
  }

})();
