;(function ($) {
  window.onload = function() {
    var data_array = [],date_array= [],data_lian = "",data_relative = "";
    var server_url = "http://101.204.243.86:9000/api/v2/event/" + location.search.slice(
            1);
    $.ajax({
      url: server_url,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        if (data.title) {
          $("#ht-top").html(data.title);
        }
        if(data.summarize){
          $("#ht-main").html(data.summarize);
        }
        if (data.label.length > 0) {
          $("#tag").html(data.label.slice(0,5).join("  "));
        }
        if (data.medias.length > 0) {
          data.medias.forEach(function (item, index, array) {
            if(index < 5){
              data_lian += "<a href='" + item.url_md5 + "'>" + item.media + "&nbsp;&nbsp;" + "</a>";
            }
          });
          $("#media").html(data_lian);
        }
        if (data.relative.length > 0) {
          data.relative.forEach(function (item, index, array) {
            if(index < 5){
              data_relative += "<a href='" + item.url_md5 + "'>" + item.title + "</a>" + "<br>"
            }
          });
          $("#relative").html(data_relative);
        }
        if(data.eventMetaEntities){
          $("#people").html(data.eventMetaEntities.person.split(",").slice(0,5).join("  "));
          $("#event").html(data.eventMetaEntities.place.split(",").slice(0,5).join("  "));
        }
        if(data.time){
          var date = new Date(data.time);
          $("#time").html(date.getFullYear() + "-" + addZore(date.getMonth() + 1) + "-" + addZore(date.getDate()));
        }
        if (data.hot) {
          $("#ht-hot").html(Math.round(data.hot));
          $("#ht-gauge-hot").css("left",(Math.round(data.hot) - 100) + "%");
        }
        if (data.influence) {
          $("#ht-influnce").html(Math.round(data.influence));
          $("#ht-gauge-influ").css("left",(Math.round(data.influence) - 100) + "%");
        }
        if(data.hotWithTimes){
          if(data.hotWithTimes.length == 1){
            for(var i = 0; i < 4; i++){
              date_array.push(time(data.hotWithTimes[0].time,-4 + i));
              data_array.push(0);
            }
            date_array.push(time(data.hotWithTimes[0].time,0));
            data_array.push(data.hotWithTimes[0].hot.toFixed(2));
          }
          if(data.hotWithTimes.length == 2){
            for(var i = 0; i < 3; i++){
              date_array.push(time(data.hotWithTimes[0].time,-3 + i));
              data_array.push(0);
            }
            date_array.push(time(data.hotWithTimes[0].time,0));
            data_array.push(data.hotWithTimes[0].hot.toFixed(2));
            date_array.push(time(data.hotWithTimes[1].time,0));
            data_array.push(data.hotWithTimes[1].hot.toFixed(2));
          }
          if(data.hotWithTimes.length >= 3){
            date_array.push(time(data.hotWithTimes[0].time,-1));
            data_array.push(0);
            data.hotWithTimes.forEach(function (item, index, array) {
              if(index < 7){
                date_array.push(time(item.time,0));
                data_array.push(item.hot.toFixed(2));
              }
            });
          }
          line(document.getElementById("ht-line"),data_array,date_array);
        }
      }
    });
  };

  function addZore(num) {
    return num < 10 ? '0' + num : num;
  }

  function time(time,x) {
    var DAY = 86400;
    var date = new Date((time + x * DAY) * 1000);
    return addZore((date.getMonth() + 1)) + "-" + addZore((date.getDate()));
  }
})(jQuery);
