(function() {
	'use strict'

	var csv = dsv(',');
	var colors = '#1f77b4 #aec7e8 #2ca02c #98df8a #d62728 #DD514C #9467bd #c5b0d5 #e377c2 #dbdb8d #17becf #9edae5 #f90'.split(' ');
	var atolls = [];
	var islands = [];
	
	$.ajax({
	    url: 'data/data-regions.csv',
	    success: parseCSV
	});
	
	
	function parseCSV(raw) {
	    var data = csv.parse(raw);
	    // console.log(data)
	
	    var c = 0;
	    var tmpAtolls = {};
	    data.forEach(function(d) {
	        if (!(d.atoll && d.island)) { return }
	        var atoll = tmpAtolls[d.atoll] || { y: 0, islands: {}, name: d.atoll, color: colors[c++] };
	        atoll.y++;
	        var island = atoll.islands[d.island] = atoll.islands[d.island] || { y: 0, name: d.island, color: atoll.color };
	        island.y++;
	        tmpAtolls[d.atoll] = atoll;
	    });
	
	    // console.log(tmpAtolls);
	
	    for (var tmp in tmpAtolls) {
	        atolls.push(tmpAtolls[tmp]);
	    }
	    atolls.sort(function(a,b) { return b.y - a.y });
	
	    atolls.forEach(function(d) {
	        var tmp = [];
	        for (var islandName in d.islands) {
	        	var island = d.islands[islandName]
	            island.color = Highcharts.Color(island.color).brighten(0.1).get('rgb')
	            tmp.push(island);
	        }
	        tmp.sort(function(a,b) { return b.y - a.y });
	        islands = islands.concat(tmp);
	    });
	
	    // console.log(atolls);
	    // console.log(islands);
	    render();
	}
	
	function render() {
	    $('#regions').highcharts({
	        chart: {
	            type: 'pie'
	        },
	        credits: {
	        	enabled: false
	        },
	        title: {
	            text: 'Incidents by Region (Atoll + Island)'
	        },
	        yAxis: {
	            title: {
	                text: 'Number of incidents'
	            }
	        },
	        plotOptions: {
	            pie: {
	                shadow: false,
	                center: ['50%', '50%']
	            }
	        },
	        tooltip: {
	         valueSuffix: ' incident(s)'
	        },
	        series: [{
	            name: 'Atolls',
	            data: atolls,
	            size: '60%',
	            dataLabels: {
	                enabled: false,
	                formatter: function() {
	                    return this.point.name;
	                },
	                color: 'white',
	                distance: -30
	            }
	        }, {
	            name: 'Islands',
	            data: islands,
	            size: '80%',
	            innerSize: '60%',
	            dataLabels: {
	                formatter: function() {
	                    // display only if larger than 1
	                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + ' incidents' : null;
	                }
	            }
	        }]
	    });
	}
})();
