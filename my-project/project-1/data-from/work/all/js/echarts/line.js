function line(ele, data, date) {
  var myChart = echarts.init(ele);
  var option = {
    title: {
      text: '热度',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{c}'
    },
    grid: {
      left: '0',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false,

      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#dfdfdf',
          width: 0.8
        }
      },
      data: date
    }],
    yAxis: [{
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#dfdfdf',
          width: 0.8
        }
      },
    }],
    series: [
      {
        name: '热度',
        type: 'line',
        lineStyle: {
          normal: {
            width: 3,
            color: 'rgb(255, 162, 159)'
          }
        },
        // 平滑显示曲线
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: 'rgba(255, 162, 159, 0)'
            }, {
              offset: 0.5,
              color: 'rgba(255, 162, 159, 0.5)'
            }, {
              offset: 1,
              color: 'rgba(255, 162, 159, 0.8)'
            }], false)
          }

        },
        label: {
          normal: {
            show: false,
            position: 'top'
          }
        },
        data: data
      }
    ]
  };
  myChart.setOption(option);
  window.onresize = function () {
    setTimeout(function () {
      myChart.resize();
    }, 0);
  };
}

export default line;