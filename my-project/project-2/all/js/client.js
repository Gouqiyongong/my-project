/* 
* @Author: fxy
* @Date:   2017-08-08 19:53:42
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-10 17:23:33
*/

(function($){
  $(document).ready(function () {
    ajax();
  })
  function ajax() {
    var str = "";
    var $ul = $("#ht-connection");
    if(localStorage.getItem('userName')){
      $.ajax({
        url:"http://39.108.174.208:8080/FTF/user/lookUserContacts",
        type:'GET',
        dataType:'json',
        data:{userName: localStorage.getItem('userName')},
        async:false,
        success:function (data) {
          if(data.code == 100){
            if(data.extend.message.length == 0){
              str = '<li class="actived"><span>没有联系人</span></li>';
            }
            else{
              data.extend.message.forEach(function (item, index) {
                if(index == 0){
                  str += `<li class="actived"><span id="${item.userB}" title="${time(item.time)}"></span>
                      <span class="ht-jb" title="举报">↓↓</span>
                      <span class="ht-ah" title="爱好">↑↑</span></li>`;
                }
                else{
                  str += `<li><span id="${item.userB}" title="${time(item.time)}"></span>
                      <span class="ht-jb" title="举报">↓↓</span>
                      <span class="ht-ah" title="爱好">↑↑</span></li>`;
                }
              });
            }
          }
          else if (data.code == 200) {}{
            str = '<li class="actived"><span>没有联系人</span></li>';
          }
        }
      });
      console.log(str);
      $ul[0].innerHTML = str;
      console.log($ul[0]);
    }
    function time(time) {
      var d = new Date(time);
      return d.getFullYear() + "/" + (d.getMonth() + 1) + d.getMinutes();
    }
  }
  var Fxy = function(id) {
      this.elem = document.querySelector(id);
  }
  Fxy.prototype.on = function(type, fn) {
      var elem = this.elem;
      if (elem.nodeType != 1) {
          throw new Error('targetElement is not a right document');
      } else if (elem.addEventListener) {  // 2¼¶
          elem.addEventListener(type, fn, false);
      } else if (elem.attachEvent) {
          elem.attachEvent(type, 'on'+type);
      } else { // 0¼¶
          elem['on'+type] = fn;
      }
  }
  /*
  *
  *   Gloabal veriable
  *
   */

  function Dom(typ) {
      switch (typ){
        case 1:
          loginBtn.elem.style.display = 'none';
          callBtn.elem.style.display = 'block';
          hangUpBtn.elem.style.display = 'none';
          time = 40;
          break;
        case 2:
          loginBtn.elem.style.display = 'none';
          callBtn.elem.style.display = 'none';
          hangUpBtn.elem.style.display = 'block';
          setTime()
          break;
        case 3:
          loginBtn.elem.style.display = 'block';
          callBtn.elem.style.display = 'none';
          hangUpBtn.elem.style.display = 'none';
          ajax();
          break;
      }
    }
  function setTime() {
    $("#ht-opacity").css('display','block');
    $("#ht-opacity").fadeOut(15000,function () {
      time -= 15;
    });
    var timeout = setInterval(function () {
      time--;
      if(time <= 0){
        leave();
        time = 40;
        clearInterval(timeout);
      }
    },1000);
  }
  var name,
      connectedUser;

  //Óë·þÎñÆ÷½¨Á¢Á¬½Ó£¬´«µÝ·þÎñÆ÷µØÖ·£¬ÔÙ¼ÓÉÏws£º//ÎªÇ°×ºÀ´ÊµÏÖ
  //"ws://"+window.location.host+'/FTF/u/websocket'
  var connection = new WebSocket('ws://39.108.174.208:8080/FTF/u/websocket');
  // var connection = new WebSocket('ws://localhost:8888');


  var loginPage = new Fxy('#login-page'),
      //usernameInput = new Fxy('#username'),
      loginBtn = new Fxy('#ht-video-login'),
      //callPage = new Fxy('#call-page'),
      //theirUsernameInput = new Fxy('#their-username'),
      callBtn = new Fxy('#ht-video-go'),
      hangUpBtn = new Fxy('#ht-video-back');

      //callPage.elem.style.display = 'none';

  var myVideo = new Fxy('#ht-myvideo'),
      theirVideo = new Fxy('#ht-hevideo'),
      myConnection,
      //theirConnection,
      stream,
      time = 0;
/*
*   ÊÂ¼þ°ó¶¨
*/
  //µ¥»÷µÇÂ¼
  loginBtn.on('click', function(e){
    login();


    /* name = usernameInput.elem.value;

       if (name.length > 0) {
           send({
               type: 'login'
           })
       }*/
  })
  function login() {
    name = localStorage.getItem("userName");
    if (name.length > 0) {
      send({
        type: 'login'
      });
    }
    else {
      alert("ÓÃ»§ÉÐÎ´µÇÂ¼");
      window.location.href = "login.html";
    }
  }
  //
  //¹Ò¶Ï

function leave() {
  send({
    type: 'leave',
  });
  onLeave();
}

  hangUpBtn.on('click', function(e){
      leave();
  })
  //Ô¶³ÌÁ¬½Ó
  callBtn.on('click', function(e){
      // var theirUserName = theirUsernameInput.value;
    //login();
    startPeerConnection();
    loginBtn.elem.style.display = "none";
    callBtn.elem.style.display = "none";
    hangUpBtn.elem.style.display = "block";
  })
  //µÇÂ¼
  function onLogin(success){
      if (success == false) {
          alert("Login unsuccessful, please try a different name.");
      }else{
          Dom(1);
          startConnection();
      }
  }
  //offer½ÓÊÕ
  function onOffer(offer, name){
      console.log(name, 'ÇëÇó½¨Á¢ÊÓÆµÁ´½Ó')
      connectedUser = name;
      //½ÓÊÕÔ¶³ÌSDP
      console.log('½ÓÊÕµ½µÄoffer', offer);
      myConnection.setRemoteDescription(new RTCSessionDescription(offer));
      //
      myConnection.createAnswer(function(answer){
          myConnection.setLocalDescription(answer);
          send({
              type: 'answer',
              answer: answer
          })
      }, function(error){
        console.log("An error has occurred at Offer", error);
          alert("An error has occurred at Offer")
      })
  }

  //Ó¦´ð
  function onAnswer(answer){
      myConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
  // ice ºòÑ¡Í¨µÀ
  function onCandidate(candidate){
      console.log('½ÓÊÕµ½µÄcandidate', candidate);
      myConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
  // ¹Ò¶Ï
  function onLeave(){
      connectedUser = null;
      //theirVideo.elem.src = null;
      myConnection.close();
      myConnection.onicecandidate = null;
      myConnection.onaddstream = null;
      Dom(3);
      setupPeerConnection(stream);
  }
  connection.onopen = function(){  //·þÎñÆ÷Á¬½Ó³É¹¦
      console.log("Connected");
  }

  //Í¨¹ýonmessage·½·¨»ñÈ¡ËùÓÐ»ùÓÚWebRTCµÄÏûÏ¢
  connection.onmessage = function(msg){
      console.log('msg', msg);
      console.log("Got message", JSON.parse(msg.data) );
      var data = JSON.parse(msg.data);
      switch(data.type){
          case 'login':
              onLogin(data.message.login);
              break;
          case 'offer':
              onOffer(JSON.parse(data.message.offer), data.message.userName);
              break;
          case 'answer':
              onAnswer(JSON.parse(data.message.answer));
              break;
          case 'candidate':
              onCandidate(JSON.parse(data.message.candidate));
              break;
          case 'leave':
              onLeave();
              break;
          default:
              break;
      }
  }
  connection.onerror = function(err){
      console.log("Got error", err);
  }

  function send(msg){
      if (connectedUser) {
          msg.connectedUser = connectedUser;  //½«Á¬½Ó¶ÔÏó´øÈë
      }
      msg.userName = name;
      console.log('send:',  JSON.stringify(msg));
      connection.send(  JSON.stringify(msg));
  }


  function startConnection(){
      if (hasUserMedia()) { //»ñÈ¡ÊÓÆµÁ÷
        var opts = {
          video: true,
          audio: true,
        }
        navigator.mediaDevices.
        getUserMedia(opts).
        then(function(myStream){
          stream = myStream;
          // myVideo.src = window.URL.createObjectURL(stream);
          myVideo.elem.srcObject = stream;
          if (hasRTCPeerConnection()){
            setupPeerConnection(stream);
          }else{
            alert("sorry, your browser does not support WebRTC");
          }
        }).catch(function(err){
          console.log(err);
        })
      }else{
          alert("sorry, your browser does not support WebRTC");
      }
  }



  function setupPeerConnection(stream){
      var configuration = {
          "iceServers": [{
              "urls": "stun:stun.l.google.com:19302"  //google stun
          }]
      }
      myConnection = new RTCPeerConnection(configuration);
      //ÉèÖÃÁ÷µÄ¼àÌý
      myConnection.addStream(stream);
      myConnection.onaddstream = function(e){
      Dom(2);
      theirVideo.elem.srcObject = e.stream;
      }
      //ÉèÖÃice´¦ÀíÊÂ¼þ
      myConnection.onicecandidate = function(e){
          console.log('ConnectionÌí¼Ócandidate')
          if (e.candidate) {
              send({
                  type: 'candidate',
                  candidate: e.candidate
              })
          }
      }
  }
  function startPeerConnection(){
      // connectedUser = user;  //±£´æconnTarget

      //´´½¨offer
      //
      //myPeerConnection.createOffer(successCallback, failureCallback, [options])
      //  MDN ¶ÔcreateOfferµÄ×¢½â
      //The createOffer() method of the RTCPeerConnection interface initiates the creation of an SDP offer which includes information about any MediaStreamTracks already attached to the WebRTC session, codec and options supported by the browser, and any candidates already gathered by the ICE agent, for the purpose of being sent over the signaling channel to a potential peer to request a connection or to update the configuration of an existing connection.
      //
      //´´½¨SDP(°üÀ¨×Ô¼ºä¯ÀÀÆ÷µÄ»á»°,±àÒëÆ÷ºÍÉè±¸Ö§³ÖÐÅÏ¢)
      myConnection.createOffer(function(offer){
          send({
              type: 'offer',
              offer: offer  //SDP ÐÅÏ¢
          })
          //½«SDP·ÅÈëconnection
          myConnection.setLocalDescription(offer); //asyn
      }, function(error){
        console.log("An error has occurred at createOffer", error);
        alert("An error has occurred");
      })
  }




  function hasUserMedia(){
      navigator.getUserMedia = navigator.webkitGetUserMedia ||
          navigator.getUserMedia ||
          navigator.mozGetUserMedia  ||  // mozÄÚºË
          navigator.msGetUserMedia;
      return !!navigator.getUserMedia;
  }

  function hasRTCPeerConnection(){
      window.RTCPeerConnection = window.RTCPeerConnection ||
          window.webkitRTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.msRTCPeerConnection;

      window.RTCSessionDescription = window.RTCSessionDescription ||
          window.webkitRTCSessionDescription ||
          window.mozRTCSessionDescription ||
          window.msRTCSessionDescription;

      window.RTCIceCandidate = window.RTCIceCandidate ||
          window.webkitIceCandidate ||
          window.mozIceCandidate;
          // window.msIceCandidate;

      return !!window.RTCPeerConnection;
  }

})(jQuery);