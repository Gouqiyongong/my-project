var $pre = $("#pre"),
    $next = $("#next"),
    $current = $("#pagination").find("li").not(".pre,.next");
window.onload = function () {
  var ye = parseInt(localStorage.getItem("ye"));
  var ind = parseInt(localStorage.getItem("index"));
  var activ = $("#pagination").find('li[class="active"]');
  if(pages > 5){
    $.each($current,function (index,thiz) {
      if(index == ind && $(thiz) != activ){
        activ.removeClass("active");
        $(thiz).addClass("active");
      }
      $(thiz).find("span").html(ye - ind + index);
    });
  }
  if(pages < 5 && pages > 0){
    var ul = "<li class='pre'  id='pre'><span>&laquo;</span></li>";
    for(var i = 0; i < pages; i++){
      if(i == ind){
        ul += "<li class='active' data-index=" + i + ">" + "<span>" + (ye - ind + i) + "</span>" + "</li>";
      }
      else {
        ul += "<li data-index=" + i + ">" + "<span>" + (ye - ind + i) + "</span>" + "</li>";
      }
    };
    ul += "<li class='next' id='next' data-index = ><span>&raquo;</span></li>";
    $("#pagination ul").html(ul);
  }
};

$pre.click(function (event) {
  event.preventDefault();
  var reduce;
  var activ = $("#pagination").find("li[class='active']");
  var one = Number($pre.next().find("span").html());
  if(one <= 5){
    reduce = one - 1;
  }
  else {
    reduce = 5;
  }
  $.each($current,function (index, thiz) {
    $(thiz).find("span").html(Number($(thiz).find("span").html()) - reduce);
  })
  if(activ != $pre.next()){
    activ.removeClass("active");
    $pre.next().addClass("active");
  }
  localStorage.setItem("index",Number($("#pagination").find("li[class='active']").attr("data-index")));
  localStorage.setItem("ye",Number($("#pagination").find("li[class='active']").find("span").html()));
  loadData($("#ht-event-nav").find("li[class=active]").find("a").attr("href"),Number($pre.next().find("span").html()));
});

$next.click(function (event) {
  event.preventDefault();
  var reduce;
  var activ = $("#pagination").find("li[class='active']");
  var one = Number($next.prev().find("span").html());
  if(one + 5 > pages){
    reduce = pages - one;
  }
  else {
    reduce = 5;
  }
  $.each($current,function (index, thiz) {
    $(thiz).find("span").html(Number($(thiz).find("span").html()) + reduce);
  })
  if(activ != $pre.next()){
    activ.removeClass("active");
    $pre.next().addClass("active");
  }
  localStorage.setItem("index",Number($("#pagination").find("li[class='active']").attr("data-index")));
  localStorage.setItem("ye",Number($("#pagination").find("li[class='active']").find("span").html()));
  loadData($("#ht-event-nav").find("li[class=active]").find("a").attr("href"),Number($pre.next().find("span").html()));
});

$current.click(function (event) {
  event.preventDefault();
  var activ = $("#pagination").find('li[class="active"]');
  if($(this) != activ){
    activ.removeClass("active");
    $(this).addClass("active");
    localStorage.setItem("index",Number($("#pagination").find("li[class='active']").attr("data-index")));
    localStorage.setItem("ye",Number($("#pagination").find("li[class='active']").find("span").html()));
    loadData($("#ht-event-nav").find("li[class=active]").find("a").attr("href"),Number($(this).find("span").html()));
  }
});

$(function () {
  var $parent = $("#ht-event-nav");
  var $target = $parent.find($("li"));
  $target.click(function () {
    if (!$(this).hasClass("active")) {
      $(this).addClass("active").siblings().removeClass("active");
      localStorage.setItem("ye",1);
      localStorage.setItem("index",0);
      localStorage.setItem("key",$(this).attr("index"));
      var activ = $("#pagination").find('li[class="active"]');
      loadData($(this).find($("a")).attr("href"),1);
      if($pre.next() != activ){
        activ.removeClass("active");
        $pre.next().addClass("active");
      }
      $.each($current,function (index,thiz) {
        $(thiz).find("span").html(index + 1);
      })
    };
  });
})

