function cloud(ele, data, val) {
  var myChart = echarts.init(ele);
  var newData = [];
  newData.push({
    name: data[0],
    value: val[0],
    textStyle: {
      normal: {
        color: 'rgb(251,96,127)'
      },
      emphasis: {
        color: 'rgb(253,91,153)'
      }
    }
  });
  for (var i = 1, len = data.length; i < len; i++) {
    newData.push({
      name: data[i],
      value: val[i]
    })
  }
  var option = {
    title: {
      text: '关键词云'
    },
    tooltip: {
      show: true
    },
    series: [{
      type: 'wordCloud',
      gridSize: 20,
      //sizeRange: [12, 55],
      textRotation: [0, 45, 90],
      //rotationRange: [0, 90],
      center: ['50%', '50%'],
      x: 'left',
      size: ['70%', '70%'],
      autoSize: {
        enable: true,
        minSize: 12
      },
      textStyle: {
        normal: {
          color: function () {
            return 'rgb(' + [
                Math.round(Math.random() * 200),
                Math.round(Math.random() * 200),
                Math.round(Math.random() * 200)
              ].join(',') + ')';
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: newData
    }]
  };
  myChart.setOption(option);
  // 使图标可以自动计算区域大小
  window.addEventListener("resize", function () {
    setTimeout(function () {
      myChart.resize();
    }, 0)
  });
}

export default cloud;

