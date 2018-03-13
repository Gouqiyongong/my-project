var pages,loadData;

;(function ($) {
  $(document).ready(function () {
    if (localStorage.getItem("key") && localStorage.getItem("ye")) {
      var bq;
      switch (parseInt(localStorage.getItem("key"))) {
        case 1:
          bq = "/社会";
          break;
        case 2:
          bq = "/时政";
          break;
        case 3:
          bq = "/财经";
          break;
        case 4:
          bq = "/娱乐";
          break;
        case 5:
          bq = "/体育";
          break;
      }
      loadData(bq, parseInt(localStorage.getItem("ye")));
    }
    else {
      loadData();
    }
  });

  loadData = function (cate, time) {
    var server_url = "http://101.204.243.86:9000/api/v2/event/";
    var href = location.search;
    var data_arr = [];
    var ele = document.getElementById("list").innerHTML;
    if (!cate) {
      server_url += href.slice(1);
    } else {
      var index0 = href.search(/\//);
      //var index1 = href.search(/\/\d/);
      var router = (href.slice(1, index0 + 1) + cate.slice(1) + "/" + time);
      server_url += router;
    }

    $.ajax({
      url: server_url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success: function (data) {
        pages = parseInt(data.totalPages)
        data.content.forEach(function (item, index, array) {
          var obj = {};
          if (array.length > 0) {
            obj.id = item.id;
            obj.title = item.title;
            obj.time = formatDate(item.time);
            obj.inf = item.influence;
            obj.index = index;
            if (item.picture) {
              obj.picture = item.picture;
            }
            else {
              obj.picture = "img/e/u135.jpeg";
            }
            data_arr.push(obj);
          }
        });
        var result = ejs.render(ele, {
          datas: data_arr
        });
        document.getElementById("ht-event").innerHTML = result;
        $("div.item").click(function () {
          console.log($(this).attr("id"));
          location.href = "http://101.204.243.86:9000/analysis_event.html?" + $(this).attr("id");
        });
      }
    });
    setTimeout(function () {
      for (var i = 0, len = data_arr.length; i < len; i++) {
        gauge(document.getElementById("ht-event-influence-" + data_arr[i].index), "影响力", "#ccffff", Math.round(data_arr[i].inf), 10, 5);
      }
    }, 500);
  }

  function formatDate(tm) {
    var d = new Date(tm);
    return (d.getFullYear()) + "-" + addZore((d.getMonth() + 1)) + "-" + addZore((d.getDate()));
  }

  function addZore(num) {
    return num < 10 ? '0' + num : num;
  }

  function toDetail() {
    location.href = "analysis_event.html";
  }

})(jQuery);

