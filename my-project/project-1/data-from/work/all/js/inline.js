import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import '../css/inline.css';
import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/js/bootstrap.min.js';
import head from '../view/component/header.html';
import body from '../view/inlineBody.html';
import {toHerf} from './room/room.js';

;(function () {
  //兼容火狐
  window.onload = function () {
    $("#ht-textarea").val("当年山奴亚国王为了听故事的结尾，就把杀山鲁佐德的日期延迟了一天又一天。宰相的山鲁佐德每天讲一个故事，她的故事无穷无尽，一个比一个精彩，一直讲到第一千零一夜，终于感动了国王。山努亚说：凭安拉的名义起誓，我决心不杀你了，你的故事让我感动。我将把这些故事记录下来，永远保存。”如今有故事的人快到一千个了，有故事的人作为一个世间百态的平台，你可以从中看到尘世间芸芸众生的沸腾挣扎，为了七情六欲而奋力拼搏，收获几缕风光，大部分时候还是吃一嘴灰，真无奈啊。谁都渴望奇迹发生，就像山鲁佐德在一千个夜里的祈祷，西西弗斯渴望石头伫立在山顶，我们都希望生命中的故事不会变成事故，每天都凝固在美好发生的一瞬间，为此我们日夜努力不停息，就为了一千个日夜后，能够看见更坚硬的土地和更美好的自己。");
  }

  //根模板
  var root = {
    n: "名词",
    t: "时间词",
    f: "合成方位词",
    q: "数量词",
    r: "代词",
    v: "动词",
    a: "形容词",
    d: "副词",
    p: "介词",
    c: "连词",
    u: "助词",
    y: "声音词",
    i: "成语",
    l: "习惯用语",
    w: "标点符号"
  }

  //初始数据
  var tag = ['t', 'n', 'n', 'p', 'v', 'n', 'u', 'n', 'w', 'd', 'p', 'v', 'n', 'u', 'n', 'v', 'u', 'n', 'd', 'n', 'w', 'n', 'u', 'n', 't', 'v', 'q', 'n', 'w', 'r', 'u', 'n', 'i', 'w', 'q', 'p', 'q', 'a', 'w', 'd', 'v', 'g', 'l', 'w', 'd', 'v', 'u', 'n', 'w', 'n', 'v', 'w', 'p', 'n', 'u', 'n', 'v', 'w', 'r', 'd', 'v', 'r', 'u', 'w', 'r', 'u', 'n', 'v', 'r', 'v', 'w', 'r', 'd', 'p', 'r', 'n', 'n', 'w', 'd', 'v', 'w', 'w', 't', 'v', 'n', 'u', 'n', 'd', 'v', 'q', 'u', 'w', 'v', 'n', 'u', 'n', 'v', 'q', 'i', 'u', 'n', 'w', 'r', 'v', 'd', 'v', 'n', 'i', 'u', 'v', 'v', 'w', 'p', 'i', 'c', 'i', 'w', 'v', 'n', 'n', 'w', 'q', 'n', 'c', 'v', 'n', 'n', 'w', 'd', 'a', 'y', 'w', 'r', 'd', 'v', 'n', 'v', 'w', 'd', 'p', 'n', 'p', 'q', 't', 'u', 'v', 'w', 'n', 'v', 'n', 'v', 'p', 'n', 'w', 'r', 'd', 'v', 'n', 'f', 'u', 'n', 'n', 'v', 'n', 'w', 'r', 'd', 'v', 'p', 'a', 'v', 'u', 'n', 'w', 'v', 'r', 'd', 'a', 'v', 'w', 'd', 'p', 'q', 'n', 'f', 'w', 'v', 'v', 'd', 'a', 'u', 'n', 'c', 'd', 'a', 'u', 'r', 'w'];
  var word = ["当年", "山奴亚", "国王", "为了", "听", "故事", "的", "结尾", "，", "就", "把", "杀", "山鲁佐德", "的", "日期", "延迟", "了", "一天", "又", "一天", "。", "宰相", "的", "山鲁佐德", "每天", "讲", "一个", "故事", "，", "她", "的", "故事", "无穷无尽", "，", "一个", "比", "一个", "精彩", "，", "一直", "讲到", "第", "一千零一夜", "，", "终于", "感动", "了", "国王", "。", "山努亚", "说", "：", "凭", "安拉", "的", "名义", "起誓", "，", "我", "决心", "不杀", "你", "了", "，", "你", "的", "故事", "让", "我", "感动", "。", "我", "将", "把", "这些", "故事", "记录下来", "，", "永远", "保存", "。", "”", "如今", "有", "故事", "的", "人", "快", "到", "一千个", "了", "，", "有", "故事", "的", "人", "作为", "一个", "世间百态", "的", "平台", "，", "你", "可以", "从中", "看到", "尘世间", "芸芸众生", "的", "沸腾", "挣扎", "，", "为了", "七情六欲", "而", "奋力拼搏", "，", "收获", "几缕", "风光", "，", "大部分", "时候", "还是", "吃", "一嘴", "灰", "，", "真", "无奈", "啊", "。", "谁", "都", "渴望", "奇迹", "发生", "，", "就", "像", "山鲁佐德", "在", "一千个", "夜里", "的", "祈祷", "，", "西西弗斯", "渴望", "石头", "伫立", "在", "山顶", "，", "我们", "都", "希望", "生命", "中", "的", "故事", "不会", "变成", "事故", "，", "每天", "都", "凝固", "在", "美好", "发生", "的", "一瞬间", "，", "为此", "我们", "日夜", "努力", "不停息", "，", "就", "为了", "一千个", "日夜", "后", "，", "能够", "看见", "更", "坚硬", "的", "土地", "和", "更", "美好", "的", "自己", "。"]
  //主处理单体
  var index = {
    nav: [],
    oddtip: '',
    init(){
      var that = this;
      $(document).ready(function(){
        $('body').prepend($(body));
        $('body').prepend($(head));
        toHerf($('#ht-pages a'),1);
        that.toWords();
        that.toNav();
        that.toZF(0.0211871266145);
        that.toZ("宰相的山鲁佐德每天讲一个故事，她的故事无穷无尽。")
        that.toG(["故事", "山鲁佐", "一千个", "日夜", "渴望", "美好", "感动", "为了", "国王", "不停歇"]);
        that.onClick();
        that.onKepress();
        that.onBlur();
      })
    },
    toData() {
      this.nav = [];
      var that = this;
      var j, len;
      tag.forEach(function (item, index, arr) {
        for (j = 0, len = that.nav.length; j < len; j++) {
          if (that.nav[j] == item) {
            break;
          }
        }
        if (j >= len) {
          that.nav.push(item);
        }
      });
      this.oddtip = this.nav[0];
    },

    toNav() {
      var na = "", once = 0;
      this.nav.forEach(function (item, index, arr) {
        if (root[item] !== undefined) {
          if (once == 0) {
            na += "<li class=" + "ht-cixing-1-" + item + "-1>" + root[item] + "</li>";
            once++;
          }
          else {
            na += "<li class=" + "ht-cixing-1-" + item + ">" + root[item] + "</li>";
          }
        }
      });
      $("#ht-cixing").html(na);
      this.toAddclass(this.nav[0]);
    },

    toAddclass(tip) {
      var $span = $("#ht-word span");
      this.oddtip = tip;
      $.each($span, function (index, thiz) {
        if ($(thiz).hasClass(tip)) {
          $(thiz).addClass("ht-cixing-1-" + tip + "-1");
        }
      });
    },

    toRemoveclass(tip) {
      var $span = $("#ht-word span");
      $.each($span, function (index, thiz) {
        if ($(thiz).hasClass(tip)) {
          $(thiz).removeClass("ht-cixing-1-" + tip + "-1");
        }
      });
    },

    toWords() {
      var na = "";
      this.toData();
      word.forEach(function (item, index, arr) {
        na += "<span class=" + tag[index] + ">" + item + "</span>";
      });
      $("#ht-word").html(na);
    },

    toZF(su) {
      var z, f;
      if (parseFloat(su) >= 0) {
        z = ((parseFloat(su) + 1) / 2).toFixed(2) * 100;
        z = Math.floor(z);
        f = 100 - z;
      }
      else {
        f = ((Math.abs(parseFloat(su)) + 1) / 2).toFixed(2) * 100;
        f = Math.floor(f);
        z = 100 - f;
      }
      $("#ht-qinggan-zheng-w").html(z + "%");
      $("#ht-qinggan-fu-w").html(f + "%");
      $("#ht-qinggan-zheng").css("width", f + "%");
      $("#ht-qinggan-fu").css("width", z + "%");

    },

    toZ(z) {
      $("#ht-text-zhaiyao").html(z);
    },

    toG(g) {
      var guan = "";
      g.forEach(function (item, index, arr) {
        guan += "<span>" + item + "</span>";
      });
      $("#ht-text-guanjian").html(guan);
    },

    onClick() {
      var that = this;
      $("#ht-cixing li").click(function (event) {
        var clas = $(this).attr('class');
        var tip = clas.slice(-1);
        if (tip != 1) {
          var newclass = clas + "-1";
          $(this).siblings().each(function (index, thiz) {
            if ($(thiz).attr('class').slice(-1) == 1) {
              $(thiz).attr('class', "ht-cixing-1-" + that.oddtip);
              console.log(that.oddtip);
            }
          });
          that.toRemoveclass(that.oddtip);
          $(this).attr('class', newclass);
          that.toAddclass(tip);
        }
      })
    },

    toPush(value) {
      var that = this;
      var server_url = "http://101.204.243.86:9000/api/v2/event/";
      $.ajax({
        url: server_url + "tag/" + value,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data.tag) {
            tag = data.tag;
          }
          if (data.word) {
            word = data.word;
          }
          that.toWords();
          that.toNav();
          that.onClick();
        }
      });
      $.ajax({
        url: server_url + "emotion/" + value,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data) {
            that.toZF(parseFloat(data));
          }

        }
      });
      $.ajax({
        url: server_url + "keyword/" + value,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data) {
            that.toG(data);
          }
        }
      });
      $.ajax({
        url: server_url + "abstract/" + value,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data) {
            that.toZ(data);
          }
        }
      });
    },

    onKepress() {
      var that = this;
      $("#ht-textarea").keypress(function (event) {
        var e = event || window.event;
        var code = e.charCode || e.keyCode;
        if (e && code == 13) {
          that.toPush($(this).val());

        }
      })
    },

    onBlur() {
      var that = this;
      $("#ht-textarea").blur(function (event) {
        var e = event || window.event;
        that.toPush($(this).val());
      })
    },

    active() {
      this.init();
    }
  }
  index.active();
})();