/**
 * Created by ale on 2017/2/8.
 */
function gauge(ele, title, color, value) {
	var myChart = echarts.init(ele);
	var option = {
		series: [{
			name: title,
			type: 'gauge',
			detail: {
				formatter: '{value}'
			},
			axisLine: {
				lineStyle: {
					width: 10,
					color: [
						[1, color]
					]
				}
			},
			radius: '80%',
			pointer: {
				width: 4
			},
			startAngle: 245,
			endAngle: -65,
			title: {
				textStyle: {
					fontSize: 24
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
				name: title
			}]
		}]
	};
	myChart.setOption(option);
}
