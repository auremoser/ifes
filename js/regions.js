(function() {
	'use strict'

	var csv = dsv(',');
	var colors = '#1f77b4 #aec7e8 #2ca02c #98df8a #d62728 #DD514C #9467bd #c5b0d5 #e377c2 #dbdb8d #17becf #9edae5'.split(' ');
	
	$.ajax({
	    url: 'data/data-regions.csv',
	    success: parseCSV
	});
	
	var atolls = [];
	var islands = [];
	
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
	        for (var i in d.islands) {
	            tmp.push(d.islands[i]);
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
//NOTES
//string of array
//
//tmp Atolls sort split on space -> turn to 
//c = index of a color
//
//tmp atolls if it doesn' t exist y - o color get from array thing at position c, get whatevers there and then ++
//on atoll y++
//if islands ofor the island  adopt parent object's color
//island.y++
//tmp atolls - where you store attolls use name and assign it back to the attolls
//// made and object
//objects are never ordered (ruby has ordered hashes)
//turn it back into an array
//
//for (tmpgo over items in object)
//atolls pushed onto array and then sort ray by size of y
//for each atoll (ordered), for each island push onto islands array
//
/////ADD
//for each atoll go through each islandsort temporary array on item and then sort
//
//render