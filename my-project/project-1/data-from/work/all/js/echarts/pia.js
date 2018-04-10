function pia(ele, data) {
  var myChart = echarts.init(ele);
  var val = [];
  for (var i = 0; i < 3; i++) {
    val.push((data[i] / (data[0] + data[1] + data[2]) * 100).toFixed(2));
  }
  var option = {
    title: {
      text: '情感分析',
      x: 'left',
      fontStyle: {
        color: 'rgb(0,0,0)'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b}"
    },
    legend: {
      orient: 'horizontal',
      x: "center",
      y: "bottom",
      data: ["正", "负", "中"]
    },
    color: ['rgb(210,217,255)', 'rgb(255,158,157)', 'rgb(125,216,198)'],
    series: [
      {
        name: '情感分析',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        data: [
          {
            value: data[0],
            name: '负  ' + val[0] + '%  ' + data[0],
          },
          {
            value: data[1],
            name: '正  ' + val[1] + '%  ' + data[1],
          },
          {
            value: data[2],
            name: '中  ' + val[2] + '%  ' + data[2],
          }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    setTimeout(function () {
      myChart.resize();
    }, 0)
  });
}

export default pia;