/**
 * Created by ale on 2017/2/8.
 */
function line(ele) {
	var myChart = echarts.init(ele);
	var option = {
		title: {
			text: '热度',
			left: 'center'
		},

		grid: {
			left: '0',
			right: '3%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
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
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			}
		],
		yAxis: [
			{
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
			}
		],
		series: [

			{
				name: '热度',
				type: 'line',
				lineStyle: {
					normal: {
						width: 2,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0, color: 'rgba(255, 0, 0, 0)'
						}, {
							offset: 0.4, color: 'rgba(255, 0, 0, 0.6)'
						}, {
							offset: 0.5, color: 'rgba(255, 0, 0, 0.4)'
						}, {
							offset: 1, color: 'rgba(255, 99, 71, 0.3)'
						}], false)
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
							offset: 0, color: 'rgba(0, 204, 255, 0)'
						}, {
							offset: 0.5, color: 'rgba(0,204,255, 0.5)'
						}, {
							offset: 1, color: 'rgba(0,204,255, 0.8)'
						}], false)
					}

				},
				label: {
					normal: {
						show: true,
						position: 'top'
					}
				},
				data: [820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	};
	myChart.setOption(option);
}

line(document.getElementById("ht-line"));