/**
 * Created by ale on 2017/2/9.
 */
function pia(ele) {
	var myChart = echarts.init(ele);
	var option = {
		title: {
			text: '情感分布',
			x: 'left'
		},
		calculable: true,
		series: [
			{
				name: '情感词',
				type: 'pie',
				radius: [30, 120],
				center: ['50%', '50%'],
				hoverAnimation: true,
				roseType: 'radius',
				labelLine: {
					normal: {
						lineStyle: {
							width: 5
						}
					}
				},
				data: [
					{value: 10, name: '喜'},
					{value: 5, name: '怒'},
					{value: 15, name: '哀'},
					{value: 25, name: '惧'},
					{value: 20, name: '中'}
				]
			}
		]
	};
	myChart.setOption(option);
}

pia(document.getElementById("ht-pia"));