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

function renderChart(data) {
	$('#container').highcharts('StockChart', {
		rangeSelector: {
			selected: 1
		},
		title: {
			text: 'IFES Posts Over Time'
		},
		credits: {
			enabled: false

		},
		xAxis: {
			title: {
				align: "middle",
				text: 'Date'
			}
		},
		yAxis: {
			title: {
				align: "middle",
				text: "Number of Posts"
			}
		},
		series: [{
			name: 'IFES',
			data: data
		}]
	});
}
