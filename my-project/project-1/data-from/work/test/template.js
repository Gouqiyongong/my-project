function getData(urls, tabl) {
  var events = [];
  $.ajax({
    type: "get",
    url: urls + "events/class/top",
    dataType: 'json',
    success: function (eve) {}
  });
}