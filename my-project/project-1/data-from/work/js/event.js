;(function ($) {
  $.fn.eventJs = function () {
    var event_type = $(".event-type"),
      website = $(".website"),
      ht_event_tag = $(".ht-event-tag");
    ht_event_tag.click(function () {
      if ($(this).index() === 0 && !$(this).hasClass("active")) {
        $(this).addClass("active").siblings().removeClass("active");
        event_type.fadeIn();
        website.fadeOut();
      } else if ($(this).index() === 1 && !$(this).hasClass("active")) {
        $(this).addClass("active").siblings().removeClass("active");
        website.fadeIn();
        event_type.fadeOut();
      } else {
        return 0;
      }
    });
  };
})(jQuery);



