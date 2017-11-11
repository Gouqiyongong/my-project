/**
 * Created by gqy on 2017/9/11.
 */
require('../css/provi.css');
const provibody = require('../view/provi-body.html');
$("body").prepend($(provibody));
;(function ($) {
  var index = {
    toData:function () {
      $.ajax({
          url:"http://39.108.174.208:8080/FTF/user/lookUserMessage",
          type:"GET",
          dataType:'json',
          data:{
            userName:localStorage.getItem('userName')
          },
          success:function(data){
            if(data.code == 100){
              for(var mes in data.extend.message){
                if(data.extend.message[mes] == true){
                  $("input").each(function (index,thiz) {
                    if($(thiz).attr('name') == mes){
                      $(thiz).attr('checked',true);
                    }
                  });
                }
              }
            }
          }
      })
    },
    toLoad:function () {
      if(!localStorage.getItem('userName')){
        alert('登录过期，请重新登录');
        location.href = 'login.html';
      }
    },
    serializeAnother:function (from) {
      var arr = {};
      arr.uName = $("#inputUser").val();
      for(var i = 0, len = from.elements.length; i < len; i++){
        var feled = from.elements[i];
        if(feled.type == "checkbox" && feled.checked){
          arr[feled.name] = true;
        }
        else{
          arr[feled.name] = false;
        }
      }
      return arr;
    },
    onClick:function () {
      var that = this;
      $("body").on('click','button,li',function (event){
        var e = event || window.event;
        e.preventDefault();
        var target = e.target;
        if(target.id === 'submit'){
          var d = that.serializeAnother(document.forms[0]);
          d.uName = localStorage.getItem('userName');
          $.ajax({
            url: "http://39.108.174.208:8080/FTF/user/updateUserMessage",
            type: 'POST',
            dataType: 'json',
            async: true,
            data: d,
            success: function (data) {
              if(data.code == 100){
                alert('修改成功');
              }
              else if(data.extend.error.uName.length > 0){
                alert("登录超时");
                window.location.href = 'load.html';
              }
              else {

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
      this.toData();
    }
  }
  index.active();
})(jQuery);