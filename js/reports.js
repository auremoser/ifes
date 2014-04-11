(function() {
    'use strict'
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
            d.date = date.getTime()
        })

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
    function renderChart(data) {
        Highcharts.setOptions({
            lang: {
                contextButtonTitle: _('Graph context menu'),
                decimalPoint: _('.'),
                downloadJPEG: _('Download JPG'),
                downloadPDF: _('Download PDF'),
                downloadPNG: _('Download PNG'),
                downloadSVG: _('Download SVG'),
                months: [_('January'), _('February'), _('March'), _('April'), _('May'), _('June'), _('July'), _('August'), _('September'), _('October'), _('November'), _('December')],
                printChart: _('Print'),
                rangeSelectorFrom: _('From'),
                rangeSelectorTo: _('To'),
                rangeSelectorZoom: _('Zoom'),
                resetZoom: _('Reset zoom'),
                resetZoomTitle: _('Reset zoom level 1:1'),
                shortMonths: [_('Jan'), _('Feb'), _('Mar'), _('Apr'), _('May'), _('Jun'), _('Jul'), _('Aug'), _('Sep'), _('Oct'), _('Nov'), _('Dec')],
                thousandsSep: _(','),
                weekdays: [_('Sunday'), _('Monday'), _('Tuesday'), _('Wednesday'), _('Thursday'), _('Friday'), _('Saturday')]
            }
        });
        console.log(data);
        $('#reports').highcharts('StockChart', {
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
                    text: _('1M')
                }, {
                    type: 'month',
                    count: 3,
                    text: _('3M')
                }, {
                    type: 'year',
                    count: 1,
                    text: _('1Y')
                }, {
                    type: 'all',
                    text: _('All')
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
                text: _('Ushahidi Report Counts'),
                style: {
                    'color': '#E9322D'
                }
            },
            xAxis: {
                type: 'datetime'
                //reversed: _('axisOpposite')
            },
            yAxis: {
                title: {
                    align: 'middle',
                    text: _('Number of Reports'),
                    style: {
                        'color': '#EC7063'
                    }
                },
                opposite: _('axisOpposite')
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
            tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                    valueDecimals: 0
            },
            series: [{
                name: _('Total Reports'),
                data: posts,
            }, {
                name: _('Trusted'),
                data: trust,
            }, {
                name: _('Untrusted'),
                data: untrust,
            }]
        });
    }
})();
