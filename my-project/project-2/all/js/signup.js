/**
 * Created by gqy on 2017/8/18.
 */
require('../css/signup.css');//引入样式
const signupbody = require('../view/signup-body.html');//引入界面
$("body").prepend($(signupbody));//添加界面
;(function ($) {
  var singnUp = {
    //添加必填选项标识，由于界面改动，已经弃用
    addRquire:function () {
      $("form input.require").each(function () {
        var $requir = $("<strong class='required'> * </strong>");
        $(this).parent().append($requir);
      })
    },
    //表单序列化
    serialize:function (form) {
      var arr={};
      for (var i = 0; i < form.elements.length; i++) {
        var feled=form.elements[i];
        switch(feled.type) {
          case undefined:
          case 'button':
          case 'file':
          case 'reset':
          case 'submit':
            break;
          case 'checkbox':
            break;
          case 'radio':
            if (!feled.checked) {
              break;
            }
          default:
            if(feled.name == "confirmPassword"){
              break;
            }
            if (arr[feled.name]) {
              arr[feled.name]=arr[feled.name]+','+feled.value;
            }
            else{
              arr[feled.name]=feled.value;
            }
        }
      }
      return arr
    },
    //表单序列化，由于接口原因，分为了两部分，后期修改
    serializeAnother:function (from) {
      var arr = {};
      arr.uName = $("#inputUser").val();
      for(var i = 0, len = from.elements.length; i < len; i++){
        var feled = from.elements[i];
        if(feled.type == "checkbox" && feled.checked){
          arr[feled.name] = true;
        }
      }
      return arr;
    },

    //失焦事件绑定
    Onblur:function () {
      $("body").on('blur','input',function (event) {
        var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        var target = event.target;
        var $parent = $(target).parent();
        $parent.find(".warning").remove();//每次事件触发时，移除警告
        if(target.id === 'inputUser'){
          if($("#inputUser").val() == ""){
            $parent.append("<span class='warning onError'>用户名不能为空！</span>");
          }
          else{
            if($parent.hasClass("warning")){
              $parent.find(".warning").remove();
            }
//用户名唯一验证
            $.ajax({
              url:"checkUserName",
              type:'GET',
              dataType:'json',
              async:true,
              data:{
                userName:$("#inputUser").val()
              },
              success:function (data) {
                if(data.code == 200){
                  $parent.append("<span class='warning onError'>用户名已存在！</span>");
                }
                if(data.code == 100){
                  if($parent.hasClass("warning")){
                    $parent.find(".warning").remove();
                  }
                }
              }
            })
          }
        }
        else if(target.id === 'inputEmail'){
          if($("#inputEmail").val() == ""){
            $parent.append("<span class='warning onError'>账号不能为空！</span>");
          }
          else if(reg.test($("#inputEmail").val())){
            $parent.append("<span class='warning onError'>请输入正确的邮箱！</span>");
          }
          else {
            if($parent.hasClass("warning")){
              $parent.find(".warning").remove();
            }
          }
        }
        else if(target.id === 'inputPassword'){
          if($("#inputPassword").val() == ""){
            $parent.append("<span class='warning onError'>密码不能为空！</span>");
          }
          else if($("#inputPassword").val().toString().length < 6 || $("#inputPassword").val().toString().length > 8){
            $parent.append("<span class='warning onError'>请输入6-8位的密码！</span>");
          }
          else {
            if($parent.hasClass("warning")){
              $parent.find(".warning").remove();
            }
          }
        }
        else if(target.id === 'inputPassword-2'){
          if($("#inputPassword-2").val() == ""){
            $parent.append("<span class='warning onError'>密码不能为空！</span>");
          }
          else if($("#inputPassword").val() == "" || $("#inputPassword-2").val() != $("#inputPassword").val()){
            $parent.append("<span class='warning onError'>与原密码不同！</span>");
          }
          else {
            if($parent.hasClass("warning")){
              $parent.find(".warning").remove();
            }
          }
        }
      })
    },
    //点击事件绑定
    Onclick:function () {
      var that = this;
      var  time = 0,interval;//验证码重发倒计时变量
      var detal = 0,yanzhengMa;//验证码超时变量
      $("body").on('click','button',function (event) {
        var target = event.target;
        if(target.id === 'ht-newyanzheng'){
          //验证码重发倒计时
          if(time <= 0){
            time = 300;
            interval = setInterval(function () {
              time--;
              $("#ht-newyanzheng").html(time + "s后可点击重发");
              if (time <= 0){
                clearInterval(interval);
                $("#ht-newyanzheng").html("点击重发");
              };
            },1000);
            //验证码获取
            $.ajax({
              url:"sendMail",
              type:'GET',
              dataType:'json',
              async:true,
              data:{
                email:$("#inputEmail").val()
              },
              success:function (data) {
                if(data.code == 100){
                  yanzhengMa = data.extend.message;
                  detal = 15;
                  //验证码超时倒计时
                  var daojishi = setInterval(function () {
                    detal--;
                    if(detal <= 0){
                      clearInterval(daojishi);
                    }
                  },60000);
                }
              }
            })
          };
        }
        else if(target.id === 'ht-yanzheng-sure'){
          var $yan = $("#ht-yanzheng").val();
          if(!yanzhengMa){
            alert("请获取验证码");
          }
          else {
            if($yan.length != 4){
              alert("请输入正确格式的验证码");
            }
            else if(detal <= 0){
              alert("验证码超时");
            }
            else if(yanzhengMa != $yan){
              alert("验证码错误");
            }
            //注册信息上传
            else if($yan == yanzhengMa){
              $.ajax({
                url:"inserUser",
                type:'POST',
                dataType:'json',
                async:true,
                data:that.serialize(document.forms[0]),
                success:function (data) {
                  if(data.code == 100){
                    $.ajax({
                      url:"insertHY",
                      type:'POST',
                      dataType:'json',
                      async:true,
                      data:that.serializeAnother(document.forms[0]),
                      success:function (data) {
                        if(data.code == 100){
                          alert("注册成功");
                          window.location.href = "load.html";
                        }

                        if(data.code == 200){
                          alert("注册失败")
                        }
                      }
                    })

                  }
                  if(data.code == 200){
                    alert("注册失败")
                  }
                }
              })
            }
          }
        }
        else if(target.id === 'submit'){
          if($("form .onError").length == 0){
            $("form .require:input").trigger('blur');
          }
          //console.log(serialize(document.forms[0]));
          var $numError = $("form .onError").length;
          if(!$numError){
            $("#ht-yanzheng-go").css("top",0);
            return false;
          }
          else {
            return false;
          }
        }
      })
    },

    action:function () {
      //this.addRquire();
      this.Onblur();
      this.Onclick();
    }
  }

  singnUp.action();
  exports.serializeAnother = singnUp.serializeAnother;
})(jQuery)





