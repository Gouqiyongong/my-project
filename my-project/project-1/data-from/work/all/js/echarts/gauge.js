function gauge(echarts, ele, title, color, value, size, line) {
  var myChart = echarts.init(ele);
  var option = {
    series: [{
      name: title,
      type: 'gauge',
      detail: {
        formatter: '{value}',
        textStyle: {
          fontSize: size
        }
      },
      axisLine: {
        lineStyle: {
          width: line,
          color: [
            [1, color]
          ]
        }
      },
      radius: '90%',
      pointer: {
        width: 4
      },
      startAngle: 245,
      endAngle: -65,
      title: {
        textStyle: {
          fontSize: size
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
        length: 10
      },
      axisLabel: {
        show: false
      },
      data: [{
        value: value,
        name: title,
      }]
    }]
  };
  myChart.setOption(option);
}

export default gauge;
