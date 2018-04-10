function pages(ele, max, index, ac, fn, mark) {
  var $pre = $(ele).filter('.pre'),
    $next = $(ele).filter('.next'),
    $current = $(ele).not(".pre,.next");
  var ye = ac;
  var ind = index;
  var pages = max || 100;
  var activ = $(ele).find('active');
  if (pages > 5) {
    $.each($current, function (index, thiz) {
      if (index == ind && $(thiz) != activ) {
        $(thiz).siblings().removeClass('active');
        $(thiz).addClass("active");
      }
      $(thiz).find("a").html(ye - ind + index);
    });
  }
  if (pages < 5 && pages > 0) {
    var ul = "<li class='pre'><a>&laquo;</a></li>";
    for (var i = 0; i < pages; i++) {
      if (i == ind) {
        ul += "<li class='active'>" + "<a>" + (ye - ind + i) + "</a>" + "</li>";
      } else {
        ul += "<li>" + "<a>" + (ye - ind + i) + "</a>" + "</li>";
      }
    };
    ul += "<li class='next'><a>&raquo;</a></li>";
    var $parent = $(ele).parent()
    $parent.html(ul);
    $pre = $parent.find('li[class=pre]');
    $next = $parent.find('li[class=next]');
    $current = $parent.not(".pre,.next");
  }
  if(mark){
    $pre.click(function (event) {
      event.preventDefault();
      var reduce;
      var activ = $(ele).filter('.active')
      var one = Number($pre.next().find("a").html());
      console.log(one);
      if (one <= 5) {
        reduce = one - 1;
      } else {
        reduce = 5;
      }
      $.each($current, function (index, thiz) {
        $(thiz).find("a").html(Number($(thiz).find("a").html()) - reduce);
      })
      if (activ != $pre.next()) {
        activ.removeClass("active");
        $pre.next().addClass("active");
      }
      fn($(ele).filter('.active').find('a').html(), $(ele).filter('.active').index() - 1);
    });
  
    $next.click(function (event) {
      event.preventDefault();
      var reduce;
      var activ = $(ele).filter('.active');
      var one = Number($next.prev().find("a").html());
      if (one + 5 > pages) {
        reduce = pages - one;
      } else {
        reduce = 5;
      }
      $.each($current, function (index, thiz) {
        $(thiz).find("a").html(Number($(thiz).find("a").html()) + reduce);
      })
      if (activ != $pre.next()) {
        activ.removeClass("active");
        $pre.next().addClass("active");
      }
      fn($(ele).filter('.active').find('a').html(), $(ele).filter('.active').index() - 1);
    });
  
    $current.click(function (event) {
      event.preventDefault();
      var activ = $(ele).filter('.active');
      if ($(this) != activ) {
        $(this).siblings().removeClass('active');
        $(this).addClass("active");
        fn($(ele).filter('.active').find('a').html(), $(ele).filter('.active').index() - 1);
      }
    });
  }
};

export default pages;