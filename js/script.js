var csv = dsv(',');
// get data from csv, pass to parse function
$.ajax({
	url: 'data/data-posts.csv',
	success: parseData
});

// split D/M/YYYY format, month is 0 indexed (whaaat?) -> correct
function parseData(str) {
	var data = csv.parse(str);
	data = data.map(function(d) {
		var mdy = d.date.split('/');
		var date = new Date(mdy[2], mdy[0] - 1, mdy[1]);
		return [date.getTime(), +d.posts];
	});
	data.sort(function(a, b) {return a[0] - b[0]});
	renderChart(data);
}
// make chart and customize
function renderChart(data) {
	$('#container').highcharts('StockChart', {
		colors: [ 
			// colors taken from the palette on this site: http://www.electionguide.org/map/
			'#E9322D','#E74C3C','#2980B9','#16A085','#24748C','#2f7ed8'
		],
		rangeSelector: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'IFES Posts Over Time',
			style: {
				"color": "#E9322D"
			}
		},
		xAxis: {
			title: {
				align: "middle",
				text: 'Date',
				style: {
					"color": "#E74C3C"
				}
			}
		},
		yAxis: {
			title: {
				align: "middle",
				text: "Number of Posts",
				style: {
					"color": "#E74C3C"
				}
			}
		},
		legend: {
			enabled: true
		},
		scrollbar: {
			barBackgroundColor: "#E74C3C",
			barBorderRadius: 5,
			buttonBackgroundColor: "#E74C3C"
		},
		series: [{
			name: 'IFES',
			data: data
		}]
	});
}
