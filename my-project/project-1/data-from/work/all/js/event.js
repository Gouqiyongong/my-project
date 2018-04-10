import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import '../css/event.css';
import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/js/bootstrap.min.js';
import head from '../view/component/header.html';
import body from '../view/eventBody.html';
import {toHerf} from './room/room.js'; //头部链接处理

;(function () {
  var event = {
    init() {
      $(document).ready(function () {
        $('body').prepend($(body));
        $('body').prepend($(head));
        toHerf($('#ht-pages a'));
        event.toAjax();
      });
    },

    toAjax(){
      var server_url = "http://101.204.243.86:9000/api/v2/word/hot";
      $.ajax({
        url:server_url,
        type:'GET',
        dataType:'json',
        success:function (data) {
          var hot1 = "",hot2 = "";
          if(data.length > 0 && data[0] != ''){
            for(var i = 0,len = data.length;i <= len - 1 && i < 20;i++){
              if(i <= 9){
                hot1 += "<li class='item'>" + "<a href='#'>"+ data[i] +"</a>" + "</li>";
              }
              else if(i <= 19){
                hot2 += "<li class='item'>" + "<a href='#'>"+ data[i] +"</a>" + "</li>";
              }
            }
          }
          else{
            hot1 += "<li class='item'>" + "<a href='#'>"+ '暂无' +"</a>" + "</li>";
          }
          $("#hot1").html(hot1);
          $("#hot2").html(hot2);
        },
        error:function (){
          $("#hot1").html("<li class='item'>" + "<a href='#'>"+ '出现错误，请刷新页面重试' +"</a>" + "</li>");
          $("#hot2").html('');
        }
      })
    },

    onClick() {
      $('body').on('click', '.ht-event-list a', function(e){
        var $href = $(this).attr('href');
        $(this).attr("href", "eventContent.html#/" + $href);
      })
    },

    active(){
      this.init();
      this.onClick();
    }
  }

  event.active();
})();