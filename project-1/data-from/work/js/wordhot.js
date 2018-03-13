;(function ($) {
  window.onload = function () {
    var server_url = "http://101.204.243.86:9000/api/v2/word/hot";
    $.ajax({
      url:server_url,
      type:'GET',
      dataType:'json',
      success:function (data) {
        var hot1 = "",hot2 = "";
        if(data.length > 0){
          for(var i = 0,len = data.length;i <= len - 1 && i < 20;i++){
            if(i <= 9){
              hot1 += "<li class='item'>" + "<a href='#'>"+ data[i] +"</a>" + "</li>";
            }
            else if(i <= 19){
              hot2 += "<li class='item'>" + "<a href='#'>"+ data[i] +"</a>" + "</li>";
            }
          }
          $("#hot1").html(hot1);
          $("#hot2").html(hot2);
        }
      }
    })
  };
})(jQuery);
