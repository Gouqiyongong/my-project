/**
 * Created by XCC on 2017/2/17.
 */
window.onload = function () {
  loadData();
};
function loadData(cate) {
  var server_url = "http://101.204.243.86:9000/api/event/";
  var href = location.search;
  var data_arr = [];
  var ele = document.getElementById("list").innerHTML;
  if(!cate) {
    server_url += href.slice(1);
  } else {
    var index0 = href.search(/\//);
    var index1 = href.search(/\/\d/);
    var router = (href.slice(1, index0 + 1) + cate.slice(1) + href.slice(index1));
    server_url += router;
    console.log(server_url)
  }
  $.ajax({
    url: server_url,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      data.forEach(function (item, index, array) {
        var obj = {};
        if (array.length > 0) {
          obj.id = item.id;
          obj.title = item.title;
          obj.time = formatDate(item.time);
          obj.inf = item.influence;
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
      })
    }
  })
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