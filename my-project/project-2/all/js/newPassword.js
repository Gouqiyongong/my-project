require('../css/newPassword.css');
const body = require('../view/newPassword-body.html');
$('body').prepend($(body));
;(function($){
	var index = {
    toLoad:function () {
      if(!localStorage.getItem('userName')){
        alert('登录过期，请重新登录');
        location.href = 'login.html';
      }
    },
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
    onClick:function(){
    	$("body").on('click','button,input',function (event){
    		var e = event || window.event;
    		var target = e.target;
    		if(target.id === 'sure-passWord'){
          $("#forget-2 input").trigger('blur');
          if(!$("#forget-2").find(".onError").length){
            $.ajax({
              url:"updatePW",
              type:'POST',
              dataType:'json',
              async:true,
              data:{
                userName:localStorage.getItem('userName'),
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
    active:function(){
      this.toLoad();
    	this.onBlur();
    	this.onClick();
    }
	};
	index.active();
})(jQuery);