function lineWord(ele, Data, time) {
  var max = Math.max.apply(Math, Data);
  var radius = max * 0.1;
  var myChart = echarts.init(ele);
  var option = {
    backgroundColor: 'rgba(0,0,0,0)',
    title: {
      text: '事件评论量统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        var date = new Date(params.value[0]);
        var data = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        return data + '<br/>' + "   " + params.value[2] + "条评论";
      }
    },
    toolbox: {
      show: false,
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    dataZoom: {
      show: false,
    },
    grid: {
      y2: 145
    },
    yAxis: [{
      splitLine: {
        show: false
      }
    }],
    xAxis: [{
      splitLine: {
        show: false
      },
      type: 'time',
      splitNumber: 24
    }],
    series: [{
      name: 'series1',
      type: 'line',
      showAllSymbol: true,
      itemStyle: {
        normal: {
          color: '#00CCFD',
          lineStyle: {
            color: '#00CCFD'
          }
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: 'rgba(0, 204, 253, 0)'
          }, {
            offset: 0.5,
            color: 'rgba(0, 204, 253, 0.5)'
          }, {
            offset: 1,
            color: 'rgba(0, 204, 253, 0.8)'
          }], false)
        }
      },
      symbolSize: function (value) {
        return Math.round(value[2] / radius) + 2;
      },
      data: (function () {
        var d = [];
        var len = 0;
        var now = Data[0];
        var value;
        while (len++ < Data.length) {
          d.push([
            new Date(time[len]),
            Data[len],
            Data[len]
          ]);
        }
        return d;
      })()
    }]
  };
  myChart.setOption(option);
  window.addEventListener('resize', function () {
    setTimeout(function () {
      myChart.resize();
    }, 0);
  });
}

export default lineWord;