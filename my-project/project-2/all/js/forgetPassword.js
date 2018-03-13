/**
 * Created by gqy on 2017/8/27.
 */
require('../css/forgetPassword.css');//引入样式
const forgetpasswordbody = require('../view/forgetPassword-body.html');//引入界面

$("body").append($(forgetpasswordbody));
;(function ($) {

  var Forget = function () {

  };

  Forget.prototype = {
    construct:Forget,
    //点击事件绑定
    onClick:function () {
      //验证码重发倒计时变量，以及验证超时变量
      var yanzhengMa = "",yanzhengTime = 0;
      var time = 0,interval1,interval2;
      $("body").on('click','button,input',function (event) {

        var target = event.target;
        if(target.id === 'sure-yanzheng'){
          var userName = $("#userName").val();
          if(userName == ""){
            alert("用户名不能为空");
          }
          //提交修改请求
          else if(time <= 0){
            $.ajax({
              url:"checkUNandSendmail",
              type:'POST',
              dataType:'json',
              async:true,
              data:{
                userName:userName
              },
              success:function (data) {
                console.log(data);
                if(data.code == 100){
                  time = 300;
                  yanzhengMa = data.extend.message;
                  alert("用户名存在，已将验证码发送至您的邮箱，请注意查收");
                  yanzhengTime = 15;
                  //验证超时倒计时
                  interval2 = setInterval(function () {
                    yanzhengTime--;
                    if(yanzhengTime <= 0){
                      clearInterval(interval2);
                    }
                  },60000);
                  //验证码重发倒计时
                  interval1 = setInterval(function () {
                    time--;
                    $("#sure-yanzheng").html(time + "s");
                    if(time <= 0){
                      clearInterval(interval1);
                    }
                  },1000);
                }
                else if(data.code == 200){
                  time = 0;
                  yanzhengTime = 0;
                  alert("用户名不存在");
                }
              }
            });
          }
        }
        else if(target.id === 'sure'){
          var yanzheng = $("#yanzheng").val();
          if(yanzhengMa == ""){
            alert("请获取验证码");
          }
          else if(yanzheng == ""){
            alert("请输入验证码")
          }
          else if(yanzhengTime <= 0){
            alert("验证码超时");
          }
          else if(yanzheng != yanzhengMa){
            alert("验证码错误");
          }
          else {
            $("#forget-1").css("display","none");
            $("#forget-2").css("display","block");
          };
        }
        //新密码修改上传
        else if(target.id === 'sure-passWord'){
          $("#forget-2 input").trigger('blur');
          if(!$("#forget-2").find(".onError").length){
            $.ajax({
              url:"updatePW",
              type:'POST',
              dataType:'json',
              async:true,
              data:{
                userName:$("#userName").val(),
                passWord:$("#passWord").val()
              },
              success:function (data) {
                if(data.code == 100){
                  alert("密码修改成功");
                  window.location.href = "load.html";
                }
                else {
                  alert("密码修改失败");
                }
              }
            });
          }
        }
      });
    },
    //失焦事件绑定
    onBlur:function () {
      $("body").on('blur','#forget-2 input',function (event) {
        var target = event.target;
        var $parent = $(target).parent();
        if(target.id === 'passWord'){
          $parent.find(".onError").remove();
          if($(target).val() == ""){
            $parent.append("<span class='warning onError'>新密码不能为空</span>");
          }
          else if($(target).val().length < 6 || $(target).val().length > 8){
            $parent.append("<span class='warning onError'>请输入6-8位密码</span>");
          }
          else {
            $parent.find(".warning").remove();
          }
        }
        else if(target.id === 'confirmPassword'){
          $parent.find(".onError").remove();
          if($(target).val() == ""){
            $parent.append("<span class='warning onError'>密码不能为空</span>");
          }
          else if($(target).val() != $("#passWord").val()){
            $parent.append("<span class='warning onError'>与密码不同</span>");
          }
          else {
            $parent.find(".warning").remove();
          }
        }
      });
    },

    action:function () {
      this.onBlur();
      this.onClick();
    }
  };

  var forget = new Forget();
  forget.action();
})(jQuery);