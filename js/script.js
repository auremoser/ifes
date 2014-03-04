/*
 * IMPORT + PARSE DATA
 */

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
/*
 * DRAW CHART
 */
function renderChart(data) {
	$('#container').highcharts('StockChart', {
		colors: [
			// colors taken from the palette on this site: http://www.electionguide.org/map/
			'#E9322D', '#EC7063', '#FBD8DB', '#666'
		],
		rangeSelector: {
		// defaults to most recent time for filter (so, 3M=3months from last date)
			enabled: true,
			buttons: [{
				type: 'month',
				count: 1,
				text: '1M'
			}, {
				type: 'month',
				count: 3,
				text: '3M'
			}, {
				type: 'year',
				count: 1,
				text: '1Y'
			}, {
				type: 'all',
				text: 'All'
			}],
			buttonSpacing: 2,
			buttonTheme: {
				stroke: 2,
				r: 5,
				style: {
					color: 'E9322D'
				},
				states: {
					hover: {
						fill: '#FBD8DB'
					},
					select: {
						fill: '#E9322D',
						style: {
							color: 'white'
						}
					}
				}
			},
			inputBoxBorderColor: '#EC7063'
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'IFES Report Tracker',
			style: {
				'color': '#E9322D'
			}
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			title: {
				align: 'middle',
				text: 'Number of Reports',
				style: {
					'color': '#EC7063'
				}
			}
		},
		legend: {
			enabled: true
		},
		navigator: {
			series: {
				color: '#FBD8DB'
			}
		},
		scrollbar: {
			barBackgroundColor: '#EC7063',
			barBorderRadius: 5,
			buttonBackgroundColor: '#EC7063',
			buttonBorderRadius: 5
		},
		series: [{
			name: 'Reports',
			data: data
		}]
	});
}
