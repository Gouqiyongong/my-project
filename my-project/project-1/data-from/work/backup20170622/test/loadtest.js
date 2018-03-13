onload = function () {
  var vid = /\d+/g.exec(location.search)[0];
  var vt = /\&vt=[a-zA-z]+/.exec(location.search)[0].slice(4);
  var serverurl = "http://101.204.243.88:9000/eventAnalyse/events/detail/";
  function loadEvent(vn, tn) {
    $.ajax({
      type: 'get',
      url: "http://101.204.243.88:9000/eventAnalyse/events/class/event?vntNum=" + vn + "&tableName=" + tn,
      dataType: 'json',
      async: true,
      success: function (eve) {
        var ejsdetail = {};
        ejsdetail.titl = eve.data.vntTitle;
        ejsdetail.infu = eve.data.vntInfluence;
        ejsdetail.lab = eve.data.vntOriginalWebs;
        ejsdetail.ltime = formatDate(eve.data.vntTime);
        getEventData(ejsdetail);
      }
    });
  }

  function getEventData(data) {
    document.getElementById("anTitle").innerHTML = data.titl;
    document.getElementById("lineTit").innerHTML = data.titl;
    document.getElementById("anInf").innerHTML = data.infu;
    document.getElementById("labels").innerHTML = data.lab;
    document.getElementById("lineTime").innerHTML = data.ltime;
  }

  function formatDate(tm) {
    var d = new Date(tm);
    var date = (d.getFullYear()) + "-" +
      (d.getMonth() + 1) + "-" +
      (d.getDate());
    return date;
  }

  function ejsList(table) {
    var evele = document.getElementById("sameEvents").innerHTML;
    var events = new Array();
    $.ajax({
      type: "get",
      url: "http://101.204.243.88:9000/eventAnalyse/events/class/list?tableName=" + table,
      async: true,
      dataType: 'json',
      success: function (eve) {
        var ejse = [];
        eve.data.forEach(function (item) {
          var ejslist = {};
          //ejslist.id = item.vntNum;
          ejslist.name = item.vntTitle;
          //ejslist.dat = formatDate(item.vntTime);
          ejslist.num = item.vntInfluence;
          ejse.push(ejslist);
        });
        for (var i = 0; i < 5; i++) {
          events[i] = ejse[i];
        }
        var lists = ejs.render(evele, {
          events: events
        });
        document.getElementById("likeEvent").innerHTML = lists;
      }
    });
  }
  if(vid && vt){
    loadEvent(vid,vt);
    getWord(vid, vt, serverurl, document.getElementById("wordsCloud"));
    getLine(vid, vt, serverurl, document.getElementById("anLine"));
    getEmotion(vid, vt, serverurl, document.getElementById("emoPi"), document.getElementById("emoBar"));
    ejsList(vt);
  }
};/**
 * Created by XCC on 2017/2/18.
 */
