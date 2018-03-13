/**
 * Created by XCC on 2017/2/18.
 */
window.onload = function() {
  var server_url = "http://101.204.243.86:9000/api/event/" + location.search.slice(
    1);
  $.ajax({
    url: server_url,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      if (data.title) {
        $("#ht-top").html(data.title);
      }
      if (data.keyWords) {
        $("#tag").html(data.keyWords.slice(0, 5).join("  "));
      }
      if (data.medias) {
        $("#media").html(data.medias.slice(0, 5).join("  "));
      }
      if (data.relative) {
        $("#relative").html(data.relative.slice(0, 3).join("  "));
      }
      if (data.hot) {
        gauge(document.getElementById("ht-gauge-hot"), "热度", "#ff9f9f",
          Math.round(data.hot));
      }
      if (data.influence) {
        gauge(document.getElementById("ht-gauge-influ"), "影响力", "#0cf",
          Math.round(data.influence));
      }
    }
  })
};
