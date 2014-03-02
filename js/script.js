var csv = dsv(',');

$.ajax({
	url: 'data/data-posts.csv',
	success: parseData
});


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
			text: 'IFES Posts'
		},
		series: [{
			name: 'IFES',
			data: data
		}]
	});
}
