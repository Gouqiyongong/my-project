/**
 * Created by ale on 2017/2/9.
 */
function cloud(ele) {
	var myChart = echarts.init(ele);
	var option = {
		title: {
			text: '关键词云'
		},
		tooltip: {
			show: true
		},
		series: [{
			name: 'Google Trends',
			type: 'wordCloud',
			size: ['80%', '80%'],
			textRotation : [0,  90],
			textPadding: 0,
			autoSize: {
				enable: true,
				minSize: 14
			},
			data: [
				{
					name: "Sam S Club",
					value: 10000,
					itemStyle: {
						normal: {
							color: 'black'
						}
					}
				},
				{
					name: "Macys",
					value: 6181,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Amy Schumer",
					value: 4386,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Jurassic World",
					value: 4055,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Charter Communications",
					value: 2467,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Chick Fil A",
					value: 2244,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Planet Fitness",
					value: 1898,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Pitch Perfect",
					value: 1484,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Express",
					value: 1112,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Home",
					value: 965,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Johnny Depp",
					value: 847,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Lena Dunham",
					value: 582,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Lewis Hamilton",
					value: 555,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "KXAN",
					value: 550,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Mary Ellen Mark",
					value: 462,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Farrah Abraham",
					value: 366,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Rita Ora",
					value: 360,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Serena Williams",
					value: 282,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "NCAA baseball tournament",
					value: 273,
					itemStyle: createRandomItemStyle()
				},
				{
					name: "Point Break",
					value: 265,
					itemStyle: createRandomItemStyle()
				}
			]
		}]
	};
	myChart.setOption(option);
}

function createRandomItemStyle() {
	return {
		normal: {
			color: 'rgb(' + [
				Math.round(Math.random() * 160),
				Math.round(Math.random() * 160),
				Math.round(Math.random() * 160)
			].join(',') + ')'
		}
	};
}

cloud(document.getElementById("ht-cloud"));