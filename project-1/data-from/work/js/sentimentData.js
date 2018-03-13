;(function ($) {
  var url_server = "http://101.204.243.86:9000/api/v2/event/" + location.search.slice(1);
  $.ajax({
    url: url_server + "/keywords",
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      var d = [],
        val = [];
      data.forEach(function (item) {
        d.push(item.word);
        val.push(parseFloat(item.value).toFixed(4));
      });
      cloud(document.getElementById("ht-cloud"), d, val);
    }
  });

  $.ajax({
    url: url_server + "/comment",
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      var counter = [];
      var d = [],
        time = [];
      if (data.commentEmotionCounts) {
        data.commentEmotionCounts.forEach(function (item, index, array) {
          counter.push(item.count);
        });
        pia(document.getElementById("ht-pia"), counter);
      }
      if (data.commentCounts) {
        data.commentCounts.forEach(function (item, index, arr) {
          if (index == 0) {
            d.push(0);
            time.push(parseInt(time.time) - 20 * 60 * 1000);
            d.push(0);
            time.push(parseInt(time.time) - 40 * 60 * 1000);
          }
          d.push(parseInt(item.count));
          time.push(item.time);
        });
        console.log(d);
        lineWord(document.getElementById("ht-newword"), d, time);
      }

      if (data.commentContents) {
        data.commentContents.forEach(function (item) {
          if (item.type == "正") {
            $("#zheng").html(item.comments.join("。<br><br>"));
          }
          if (item.type == "负") {
            $("#fu").html(item.comments.join("。<br><br>"));
          }
        });
      }
    }
  });
})(jQuery);