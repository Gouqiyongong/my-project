/**
 * Created by gqy on 2017/9/10.
 */
require('../css/index.css');
const indexbody = require('../view/index-bod.html');
$("body").prepend($(indexbody));
require('../js/client.js');//webRTC主要代码，此处不做讲解，将单独讲解
;(function ($) {
  var index = {
    toLoad:function () {
      if(!localStorage.getItem('userName')){
        alert('登录过期，请重新登录');
        location.href = 'login.html';
      }
    },
    onClick:function () {
      $(document).on("click",'#ht-connection li,li,.ht-jb-to',function (event) {
        var target = event.target;
        if(target.tagName.toLowerCase() == 'li'){
          if(!$(target).hasClass('actived')){
            $(target).siblings().removeClass('actived');
            $(target).addClass('actived');
          }
        }
        if(target.tagName.toLowerCase() == 'span'){
          if(!$(target).parent().hasClass('actived')){
            $(target).parent().siblings().removeClass('actived');
            $(target).parent().addClass('actived');
          }
          if($(target).hasClass('ht-jb')){
            $("#ht-jb-r").val($(target).parent().attr('id'));
            $(".ht-jb-to").css('top','20%');
          }
          if($(target).hasClass('ht-ah')){
            $.ajax({
              url:"user/lookUserMessage",
              type:"GET",
              dataType:'json',
              data:{
                userName:$(target).parent().attr('id')
              },
              success:function (data) {
                var string = '<p class="ht-ahs">';
                if(data.code == 100){
                  for(var name in data.extend.message){
                    if(data.extend.message[name]){
                      string += "<span>" + name + "</span>";
                    }
                  }
                  string += '</p>';
                }
                $(target).parent().parent().find('p').remove();
                $(target).parent().append(string);
                $(target).parent().parent().find('p').animate({width: '0px'}, 2000);
              }
            });
          }
        }

        if(target.id === 'ht-jb-not'){
          $('.ht-jb-to').css('top','-350px');
          $('#ht-jb-yy').val("");
        }

        if(target.id === 'ht-jb-sure'){
          var dat = {
            userb: $("#ht-jb-r").val(),
            reason: $("#ht-jb-yy").val(),
            usera: $(".ht-jb-to input[type='radio']").checked().val() ? "" : localStorage.getItem('userName')
          };
          $.ajax({
            url:"user/lockOne",
            type:"POST",
            dataType:'json',
            success:function (data) {
              if(data.code == 100){
                alert('举报成功');
                $('.ht-jb-to').css('top','-350px');
                $('#ht-jb-yy').val("");
              }
              else{
                if(data.extend.error.reason.length > 0){
                  alert('举报理由不能为空');
                }
              }
            }
          });
        }

        if(target.id === 'out-load'){
          $.ajax({
            url:"http://39.108.174.208:8080/FTF/user/logout",
            type:"GET",
            dataType:'json',
            asycn:true,
            success:function (data) {
              if(data.code == 100){
                alert("退出成功");
                window.location.href = "load.html";
              }
              else{
                alert("退出失败，请重试");
              }
            }
          });
        }
      });
    },
    active:function () {
      this.toLoad();
      this.onClick();
    }
  };
  index.active();
})(jQuery);