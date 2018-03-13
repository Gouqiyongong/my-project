;(function ($) {
  $(".ht-event-list").find("a").click(function () {
    if ($(this).attr("index")) {
      localStorage.setItem("key", $(this).attr("index"));
      localStorage.setItem("ye", 1);
      localStorage.setItem("index", 0);
    }
  });
  function hrefAdd(Class) {
    $(function () {
      var $parent = Class;
      var $target = $parent.find("a");
      $target.each(function () {
        var $href = $(this).attr("href");
        $(this).click(function (event) {
          $(this).attr("href", "eventContent.html?" + $href + "/1");
        });
        $(this).attr("href", $href);
      })
    });
  }

  hrefAdd($(".ht-event-list"));
})(jQuery);



