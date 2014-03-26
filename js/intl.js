(function() {
	//'use strict';
	/*
	 * IMPORT + PARSE DATA
	 */
	var posts = [];
	var trust = [];
	var untrust = [];

	var csv = dsv(',');
	// get data from csv, pass to parse function
	$.ajax({
		url: 'data/data-posts.csv',
		success: parseData
	});

	// split D/M/YYYY format, month is 0 indexed (whaaat?) -> correct
	function parseData(str) {
		var data = csv.parse(str);
		data.forEach(function(d) {
			var mdy = d.date.split('/');
			var date = new Date(mdy[2], mdy[0] - 1, mdy[1]);
			d.date = date.getTime();
		});

		data.sort(function(a, b) { return a.date - b.date });

		data.forEach(function(d) {
			posts.push([d.date, +d.posts]);
			trust.push([d.date, +d.trust]);
			untrust.push([d.date, +d.untrust]);
		});

		renderChart(data);
	};
	/*
	 * DRAW CHART
	 */
	 // experimenting with example of flipped chart for internationalization:
	 // http://www.highcharts.com/docs/advanced-chart-features/internationalization
	 // edit lang via setOptions config

	function renderChart(data) {
		console.log(data);
		Highcharts.setOptions({
			lang: {
				contextButtonTitle: 'الرسم البياني قائمة السياق',
				decimalPoint: ',',
				downloadJPEG: 'تحميل JPG',
				downloadPDF: 'تحميل PDF',
				downloadPNG: 'تحميل PNG',
				downloadSVG: 'تحميل SVG',
				months: ['يناير', 'فبراير', 'مارس', 'أبريل/إبريل', 'مايو', 'يونيو/يونية', 'يوليو/يولية', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
				printChart: 'طباعة الرسم البياني',
				rangeSelectorFrom: 'من',
				rangeSelectorTo: 'إلى',
				rangeSelectorZoom: 'إزوم',
				resetZoom: 'إعادة تعيين التكبير',
				resetZoomTitle: 'إعادة تعيين مستوى التكبير 1:1',
				shortMonths: ['يناير', 'فبراير', 'مارس', 'أبريل/إبريل', 'مايو', 'يونيو/يونية', 'يوليو/يولية', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
				thousandsSep: '.',
				weekdays: ['يوم الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
			}
		});
		$('#intl').highcharts('StockChart', {
			colors: [
				// colors taken from the palette on this site: http://www.electionguide.org/map/
				'#E9322D', '#46A546', '#2C81BA' , '#EC7063', '#FBD8DB', '#666'
			],
			rangeSelector: {
			// defaults to most recent time for filter (so, 3M=3months from last date)
				enabled: true,
				buttons: [{
					type: 'month',
					count: 1,
					text: '1 شهر'
				}, {
					type: 'month',
					count: 3,
					text: '3 شهر'
				}, {
					type: 'year',
					count: 1,
					text: '1 سنة'
				}, {
					type: 'all',
					text: 'كل'
				}],
				buttonSpacing: 2,
				buttonTheme: {
					stroke: 2,
					r: 5,
					states: {
						select: {
							fill: '#2C81BA',
							style: {
								color: 'white'
							}
						}
					}
				},
				inputBoxBorderColor: '#2C81BA'
			},
			credits: {
				enabled: false
			},
			title: {
				text: 'تقرير تعقب IFES',
				style: {
					'color': '#2C81BA'
				},
				useHTML: Highcharts.hasBidiBug
			},
			xAxis: {
				type: 'datetime',
				reversed: true
			},
			yAxis: {
				title: {
					align: 'middle',
					text: 'عدد من تقارير',
					style: {
						'color': '#EC7063'
					},
					useHTML: Highcharts.hasBidiBug
				},
				opposite: true
			},
			legend: {
				enabled: true,
				useHTML: Highcharts.hasBidiBug
			},
			navigator: {
				enabled: true
				// series: {
				// 	color: '#FBD8DB'
				// }
			},
			scrollbar: {
				enabled: true
				// barBackgroundColor: '#EC7063',
				// barBorderRadius: 5,
				// buttonBackgroundColor: '#EC7063',
				// buttonBorderRadius: 5
			},
			tooltip: {
			    	pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
			    	valueDecimals: 0,
			    	useHTML: true
			},
			series: [{
				name: 'مجموع تقارير',
				data: posts
			}, {
			 	name: 'تقارير موثوق',
			 	data: trust
			}, {
				name: 'تقارير غير موثوق بها',
				data: untrust
			}]
		});
	}
})();

// TODO
// Check dataTime label format for arabic: http://jsfiddle.net/NKNnM/
// Figure out scrollbar and navigator reverse option if possible
// Figure out dates and why ticks don't display
// Figure out setOptions syntax error

