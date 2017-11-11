/**
 * Created by gqy on 2017/8/25.
 */
require('../css/load.css');//引入css代码
const lodebody = require('../view/load-body.html');//引入界面
$("body").prepend($(lodebody));
//下面是动态背景引入的js代码包
require('../js/EasePack.min.js');
require('../js/rAF.js');
require('../js/TweenLite.min.js');
require('../js/demo-1.js');

;(function ($) {
  var load = {//主对象
    //界面高度修改函数
    setHeight:function () {
      var loadHeight = $(".ht-load-to-load");
      var canvas = $("#demo-canvas");
      var height = document.body.clientHeight || document.documentElement.clientHeight;
      height += document.body.scrollTop;
      loadHeight.css("height",height);
      canvas.css("height",height);
    },
//保存用户名
    saveUser:function () {
      localStorage.setItem("userName",$("#inputEmail").val());
    },
//设置验证码链接，修改时间戳，避免浏览器缓存
    changUrl:function () {
      var timestamp = new Date().getTime();
      var src = "login/getCaptchaImage?timestamp=" + timestamp;
      return src;
    },
//验证码链接设置
    changImg:function () {
      var $img = $("#ht-suretxt");
      $img.attr("src",this.changUrl());
    },

    dataSerialize:function () {//表单序列化
      var data = {
        userName:$("#inputEmail").val(),
        passWord:$("#inputPassword").val(),
        rememberMe:$("#inputSure").is(":checked")
      }
      return data;
    },
//失焦事件绑定，以及输入格式验证
    onBlur:function () {
      var that = this;
      $("body").on('blur','input',function (event) {
        var target = event.target;
        var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        var $parent = $(target).parent();

        if(target.id === 'inputEmail'){
          if($parent.has('.warning')){
            $parent.find('.warning').remove();
          }
          if($("#inputEmail").val() == ""){
            $parent.append("<strong class='warning onError'>用户名不能为空</strong>");
          }
        }
        else if(target.id === 'inputPassword'){
          if($parent.has('.warning')){
            $parent.find('.warning').remove();
          }
          if($("#inputPassword").val() == "" || $("#inputPassword").val().length < 6 || $("#inputPassword").val().length > 8){
            $parent.append("<strong class='warning onError'>输入6-8位密码</strong>");
          }
        }
      })
    },
//点击事件绑定
    onClick:function () {
      var that = this;
      var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
      //验证码改变间隔，以及登录按钮激活特征变量
      var su = true,sur = true;
      $("body").on('click','button,input,img',function (event) {
        event.stopPropagation();
        var target = event.target;
        //验证码改变
        if(target.id == "ht-suretxt"){
          if(sur){
            that.changImg();
            sur = false;
          }
          setTimeout(function () {
            sur = true;
          },1000);

        };

        if(target.id == "signin"){
          $("form input").trigger('blur');
          var len = $("form").find(".onError").length;
          if(!len){
            if($("#inputYanzheng").val().length <= 0){
              alert("验证码不能为空");
            }
            else {
              if(su){//登录请求发起
                su = false;
                $.ajax({
                  url:"login/UP",
                  type:'POST',
                  dataType:'json',
                  async:true,
                  data:that.dataSerialize(),
                  success:function (data) {
                    if(data.code == 100){
                      $.ajax({
                        url:"login/checkCaptcha",
                        type:'POST',
                        dataType:'json',
                        async:true,
                        data:{
                          code:$("#inputYanzheng").val().toLocaleLowerCase()
                        },
                        success:function (data) {
                          if(data.code == 100){
                            that.saveUser();
                            localStorage.setItem('userName',$("#inputEmail").val());
                            console.log($("#inputEmail").val());
                            alert("登陆成功");
                            $("#inputEmail").val("");
                            $("#inputPassword").val("");
                            window.location.href = "index.html";
                          }
                          else {
                            alert("验证码错误");
                          }
                        }
                      });
                    }
                    //对举报用户的惩罚
                    else if(data.code == 200 && data.extend.error == "用户被惩罚，账户锁定20分钟，"){
                      $('body').append('<div class="ht-time"><div id="ht-time">20:00</div></div>');
                      alert("由于账户被多次举报，20分钟内不能上线");
                      var min = 19,tim = 60,clearT;
                      clearT = setInterval(function () {
                        tim--;
                        if(tim == -1){
                          min--;
                          tim = 60;
                        }
                        $("#ht-time").html(min + ":" + tim);

                        if(min < 0){
                          clearInterval(clearT);
                          $.ajax({
                            url:"login/chengFaEnd",
                            type:'GET',
                            dataType:'json',
                            async:true,
                            data:{
                              userName:$("#inputUser").val()
                            },

                            success:function (data) {
                              if(data.code == 100){
                                $("body div[class='ht-time']").remove();
                                alert("请点击登录");
                              }
                            }
                          })
                        }
                      },1000);
                    }
                    else if(data.code == 200){
                      alert(data.extend.error);
                    }
                  }
                });
              }
              setTimeout(function () {
                su = true;
              },1000);
              return false;
            }
          }

        }
      });
    },

    onResize:function () {//屏幕大小改变事件绑定
      var that = this;
      window.onresize = function () {
        setTimeout(function () {
          that.setHeight();
        },0);
      }
    },

    active:function () {
      this.onResize();
      this.setHeight();
      this.onBlur();
      this.onClick();
    }
  };
  window.onload = load.changImg();
  load.active();
})(jQuery);






