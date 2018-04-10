import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import '../css/eventContent.css';
import '../../node_modules/_bootstrap@3.3.5@bootstrap/dist/js/bootstrap.min.js';
import head from '../view/component/header.html';
import body from '../view/eventContentBody.html';
import {toHerf, formatDate} from './room/room.js';
import pages from '../js/plugin/pages.js';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';
import gauge from '../js/echarts/gauge.js';
;(function(){
  var cacheData = {
    sh: [],
    sz: [],
    cj: [],
    yl: [],
    ty: []
  };
  var eventContent = {
    cacheDataDic(key) {
      switch(key){
        case '社会': return 'sh';
        case '娱乐': return 'yl';
        case '财经': return 'cj';
        case '时政': return 'sz';
        case '体育': return 'ty';
      }
    },

    init(){
      $(document).ready(function(){
        $('body').prepend($(body));
        $('body').prepend($(head));
        toHerf($('#ht-pages a'));
        if(!location.hash.length){
          location.hash = '#/社会';
        }
        var arr = location.hash.split('/');
        var $a = $('#ht-event-nav a[href$=' + decodeURIComponent(arr[1]) + ']');
        var showActive = $a.parent();
        if(!showActive.hasClass('active')){
          showActive.siblings().removeClass('active');
          showActive.addClass('active');
        }
        eventContent.toLoad();
        pages($('#ht-pagination li'), eventContent.maxPage, eventContent.toUrl().hash_3 || 0, eventContent.toUrl().hash_2 || 1, function(active, index){
          var arr = location.hash.split('/');
          location.hash = `#/${arr[1]}/${active}/${index}`;
        }, true)
      })
    },



    toUrl(){
      var hash = decodeURIComponent(location.hash).split('\/');
      var hash_1 = hash[1] || '社会',
      hash_2 = hash[2] || 1,
      hash_3 = hash[3] || 0;
      return {
        url: `http://101.204.243.86:9000/api/v2/event/type/${encodeURI(hash_1)}/${hash_2}`,
        hash_1,
        hash_2,
        hash_3
      }
    },

    toLoad(){
      var url = this.toUrl();
      if(!cacheData[this.cacheDataDic(url.hash_1)][url.hash_2 - 1]){
        let that = this;
        $.ajax({
          url: url.url,
          type: 'GET',
          dataType: 'json',
          async: false,
          success: function (data) {
            var str = '';
            that.maxPage = parseInt(data.totalPages);
            if(data.content.length > 0){
              data.content.forEach(function(item, index, array){
                str += `<div class="item" id="${item.id}">
                <a href="#" target="_self"><img src="${item.picture}" onerror="this.src = '../static/img/u135.jpeg'">
                  <p class="ht-event-describe">
                    <span class="ht-mt">${item.title}</span><br/>
                    <span>${formatDate(item.time)}</span>
                  </p>
                  <div class="ht-event-influence" id="ht-event-influence-${index}"></div>
                </a>
              </div>`
              })
            }
            $('#ht-event').html(str);
              cacheData[that.cacheDataDic(url.hash_1)][url.hash_2 - 1] = {
                str: str,
                data: data.content,
                maxPage: data.totalPages
            }
            
          },
          error: function(){
            console.log('出错');
          }
        });
      }
      else{
        let cache = cacheData[this.cacheDataDic(url.hash_1)][url.hash_2 - 1];
        this.maxPage = cache.maxPage;
        $('#ht-event').html(cache.str);
      }
      let cache = cacheData[this.cacheDataDic(url.hash_1)][url.hash_2 - 1];
      for(let i = 0; i < cache.data.length; i++){
        gauge(echarts, document.getElementById("ht-event-influence-" + i), "影响力", "#ccffff", Math.round(cache.data[i].influence), 10, 5);
      }
    },

    onClick(){
      var that = this;
      $(document).on('click', 'div.item, .nav>li', function(e){
        var event = e || window.event;
        var target = event.target || event.srcElement;
        if($(this).hasClass('item')){
          location.href = "http://101.204.243.86:9000/analysis.html?" + $(this).attr("id");
        }
        if(this.tagName.toLocaleLowerCase() == 'li'){
          if(!$(this).hasClass('active')){
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
          }
        }
      })
    },

    onHashChange(){
      window.onhashchange = function(){
        eventContent.toLoad();
        var arr = location.hash.split('/');
        var $a = $('#ht-event-nav a[href$=' + decodeURIComponent(arr[1]) + ']');
        var showActive = $a.parent();
        if(!showActive.hasClass('active')){
          showActive.siblings().removeClass('active');
          showActive.addClass('active');
        }
        pages($('#ht-pagination li'), eventContent.maxPage, eventContent.toUrl().hash_3 || 0, eventContent.toUrl().hash_2 || 1, function(active, index){
          var arr = location.hash.split('/');
          location.hash = `#/${arr[1]}/${active}/${index}`;
        }, false)
      }
    },

    onUnload(){
      window.onbeforeunload = function(){
        sessionStorage.setItem('hash', location.hash);
      }
    },

    active(){
      this.init();
      this.onClick();
      this.onHashChange();
    }
  }

  eventContent.active();
})();